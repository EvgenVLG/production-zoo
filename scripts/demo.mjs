#!/usr/bin/env node
import {runFixturePipeline} from '../src/pipeline.mjs';
console.log(JSON.stringify(await runFixturePipeline(),null,2));
