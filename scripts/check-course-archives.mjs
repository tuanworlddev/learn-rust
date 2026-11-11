#!/usr/bin/env node
/** Verify downloaded lab archives against the catalog, through the running app. */
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { unzipSync, strFromU8 } from "fflate";
import { readCourseSource } from "./lib/read-course-source.mjs";
import { canonicalCatalog, validateCatalog } from "../lib/content/catalog.mjs";
const args = process.argv.slice(2);
const option = (name, fallback) => { const i=args.indexOf(name); return i<0?fallback:args[i+1]; };
const base=option("--base","http://127.0.0.1:3000").replace(/\/$/,"");
const output=option("--output","reports/course-expansion/lab-archives.json");
const catalog=validateCatalog(readCourseSource());
const results=[];
for(const lesson of catalog.lessons.filter(item=>item.localLab)){
  const response=await fetch(base+"/api/lessons/"+lesson.id+"/lab",{signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,200,lesson.id+": HTTP download");
  assert.match(response.headers.get("content-type")??"",/application\/zip/);
  assert.match(response.headers.get("x-robots-tag")??"",/noindex/);
  const bytes=new Uint8Array(await response.arrayBuffer());
  assert.equal(Number(response.headers.get("content-length")),bytes.length);
  const files=unzipSync(bytes);
  const expected=lesson.localLab.files.map(file=>lesson.id+"/"+file.path);
  if(!expected.includes(lesson.id+"/LEARN_RUST.md"))expected.push(lesson.id+"/LEARN_RUST.md");
  assert.deepEqual(Object.keys(files).sort(),expected.sort(),lesson.id+": exact file paths");
  for(const file of lesson.localLab.files)assert.equal(strFromU8(files[lesson.id+"/"+file.path]),file.content,lesson.id+"/"+file.path+": exact bytes");
  results.push({lesson:lesson.id,files:Object.keys(files).length,bytes:bytes.length,sha256:createHash("sha256").update(bytes).digest("hex"),status:"passed"});
}
for(const id of ["khong-ton-tai","ownership"]){
  const response=await fetch(base+"/api/lessons/"+id+"/lab",{signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,404,id+": missing/non-lab lesson");
}
const report={checkedAt:new Date().toISOString(),base,catalogSha256:createHash("sha256").update(canonicalCatalog(catalog)).digest("hex"),status:"passed",archives:results.length,results};
await writeFile(output,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({status:report.status,archives:report.archives,output}));
