import {execFile} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {promisify} from 'node:util';
import {validateTask} from './contracts.mjs';
import {reviewCandidate} from './review.mjs';
const execFileAsync=promisify(execFile);
const git=(cwd,...args)=>execFileAsync('git',args,{cwd,encoding:'utf8'});

export async function runFixturePipeline({root=null}={}){
  const workspace=root||await mkdtemp(join(tmpdir(),'production-zoo-'));
  const repo=join(workspace,'target');
  const bay=join(workspace,'bay-task-001');
  await mkdir(repo,{recursive:true});
  await git(repo,'init','-b','main');
  await git(repo,'config','user.email','fixture@invalid');
  await git(repo,'config','user.name','Production Zoo Fixture');
  await writeFile(join(repo,'component.txt'),'version=1\n');
  await writeFile(join(repo,'verify.mjs'),[
    "import {readFile} from 'node:fs/promises';",
    "const v=await readFile(new URL('./component.txt',import.meta.url),'utf8');",
    "if(v!=='version=2\\n') throw new Error('CLAIM_NOT_PROVEN');",
    "console.log('property verified: component version=2');",
    ""
  ].join('\n'));
  await git(repo,'add','component.txt','verify.mjs');
  await git(repo,'commit','-m','fixture baseline');

  const task=validateTask({
    id:'task-001',allowed_paths:['component.txt'],
    acceptance:['component.txt is exactly version=2 and verify.mjs passes'],
    risk:'low',review_tier:'fixture'
  });

  await git(repo,'worktree','add','-b','wip/task-001',bay,'main');
  await writeFile(join(bay,'component.txt'),'version=2\n');
  await git(bay,'add','component.txt');
  await git(bay,'commit','-m','task-001: update component to v2');

  const testRun=await execFileAsync(process.execPath,['verify.mjs'],{cwd:bay,encoding:'utf8'});
  const tests={passed:true,command:'node verify.mjs',stdout:testRun.stdout.trim()};
  const {stdout:headRaw}=await git(bay,'rev-parse','HEAD');
  const headSha=headRaw.trim();
  const {stdout:diff}=await git(repo,'diff','main...wip/task-001');
  const review=reviewCandidate({task,headSha,diff,tests});
  if(review.verdict!=='PASS') throw new Error('REVIEW_FAILED:'+review.reason);

  await git(repo,'merge','--ff-only','wip/task-001');
  const {stdout:integratedRaw}=await git(repo,'rev-parse','HEAD');
  const integratedSha=integratedRaw.trim();
  const content=await readFile(join(repo,'component.txt'),'utf8');

  return {schema:1,task_id:task.id,workspace,candidate_sha:headSha,integrated_sha:integratedSha,tests,review,integration:{kind:'LOCAL_FIXTURE',fast_forward:true,content}};
}
