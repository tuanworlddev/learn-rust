import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { normalizeSupabaseUrl } from "../../lib/supabase/config.mjs";
import { canonicalCatalog, MAX_CATALOG_BYTES, parseCourseExport, validateCatalog } from "../../lib/content/catalog.mjs";

const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

export function isContentAdminKey(value) {
  if (typeof value !== "string" || value.length > 4096) return false;
  if (/^sb_secret_[A-Za-z0-9_-]{16,}$/.test(value)) return true;
  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)) return false;
  try { return JSON.parse(Buffer.from(value.split(".")[1], "base64url").toString("utf8"))?.role === "service_role"; }
  catch { return false; }
}

export function parseImportArgs(args) {
  const options = { apply: false, publish: false, file: "outputs/course-content.json", label: "Learn Rust course release" };
  const seen = new Set();
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    if (seen.has(flag)) throw new Error(`Duplicate option: ${flag}`);
    seen.add(flag);
    if (flag === "--apply") options.apply = true;
    else if (flag === "--publish") options.publish = true;
    else if (["--file", "--label", "--release", "--expected-revision"].includes(flag)) {
      const value = args[++index];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${flag}`);
      if (flag === "--file") options.file = value;
      else if (flag === "--label") options.label = value;
      else if (flag === "--release") options.release = value;
      else {
        if (!/^(0|[1-9][0-9]{0,14})$/.test(value)) throw new Error("Expected revision must be a non-negative integer.");
        options.expectedRevision = Number(value);
      }
    } else throw new Error(`Unknown option: ${flag}`);
  }
  if (options.label.trim().length < 1 || options.label.length > 200) throw new Error("Release label must contain 1–200 characters.");
  if (options.release && !UUID.test(options.release)) throw new Error("Release must be a UUID.");
  if (options.release && seen.has("--file")) throw new Error("Choose a local export file or an existing release.");
  if (options.release && !options.publish) throw new Error("An existing release is selected with --publish.");
  if (options.expectedRevision !== undefined && !options.publish) throw new Error("--expected-revision requires --publish.");
  return options;
}

function adminApi(env, fetcher) {
  const url = normalizeSupabaseUrl(env.SUPABASE_URL);
  const key = env.SUPABASE_CONTENT_ADMIN_KEY?.trim();
  if (!url || !isContentAdminKey(key)) throw new Error("Set a valid SUPABASE_URL and import-only SUPABASE_CONTENT_ADMIN_KEY in a protected environment file.");
  const headers = { apikey: key, Accept: "application/json", "Content-Type": "application/json" };
  if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`;
  return async (path, body) => {
    let response;
    try {
      response = await fetcher(`${url}/rest/v1/${path}`, { method: body === undefined ? "GET" : "POST", headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(20000), redirect: "error" });
    } catch { throw new Error("Supabase content request failed. Check the project URL, connection and migration."); }
    if (!response.ok) {
      let code;
      try { code = (await response.json()).code; } catch { /* Never echo the service response or its payload. */ }
      if (code === "40001") throw new Error("Publication changed during this operation. Review the current release and retry; nothing was overwritten.");
      throw new Error(`Supabase content request rejected (HTTP ${response.status}). Check migration, key permissions and catalog validation.`);
    }
    try { return await response.json(); } catch { throw new Error("Supabase returned an invalid content response."); }
  };
}

/** Local exports are fully validated before even constructing a network client.
 * --apply stages an immutable private release; --publish also switches the live
 * pointer with an optimistic revision check. Dry-run never writes remotely. */
export async function importCourse(options, { env = process.env, fetcher = fetch } = {}) {
  let catalog;
  let api;
  if (options.release) {
    api = adminApi(env, fetcher);
    const rows = await api(`course_releases?id=eq.${encodeURIComponent(options.release)}&select=id,catalog&limit=1`);
    if (!Array.isArray(rows) || rows.length !== 1) throw new Error("The selected course release does not exist.");
    catalog = validateCatalog(rows[0].catalog);
  } else {
    const path = resolve(options.file);
    if ((await stat(path)).size > MAX_CATALOG_BYTES * 2) throw new Error("Course export file exceeds 32 MiB.");
    const document = JSON.parse(await readFile(path, "utf8"));
    catalog = parseCourseExport(document);
  }
  const canonical = canonicalCatalog(catalog);
  const summary = {
    mode: options.apply ? (options.publish ? "publish" : "stage") : "dry-run",
    modules: catalog.modules.length, lessons: catalog.lessons.length, specializations: catalog.specializations.length,
    catalogSha256: createHash("sha256").update(canonical).digest("hex"),
  };
  if (!options.apply) return { ...summary, writes: 0, next: options.publish ? "Add --apply to publish after review." : "Add --apply to stage a private release; add --publish to publish it." };
  api ??= adminApi(env, fetcher);
  let expectedRevision;
  if (options.publish) {
    const rows = await api("course_publication?id=eq.1&select=revision,release_id&limit=1");
    if (!Array.isArray(rows) || rows.length !== 1 || !Number.isSafeInteger(rows[0].revision) || rows[0].revision < 0) throw new Error("Course publication pointer is missing or invalid. Apply the migration first.");
    expectedRevision = options.expectedRevision ?? rows[0].revision;
    if (expectedRevision !== rows[0].revision) throw new Error("Expected revision differs from the published revision. Review before publishing.");
  }
  const releaseId = options.release ?? await api("rpc/stage_course_release", { p_catalog: JSON.parse(canonical), p_label: options.label });
  if (typeof releaseId !== "string" || !UUID.test(releaseId)) throw new Error("Supabase returned an invalid release ID.");
  if (!options.publish) return { ...summary, releaseId, published: false };
  const published = await api("rpc/publish_course_release", { p_release_id: releaseId, p_expected_revision: expectedRevision });
  if (!published || published.release_id !== releaseId || !Number.isSafeInteger(published.revision) || typeof published.changed !== "boolean") throw new Error("Unexpected publication response; read course_publication before retrying.");
  return { ...summary, releaseId, published: true, revision: published.revision, changed: published.changed };
}
