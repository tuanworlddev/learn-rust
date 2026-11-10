#!/usr/bin/env node
/** Execute the authored browser exercises with the real Rust compiler. */
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readCourseSource } from "./lib/read-course-source.mjs";

const args = process.argv.slice(2);
const option = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
if (args.includes("--help")) {
  console.log("node scripts/validate-course-rust.mjs [--all] [--track backend,data] [--output reports/specialization-validation.json]");
  process.exit(0);
}
const catalog = readCourseSource();
const tracks = option("--track")?.split(",");
const selected = catalog.lessons.filter(lesson => tracks ? tracks.includes(lesson.moduleId.replace(/^track-/, "")) : args.includes("--all") || lesson.moduleId.startsWith("track-"));
if (!selected.length) throw new Error("No lessons selected");
const compiler = spawnSync("rustc", ["--version"], { encoding: "utf8" });
if (compiler.status !== 0) throw new Error("A working rustc is required");
const workspace = await mkdtemp(join(tmpdir(), "learn-rust-curriculum-"));
const results = [];
const clean = text => text.replace(/\r\n/g, "\n").trimEnd();
try {
  for (const lesson of selected) {
    const directory = join(workspace, lesson.id);
    await mkdir(directory);
    const source = join(directory, "main.rs");
    const binary = join(directory, "lesson");
    await writeFile(source, lesson.solutionCode);
    const compile = spawnSync("rustc", ["--edition=2024", "--crate-name", "lesson", source, "-o", binary], { cwd: directory, encoding: "utf8", timeout: 30000, maxBuffer: 1024 * 1024 });
    const row = { id: lesson.id, sourceSha256: createHash("sha256").update(lesson.solutionCode).digest("hex"), compiled: compile.status === 0, ran: false, outputMatches: false };
    if (compile.status === 0) {
      const run = spawnSync(binary, [], { cwd: directory, encoding: "utf8", timeout: 8000, maxBuffer: 1024 * 1024 });
      row.ran = run.status === 0;
      row.outputMatches = clean(run.stdout ?? "") === clean(lesson.expectedOutput);
      if (!row.ran || !row.outputMatches) row.error = (run.stderr || `Expected: ${lesson.expectedOutput}\nActual: ${run.stdout}`).slice(0, 5000);
    } else row.error = (compile.stderr || compile.error?.message || "Compiler failed").slice(0, 5000);
    results.push(row);
    console.log(`${row.compiled && row.ran && row.outputMatches ? "PASS" : "FAIL"} ${lesson.id}`);
  }
} finally { await rm(workspace, { recursive: true, force: true }); }
const failed = results.filter(row => !row.compiled || !row.ran || !row.outputMatches);
const report = { checkedAt: new Date().toISOString(), compiler: compiler.stdout.trim(), edition: "2024", total: results.length, passed: results.length - failed.length, failed: failed.length, results };
const output = resolve(option("--output") ?? "reports/specialization-validation.json");
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`${report.passed}/${report.total} browser exercises compile, run assertions, and match expected output.`);
for (const row of failed) console.error(`${row.id}: ${row.error}`);
if (failed.length) process.exitCode = 1;
