#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";
import { readCourseSource } from "./lib/read-course-source.mjs";

const args = process.argv.slice(2);
const option = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const selectedTracks = option("--tracks")?.split(",");
const timeout = Number(option("--timeout-seconds") ?? 900) * 1000;
if (!Number.isFinite(timeout) || timeout < 1000 || timeout > 3600000) throw new Error("Invalid lab timeout");
const catalog = readCourseSource();
const selected = catalog.lessons.filter(lesson => lesson.localLab && (!selectedTracks || selectedTracks.includes(lesson.moduleId.replace(/^track-/, ""))));
const root = resolve("work/course-labs");
await mkdir(root, { recursive: true });
const results = [];
async function run(command, commandArgs, directory, limit = timeout) {
  return await new Promise(resolveRun => {
    const child = spawn(command, commandArgs, { cwd: directory, env: { ...process.env, CARGO_TARGET_DIR: join(root, "target"), CARGO_TERM_COLOR: "never" }, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", chunk => { output = (output + chunk).slice(-30000); });
    child.stderr.on("data", chunk => { output = (output + chunk).slice(-30000); });
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; child.kill("SIGTERM"); }, limit);
    child.on("error", error => { clearTimeout(timer); resolveRun({ status: -1, output: error.message, timedOut }); });
    child.on("close", status => { clearTimeout(timer); resolveRun({ status, output, timedOut }); });
  });
}
for (const lesson of selected) {
  const directory = join(root, lesson.id);
  await mkdir(directory, { recursive: true });
  for (const file of lesson.localLab.files) {
    const path = resolve(directory, file.path);
    if (!path.startsWith(directory + "/")) throw new Error("Unsafe lab path");
    await mkdir(resolve(path, ".."), { recursive: true });
    await writeFile(path, file.content);
  }
  if (!lesson.localLab.files.some(file => file.path === "Cargo.toml")) {
    results.push({ lesson: lesson.id, status: "manual", reason: "No root Cargo manifest" });
    continue;
  }
  console.log("Checking " + lesson.id);
  const result = await run("cargo", ["test", "--workspace", "--all-targets"], directory);
  const logPath = join(directory, "validation.log");
  await writeFile(logPath, result.output);
  const passed = result.status === 0 && !result.timedOut;
  results.push({ lesson: lesson.id, status: passed ? "passed" : "failed", timedOut: result.timedOut, logPath });
  console.log((passed ? "PASS " : "FAIL ") + lesson.id);
  if (!passed) console.log(result.output.slice(-4500));
}
const report = { checkedAt: new Date().toISOString(), command: "cargo test --workspace --all-targets", scope: "Host tests only; device, browser, signing and deployment checks are separate.", results };
await writeFile(resolve(option("--output") ?? "reports/local-lab-validation.json"), JSON.stringify(report, null, 2) + "\n");
if (results.some(result => result.status === "failed")) process.exitCode = 1;
