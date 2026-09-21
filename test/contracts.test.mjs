import test from 'node:test';
import assert from 'node:assert/strict';
import {validateTask,withinAllowedPath} from '../src/contracts.mjs';
test('task rejects traversal',()=>assert.throws(()=>validateTask({id:'task-001',allowed_paths:['../secret'],acceptance:['x']}),/ALLOWED_PATH_INVALID/));
test('allowed path is bounded',()=>{
  assert.equal(withinAllowedPath('src/a.mjs',['src']),true);
  assert.equal(withinAllowedPath('secret.txt',['src']),false);
});
