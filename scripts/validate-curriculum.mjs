import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const run = promisify(execFile);
const scratch = await mkdtemp(join(tmpdir(), 'learn-rust-validate-'));
const files = ['curriculum', 'curriculum-foundations', 'curriculum-systems', 'curriculum-practice', 'projects'];
const sourceHashes = {};
try {
 for (const name of files) {
  const source = await readFile(new URL(`../src/data/${name}.ts`, import.meta.url), 'utf8');
  sourceHashes[name] = createHash('sha256').update(source).digest('hex');
  const output = ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/from "\.\/(curriculum-[a-z-]+)"/g, 'from "./$1.mjs"');
  await writeFile(join(scratch, `${name}.mjs`), output);
 }
 const { modules, lessons } = await import(pathToFileURL(join(scratch, 'curriculum.mjs')).href);
 const { projects } = await import(pathToFileURL(join(scratch, 'projects.mjs')).href);
 assert.equal(modules.length,20); assert.equal(lessons.length,80); assert.equal(new Set(lessons.map(l=>l.id)).size,80);
 for(const m of modules) assert.equal(lessons.filter(l=>l.moduleId===m.id).length,4,m.id);
 for(const l of lessons) {
  assert(l.sections.length>=3,`${l.id}: theory`); assert(l.objectives.length>=2,`${l.id}: objectives`);
  assert(l.hints.length>=2,`${l.id}: hints`); assert(l.quiz.options.length>=3,`${l.id}: quiz`);
  assert(Number.isInteger(l.quiz.correct)&&l.quiz.correct>=0&&l.quiz.correct<l.quiz.options.length,`${l.id}: quiz answer`);
  assert(l.exercise.requirements.length>=2,`${l.id}: requirements`); assert(l.starterCode.trim(),`${l.id}: starter`);
  assert(!l.solutionCode.includes('todo!('),`${l.id}: unfinished solution`);
 }
 const compiler = (await run('rustc',['--version'])).stdout.trim();
 const items = [...lessons.map(l=>({...l,kind:'lesson'})),...projects.map(p=>({...p,kind:'project'}))];
 const outcomes = new Array(items.length); let cursor=0;
 async function worker(){
  while(cursor<items.length){const i=cursor++;const item=items[i];const file=join(scratch,`${item.kind}-${item.id}.rs`);const bin=join(scratch,`${item.kind}-${item.id}`);
   await writeFile(file,item.solutionCode);
   try{
    const compiled=await run('rustc',['--edition=2024','--crate-name','lesson_validation',file,'-o',bin],{timeout:30000,maxBuffer:1024*1024});
    const result=await run(bin,[],{timeout:10000,maxBuffer:1024*1024});
    const passed=result.stdout.replace(/\r\n/g,'\n').trim()===item.expectedOutput.replace(/\r\n/g,'\n').trim();
    outcomes[i]={kind:item.kind,id:item.id,passed,expected:item.expectedOutput,actual:result.stdout,warnings:compiled.stderr};
    if(!passed)console.error(`FAIL ${item.id}: output mismatch`);
   }catch(error){outcomes[i]={kind:item.kind,id:item.id,passed:false,error:error.stderr||error.message};console.error(`FAIL ${item.id}: ${outcomes[i].error}`);}
  }
 }
 await Promise.all([worker(),worker(),worker(),worker()]);
 const report={checkedAt:new Date().toISOString(),compiler,edition:'2024',sourceHashes,method:'Each unmodified solution compiled as its own executable; embedded assertions execute; stdout compared after newline normalization and trim.',total:items.length,passed:outcomes.filter(o=>o.passed).length,allPassed:outcomes.every(o=>o.passed),outcomes};
 await mkdir(resolve('reports'),{recursive:true}); await writeFile(resolve('reports/curriculum-validation.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({compiler,chapters:modules.length,lessons:lessons.length,projects:projects.length,passed:report.passed,total:report.total,allPassed:report.allPassed}));
 if(!report.allPassed)process.exitCode=1;
} finally { await rm(scratch,{recursive:true,force:true}); }
