#!/usr/bin/env node
/** Assemble only the reviewed, unchanged private parts. This generates SQL; it never publishes. */
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { readCourseSource } from "./lib/read-course-source.mjs";
import { validateCatalog, canonicalCatalog } from "../lib/content/catalog.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; };
const directory = resolve(option("--parts", "work/course-sql-parts"));
const manifest = JSON.parse(await readFile(resolve(directory, "manifest.json"), "utf8"));
const staged = JSON.parse(await readFile(resolve(option("--staged", "work/course-staged-parts.json")), "utf8"));
const catalog = validateCatalog(readCourseSource());
const hash = createHash("sha256").update(canonicalCatalog(catalog)).digest("hex");
assert.equal(manifest.catalogSha256, hash, "Source changed: regenerate and review SQL parts first");
assert.equal(manifest.parts.length, catalog.specializations.length + 1, "Every course must be staged");
const quote = value => "'" + String(value).replaceAll("'", "''") + "'";
const rows = manifest.parts.map((part, index) => {
  assert.ok(part.complete, part.id + ": unfinished course");
  assert.equal(staged[part.id]?.canonicalSha256, part.canonicalSha256, part.id + ": staged source is stale or missing");
  assert.match(staged[part.id].releaseId, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  const expectedLabel = staged[part.id].actualLabel ?? part.label;
  assert.ok(typeof expectedLabel === "string" && expectedLabel.trim().length > 0 && expectedLabel.length <= 200, part.id + ": staged label must be a non-empty string of at most 200 characters");
  return "(" + index + ", " + quote(staged[part.id].releaseId) + "::uuid, " + quote(expectedLabel) + ", " + part.lessons + ")";
}).join(",\n");
const label = "Course expansion 2026-11-11 / complete / " + hash.slice(0, 12);
const sql = `begin;
create temporary table reviewed_course_parts(ordinal integer primary key, release_id uuid unique, expected_label text, expected_lessons integer) on commit drop;
insert into reviewed_course_parts values
${rows};
do $verify$
begin
  if exists (
    select 1 from reviewed_course_parts p left join public.course_releases r on r.id = p.release_id
    where r.id is null or r.label <> p.expected_label
       or jsonb_array_length(r.catalog->'lessons') <> p.expected_lessons
  ) then raise exception 'Reviewed course part missing or mismatched'; end if;
end;
$verify$;
with source as (
  select p.ordinal, r.catalog from reviewed_course_parts p
  join public.course_releases r on r.id = p.release_id
), assembled as (
  select jsonb_build_object(
    'modules', (select jsonb_agg(e.value order by s.ordinal, e.ordinality) from source s cross join lateral jsonb_array_elements(s.catalog->'modules') with ordinality e),
    'lessons', (select jsonb_agg(e.value order by s.ordinal, e.ordinality) from source s cross join lateral jsonb_array_elements(s.catalog->'lessons') with ordinality e),
    'specializations', (select jsonb_agg(e.value order by s.ordinal, e.ordinality) from source s cross join lateral jsonb_array_elements(s.catalog->'specializations') with ordinality e)
  ) as catalog
)
select public.stage_course_release(catalog, ${quote(label)}) as release_id,
       jsonb_array_length(catalog->'lessons') as lessons,
       jsonb_array_length(catalog->'specializations') as courses
from assembled;
commit;
`;
const output = resolve(option("--output", "work/course-sql-parts/merged-release.sql"));
await writeFile(output, sql);
console.log(JSON.stringify({ output, label, canonicalSha256: hash, lessons: catalog.lessons.length, courses: catalog.specializations.length, published: false }, null, 2));
