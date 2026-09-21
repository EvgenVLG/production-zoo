export function validateTask(task){
  if(!task||typeof task!=='object') throw new Error('TASK_REQUIRED');
  if(!/^[a-z0-9][a-z0-9-]{2,63}$/.test(task.id||'')) throw new Error('TASK_ID_INVALID');
  if(!Array.isArray(task.allowed_paths)||!task.allowed_paths.length) throw new Error('ALLOWED_PATHS_REQUIRED');
  for(const p of task.allowed_paths){
    if(typeof p!=='string'||!p||p.startsWith('/')||p.includes('..')||p.includes('\\')) throw new Error('ALLOWED_PATH_INVALID');
  }
  if(!Array.isArray(task.acceptance)||!task.acceptance.length) throw new Error('ACCEPTANCE_REQUIRED');
  return Object.freeze({...task});
}
export function withinAllowedPath(path,allowed){
  return allowed.some(prefix=>path===prefix||path.startsWith(prefix.endsWith('/')?prefix:prefix+'/'));
}
