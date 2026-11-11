import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readCourseSource } from "../../scripts/lib/read-course-source.mjs";
import { validateCatalog, canonicalCatalog, parseCourseExport } from "./catalog.mjs";
import { courseContentSource, fetchPublishedCatalog, createPublishedCatalogReader, CourseContentError } from "./source.mjs";
import { importCourse, parseImportArgs, isContentAdminKey } from "../../scripts/lib/course-import.mjs";

const foundation = readCourseSource({ foundationOnly: true });
const base = { modules: [foundation.modules[0]], lessons: [foundation.lessons[0]], specializations: [] };
const fixture = () => structuredClone(base);
const publicEnv = { SUPABASE_URL: "https://course-test.supabase.co", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_0123456789abcdef" };
const adminEnv = { SUPABASE_URL: "https://course-test.supabase.co", SUPABASE_CONTENT_ADMIN_KEY: "sb_secret_0123456789abcdef" };
const release = "11111111-1111-4111-8111-111111111111";
const response = value => new Response(JSON.stringify(value), { headers: { "content-type": "application/json" } });

test("existing foundation data satisfies the content contract", () => {
  assert.equal(validateCatalog(foundation).lessons.length, 80);
});
test("canonical content is independent of property insertion order", () => {
  const catalog = fixture();
  const reordered = { specializations: catalog.specializations, lessons: catalog.lessons, modules: catalog.modules };
  assert.equal(canonicalCatalog(catalog), canonicalCatalog(reordered));
});
test("duplicates, orphan module links and out-of-range quiz answers fail", () => {
  let catalog = fixture(); catalog.lessons.push(structuredClone(catalog.lessons[0]));
  assert.throws(() => validateCatalog(catalog), /duplicate ID/);
  catalog = fixture(); catalog.lessons[0].moduleId = "missing";
  assert.throws(() => validateCatalog(catalog), /unknown module/);
  catalog = fixture(); catalog.lessons[0].quiz.correct = 100;
  assert.throws(() => validateCatalog(catalog), /outside options/);
});
test("unsafe URLs, traversal in downloadable files and unknown fields fail", () => {
  let catalog = fixture(); catalog.lessons[0].reference.url = "javascript:alert(1)";
  assert.throws(() => validateCatalog(catalog), /HTTPS URL/);
  catalog = fixture(); catalog.lessons[0].illustration = { src: "//evil.example/a.png", alt: "diagram", caption: "caption" };
  assert.throws(() => validateCatalog(catalog), /HTTPS URL/);
  catalog = fixture(); catalog.lessons[0].localLab = { title: "Lab", instructions: "Learn", files: [{ path: "../../.env", content: "secret" }], commands: ["cargo test"], checks: ["Tests pass"] };
  assert.throws(() => validateCatalog(catalog), /safe relative/);
  catalog = fixture(); catalog.unexpected = true;
  assert.throws(() => validateCatalog(catalog), /unknown field/);
});
test("unsupported export versions and invalid source choices fail closed", () => {
  assert.throws(() => parseCourseExport({ schemaVersion: 999, catalog: fixture() }), /unsupported/);
  assert.equal(courseContentSource({}), "bundled");
  assert.equal(courseContentSource({ COURSE_CONTENT_SOURCE: "supabase" }), "supabase");
  assert.throws(() => courseContentSource({ COURSE_CONTENT_SOURCE: "typo" }), /invalid_source/);
});
test("published loader uses a single joined public read and validates the payload", async () => {
  let calls = 0;
  const catalog = await fetchPublishedCatalog(publicEnv, async (url, options) => {
    calls++;
    assert.match(String(url), /course_publication/);
    assert.equal(url.searchParams.get("select"), "revision,release_id,course_releases!inner(schema_version,catalog)");
    assert.equal(options.headers.apikey, publicEnv.SUPABASE_PUBLISHABLE_KEY);
    assert.equal(options.headers.Authorization, undefined);
    assert.equal(options.cache, "no-store");
    return response([{ revision: 1, release_id: release, course_releases: { schema_version: 1, catalog: fixture() } }]);
  });
  assert.equal(calls, 1);
  assert.equal(catalog.lessons[0].id, base.lessons[0].id);
});
test("loader never substitutes local data for missing, rejected or invalid releases", async () => {
  await assert.rejects(fetchPublishedCatalog({}, async () => { throw new Error("must not fetch"); }), error => error instanceof CourseContentError && error.code === "missing_supabase_config");
  await assert.rejects(fetchPublishedCatalog(publicEnv, async () => response([])), /no_published_release/);
  await assert.rejects(fetchPublishedCatalog(publicEnv, async () => new Response("private error", { status: 503 })), /http_503/);
  await assert.rejects(fetchPublishedCatalog(publicEnv, async () => response([{ course_releases: { schema_version: 1, catalog: {} } }])), /invalid_published_catalog/);
});
test("loader rejects oversized responses before parsing", async () => {
  await assert.rejects(fetchPublishedCatalog(publicEnv, async () => new Response("{}", { headers: { "content-length": "999999999" } })), /payload_too_large/);
});
test("public and admin key types are not interchangeable", () => {
  assert.equal(isContentAdminKey(publicEnv.SUPABASE_PUBLISHABLE_KEY), false);
  assert.equal(isContentAdminKey(adminEnv.SUPABASE_CONTENT_ADMIN_KEY), true);
  const anon = `aaa.${Buffer.from(JSON.stringify({ role: "anon" })).toString("base64url")}.bbb`;
  const service = `aaa.${Buffer.from(JSON.stringify({ role: "service_role" })).toString("base64url")}.bbb`;
  assert.equal(isContentAdminKey(anon), false);
  assert.equal(isContentAdminKey(service), true);
});
test("import options reject ambiguity and default to dry-run", () => {
  assert.equal(parseImportArgs([]).apply, false);
  assert.throws(() => parseImportArgs(["--apply", "--apply"]), /Duplicate/);
  assert.throws(() => parseImportArgs(["--release", release]), /--publish/);
  assert.throws(() => parseImportArgs(["--expected-revision", "-1", "--publish"]), /non-negative/);
  assert.throws(() => parseImportArgs(["--file", "one.json", "--release", release, "--publish"]), /Choose/);
});

async function exportFixture(run) {
  const folder = await mkdtemp(join(tmpdir(), "learn-rust-content-test-"));
  const file = join(folder, "course.json");
  await writeFile(file, JSON.stringify({ schemaVersion: 1, catalog: fixture() }));
  try { await run(file); } finally { await rm(folder, { recursive: true, force: true }); }
}

test("dry-run validates all content without credentials or a network request", async () => exportFixture(async file => {
  const summary = await importCourse(parseImportArgs(["--file", file, "--publish"]), { env: {}, fetcher: async () => { throw new Error("must not fetch"); } });
  assert.equal(summary.mode, "dry-run"); assert.equal(summary.writes, 0); assert.equal(summary.lessons, 1);
}));
test("apply without publish only stages a private release", async () => exportFixture(async file => {
  const calls = [];
  const result = await importCourse(parseImportArgs(["--file", file, "--apply"]), { env: adminEnv, fetcher: async (url, options) => {
    calls.push(url); assert.match(url, /rpc\/stage_course_release$/); assert.equal(options.method, "POST"); return response(release);
  } });
  assert.equal(calls.length, 1); assert.equal(result.published, false); assert.equal(result.releaseId, release);
}));
test("publish reads revision first and passes that exact revision to the atomic RPC", async () => exportFixture(async file => {
  const calls = [];
  const result = await importCourse(parseImportArgs(["--file", file, "--apply", "--publish"]), { env: adminEnv, fetcher: async (url, options) => {
    calls.push(url);
    if (url.includes("course_publication?")) return response([{ revision: 7, release_id: release }]);
    if (url.endsWith("stage_course_release")) return response(release);
    assert.equal(JSON.parse(options.body).p_expected_revision, 7);
    return response({ release_id: release, revision: 8, changed: true });
  } });
  assert.equal(calls.length, 3); assert.equal(result.revision, 8);
}));
test("publication conflict and invalid expected revision never retry a write", async () => exportFixture(async file => {
  let writes = 0;
  await assert.rejects(importCourse(parseImportArgs(["--file", file, "--apply", "--publish"]), { env: adminEnv, fetcher: async (url, options) => {
    if (options.method === "POST") writes++;
    if (url.includes("course_publication?")) return response([{ revision: 4, release_id: release }]);
    if (url.endsWith("stage_course_release")) return response(release);
    return new Response(JSON.stringify({ code: "40001", message: "do not echo private payload" }), { status: 409 });
  } }), /nothing was overwritten/);
  assert.equal(writes, 2);
  writes = 0;
  await assert.rejects(importCourse(parseImportArgs(["--file", file, "--apply", "--publish", "--expected-revision", "3"]), { env: adminEnv, fetcher: async () => { writes++; return response([{ revision: 4, release_id: release }]); } }), /Review before publishing/);
  assert.equal(writes, 1);
}));

test("published snapshot coalesces concurrent loads and refreshes after its TTL", async () => {
  let tick = 0;
  let calls = 0;
  const read = createPublishedCatalogReader({ now: () => tick, ttlMs: 30, load: async () => ({ version: ++calls }) });
  const [a, b] = await Promise.all([read(), read()]);
  assert.equal(calls, 1);
  assert.equal(a, b);
  tick = 29;
  assert.equal(await read(), a);
  tick = 30;
  assert.equal((await read()).version, 2);
  assert.equal(calls, 2);
});
test("expired snapshots are not served when refresh fails; later calls can recover", async () => {
  let tick = 0;
  let unavailable = false;
  const read = createPublishedCatalogReader({ now: () => tick, ttlMs: 30, load: async () => {
    if (unavailable) throw new CourseContentError("connection_failed");
    return fixture();
  }});
  await read();
  tick = 31;
  unavailable = true;
  await assert.rejects(read(), /connection_failed/);
  await assert.rejects(read(), /connection_failed/);
  unavailable = false;
  assert.equal((await read()).lessons.length, 1);
});

function structuredFixture() {
  const all = readCourseSource();
  const track = all.specializations.find(item => item.chapters);
  return structuredClone({
    modules: all.modules.filter(item => item.id === "track-" + track.id),
    lessons: all.lessons.filter(item => track.lessonIds.includes(item.id)),
    specializations: [track],
  });
}
test("schema 1 remains readable and schema 2 validates chapters, projects and assessments", () => {
  assert.equal(parseCourseExport({ schemaVersion: 1, catalog: fixture() }).lessons.length, 1);
  const current = structuredFixture();
  assert.equal(parseCourseExport({ schemaVersion: 2, catalog: current }).specializations[0].projects.length, 3);
});
test("reordered chapters and cross-course project/remediation references cannot publish", () => {
  let catalog = structuredFixture();
  catalog.specializations[0].chapters.reverse();
  assert.throws(() => validateCatalog(catalog), /partition the ordered/);
  catalog = structuredFixture();
  catalog.specializations[0].projects[0].labLessonId = "other-course-lab";
  assert.throws(() => validateCatalog(catalog), /downloadable lab from this course/);
  catalog = structuredFixture();
  catalog.specializations[0].assessment.questions[0].lessonIds = ["other-course-lesson"];
  assert.throws(() => validateCatalog(catalog), /lesson outside course/);
  catalog = structuredFixture();
  catalog.specializations[0].assessment.skills[0].projectIds = ["missing-project"];
  assert.throws(() => validateCatalog(catalog), /unknown project/);
});
test("assessment cannot omit a chapter or use answers outside its options", () => {
  let catalog = structuredFixture();
  catalog.specializations[0].assessment.questions[0].correct = 10;
  assert.throws(() => validateCatalog(catalog), /answer outside options/);
  catalog = structuredFixture();
  const track = catalog.specializations[0];
  track.assessment.questions.forEach(question => { question.lessonIds = [track.lessonIds[0]]; });
  assert.throws(() => validateCatalog(catalog), /assessment omits a chapter/);
});
test("interactive trace rejects unknown nodes and duplicate scenarios", () => {
  let catalog = structuredFixture();
  let simulation = catalog.lessons.find(lesson => lesson.simulation).simulation;
  simulation.scenarios[0].steps[0].activeNodeIds = ["missing-node"];
  assert.throws(() => validateCatalog(catalog), /unknown simulation node/);
  catalog = structuredFixture();
  simulation = catalog.lessons.find(lesson => lesson.simulation).simulation;
  simulation.scenarios.push(structuredClone(simulation.scenarios[0]));
  assert.throws(() => validateCatalog(catalog), /duplicate ID/);
});
test("published loader accepts schema 2 and rejects unsupported release schemas", async () => {
  const current = structuredFixture();
  const loaded = await fetchPublishedCatalog(publicEnv, async () => response([{ course_releases: { schema_version: 2, catalog: current } }]));
  assert.equal(loaded.specializations[0].chapters.length, 6);
  await assert.rejects(fetchPublishedCatalog(publicEnv, async () => response([{ course_releases: { schema_version: 99, catalog: current } }])), /unsupported_schema_version/);
});
