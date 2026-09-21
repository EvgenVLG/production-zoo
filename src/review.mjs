import {createHash} from 'node:crypto';
const sha=value=>createHash('sha256').update(String(value)).digest('hex');
export function reviewCandidate({task,headSha,diff,tests}){
  if(!headSha||!/^[0-9a-f]{40}$/i.test(headSha)) throw new Error('HEAD_SHA_REQUIRED');
  if(!tests?.passed) return {verdict:'FAIL',reason:'R0_NOT_PASSED'};
  const changed=[...diff.matchAll(/^diff --git a\/(.+?) b\/(.+?)$/gm)].map(m=>m[2]);
  const unexpected=changed.filter(p=>!task.allowed_paths.some(prefix=>p===prefix||p.startsWith(prefix.endsWith('/')?prefix:prefix+'/')));
  if(unexpected.length) return {verdict:'FAIL',reason:'UNEXPECTED_PATH',unexpected};
  const body=JSON.stringify({task_id:task.id,head_sha:headSha,diff_sha256:sha(diff),tests_sha256:sha(JSON.stringify(tests))});
  return {verdict:'PASS',task_id:task.id,head_sha:headSha,receipt_sha256:sha(body),evidence:'FIXTURE_REVIEW'};
}
