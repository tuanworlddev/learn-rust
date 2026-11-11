#!/usr/bin/env node
/** Prepare bounded, independently valid course releases for the SQL editor.
 * Each part is private until the final merged release is atomically published. */
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";
import { readCourseSource } from "./lib/read-course-source.mjs";
import { validateCatalog, canonicalCatalog, CATALOG_SCHEMA_VERSION } from "../lib/content/catalog.mjs";

const args = process.argv.slice(2);
const at = args.indexOf("--out");
const directory = resolve(at >= 0 ? args[at + 1] : "work/course-sql-parts");
const catalog = validateCatalog(readCourseSource());
const hash = value => createHash("sha256").update(canonicalCatalog(value)).digest("hex");
const parts = [
  { id: "foundation", catalog: { modules: catalog.modules.filter(item => !item.id.startsWith("track-")), lessons: catalog.lessons.filter(item => !item.moduleId.startsWith("track-")), specializations: [] } },
  ...catalog.specializations.map(track => ({ id: track.id, catalog: { modules: catalog.modules.filter(item => item.id === "track-" + track.id), lessons: catalog.lessons.filter(item => track.lessonIds.includes(item.id)), specializations: [track] } })),
];
await mkdir(directory, { recursive: true });
const manifest = [];
for (const [index, part] of parts.entries()) {
  validateCatalog(part.catalog);
  const sha256 = hash(part.catalog);
  const json = JSON.stringify(part.catalog);
  const tag = "$course_" + sha256.slice(0, 16) + "$";
  if (json.includes(tag)) throw new Error("Unexpected SQL delimiter in catalog");
  const label = "Course expansion 2026-11-11 / " + part.id + " / " + sha256.slice(0, 12);
  const sql = "select public.stage_course_release(" + tag + json + tag + "::jsonb, '" + label + "') as release_id;\n";
  const file = String(index).padStart(2, "0") + "-" + part.id + ".sql";
  await writeFile(join(directory, file), sql);
  manifest.push({ id: part.id, file, label, canonicalSha256: sha256, sqlBytes: Buffer.byteLength(sql), lessons: part.catalog.lessons.length, complete: part.id === "foundation" || Boolean(part.catalog.specializations[0]?.chapters) });
}
await writeFile(join(directory, "catalog.json"), JSON.stringify({ schemaVersion: CATALOG_SCHEMA_VERSION, catalog }));
await writeFile(join(directory, "manifest.json"), JSON.stringify({ catalogSha256: hash(catalog), parts: manifest }, null, 2) + "\n");
console.log(JSON.stringify({ directory, catalogSha256: hash(catalog), parts: manifest.map(({ id, file, lessons, sqlBytes, complete }) => ({ id, file, lessons, sqlBytes, complete })) }, null, 2));
