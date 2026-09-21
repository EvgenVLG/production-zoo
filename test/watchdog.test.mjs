import test from 'node:test';
import assert from 'node:assert/strict';
import {classifySession,decideRecovery,amendmentState} from '../src/watchdog.mjs';
const now=Date.parse('2026-09-21T19:00:00Z');
const iso=ms=>new Date(now-ms).toISOString();

test('recent live activity is active progress',()=>{
  assert.equal(classifySession({now,active:true,lastProgressAt:iso(30_000)}).health,'ACTIVE_PROGRESS');
});
test('busy without progress first warns then stalls',()=>{
  assert.equal(classifySession({now,active:true,lastProgressAt:iso(15*60_000)}).health,'BUSY_NO_PROGRESS');
  assert.equal(classifySession({now,active:true,lastProgressAt:iso(25*60_000)}).health,'STALLED');
});
test('permission and question waits are never actionable',()=>{
  assert.equal(classifySession({now,waitingPermission:true}).actionable,false);
  assert.equal(classifySession({now,waitingQuestion:true}).actionable,false);
});
test('interrupted unfinished resumes only outside observe mode',()=>{
  const c=classifySession({now,interrupted:true});
  assert.equal(decideRecovery({classification:c,mode:'observe'}).action,'none');
  assert.equal(decideRecovery({classification:c,mode:'recover-interrupted'}).action,'resume');
});
test('sent but unobserved amendment is preferred over generic nudge',()=>{
  const c=classifySession({now});
  assert.equal(decideRecovery({classification:c,mode:'recover-interrupted',pendingAmendment:{id:'a-1',state:'SENT'}}).action,'resend_amendment');
});
test('amendment lifecycle distinguishes delivery from progress',()=>{
  assert.equal(amendmentState({}),'DISCOVERED');
  assert.equal(amendmentState({sent:true}),'SENT');
  assert.equal(amendmentState({sent:true,observed:true}),'OBSERVED_IN_SESSION');
  assert.equal(amendmentState({sent:true,observed:true,progressAfter:true}),'PROGRESS_AFTER_AMENDMENT');
  assert.equal(amendmentState({sent:true,observed:true,progressAfter:true,checkpointAfter:true}),'CHECKPOINTED');
});
test('recovery exhaustion escalates instead of looping',()=>{
  assert.equal(classifySession({now,interrupted:true,recoveries:3}).health,'NEEDS_ATTENTION');
});
