export const DEFAULT_WATCHDOG_POLICY=Object.freeze({
  warnNoProgressMs:10*60*1000,
  stallNoProgressMs:20*60*1000,
  maxRecoveries:3
});

export function classifySession({
  now=Date.now(),taskState='RUNNING',active=false,progressChanged=false,
  lastProgressAt=null,waitingPermission=false,waitingQuestion=false,
  interrupted=false,failed=false,finalResult=false,identityMismatch=false,
  recoveries=0,policy=DEFAULT_WATCHDOG_POLICY
}={}){
  const state=String(taskState||'').toUpperCase();
  if(state==='DONE'||finalResult) return {health:'DONE',actionable:false};
  if(state==='BLOCKED') return {health:'BLOCKED',actionable:false};
  if(state==='PAUSED') return {health:'PAUSED',actionable:false};
  if(state==='CANCELLED') return {health:'CANCELLED',actionable:false};
  if(identityMismatch) return {health:'UNKNOWN',actionable:false,reason:'IDENTITY_MISMATCH'};
  if(waitingPermission) return {health:'WAITING_PERMISSION',actionable:false};
  if(waitingQuestion) return {health:'WAITING_QUESTION',actionable:false};

  const prior=lastProgressAt==null?now:Date.parse(lastProgressAt);
  const progressAt=progressChanged||!Number.isFinite(prior)?now:prior;
  const idleMs=Math.max(0,now-progressAt);

  let health;
  if(active){
    if(idleMs<=policy.warnNoProgressMs) health='ACTIVE_PROGRESS';
    else if(idleMs<=policy.stallNoProgressMs) health='BUSY_NO_PROGRESS';
    else health='STALLED';
  }else if(interrupted) health='INTERRUPTED';
  else if(failed) health='TRANSIENT_ERROR';
  else health='IDLE_UNFINISHED';

  if(['INTERRUPTED','IDLE_UNFINISHED','TRANSIENT_ERROR','STALLED'].includes(health)&&recoveries>=policy.maxRecoveries){
    return {health:'NEEDS_ATTENTION',actionable:false,reason:'RECOVERIES_EXHAUSTED',idle_ms:idleMs};
  }
  return {health,actionable:['INTERRUPTED','IDLE_UNFINISHED','TRANSIENT_ERROR','STALLED'].includes(health),idle_ms:idleMs};
}

export function decideRecovery({classification,mode='observe',recoveries=0,pendingAmendment=null,policy=DEFAULT_WATCHDOG_POLICY}={}){
  if(mode==='observe') return {action:'none',reason:'OBSERVE_MODE'};
  const health=classification?.health;
  if(health==='STALLED'&&mode!=='recover-stalled') return {action:'none',reason:'STALL_RECOVERY_DISABLED'};
  if(!classification?.actionable) return {action:'none',reason:'HEALTH_NOT_ACTIONABLE'};
  if(recoveries>=policy.maxRecoveries) return {action:'none',reason:'RECOVERIES_EXHAUSTED',attention_required:true};
  if(pendingAmendment?.state==='SENT'&&pendingAmendment.id){
    return {action:'resend_amendment',amendment_id:pendingAmendment.id,reason:'SENT_NOT_OBSERVED'};
  }
  if(health==='STALLED') return {action:'interrupt_then_resume',reason:'CONFIRMED_STALL'};
  if(health==='IDLE_UNFINISHED') return {action:'nudge',reason:'IDLE_UNFINISHED'};
  return {action:'resume',reason:health};
}

export function amendmentState({sent=false,observed=false,progressAfter=false,checkpointAfter=false}={}){
  if(!sent) return 'DISCOVERED';
  if(!observed) return 'SENT';
  if(checkpointAfter) return 'CHECKPOINTED';
  if(progressAfter) return 'PROGRESS_AFTER_AMENDMENT';
  return 'OBSERVED_IN_SESSION';
}
