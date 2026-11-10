#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readCourseSource } from "./lib/read-course-source.mjs";
import { canonicalCatalog, CATALOG_SCHEMA_VERSION } from "../lib/content/catalog.mjs";

const args = process.argv.slice(2);
if (args.some((arg, index) => arg !== "--out" && args[index - 1] !== "--out") || args.filter(arg => arg === "--out").length > 1 || args.at(-1) === "--out") {
  console.error("Usage: node scripts/export-course-content.mjs [--out outputs/course-content.json]");
  process.exitCode = 1;
} else {
  try {
    const catalog = readCourseSource();
    const canonical = canonicalCatalog(catalog);
    const path = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "outputs/course-content.json");
    let sourceRevision;
    try { sourceRevision = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { /* Export also works from a release archive. */ }
    const document = { schemaVersion: CATALOG_SCHEMA_VERSION, exportedAt: new Date().toISOString(), ...(sourceRevision ? { sourceRevision } : {}), catalog: JSON.parse(canonical) };
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(document, null, 2)}\n`, { mode: 0o600 });
    console.log(JSON.stringify({ file: path, modules: catalog.modules.length, lessons: catalog.lessons.length, specializations: catalog.specializations.length, catalogSha256: createHash("sha256").update(canonical).digest("hex") }, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
