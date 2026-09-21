import test from 'node:test';
import assert from 'node:assert/strict';
import {runFixturePipeline} from '../src/pipeline.mjs';
test('fixture flow uses real git/worktree and exact review binding',async()=>{
  const r=await runFixturePipeline();
  assert.equal(r.tests.passed,true);
  assert.equal(r.review.verdict,'PASS');
  assert.equal(r.review.head_sha,r.candidate_sha);
  assert.equal(r.integrated_sha,r.candidate_sha);
  assert.equal(r.integration.content,'version=2\n');
});
