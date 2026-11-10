import { readSupabaseConfig } from "../supabase/config.mjs";
import { MAX_CATALOG_BYTES, validateCatalog } from "./catalog.mjs";

export class CourseContentError extends Error {
  constructor(code) {
    super(`Course content unavailable (${code}).`);
    this.name = "CourseContentError";
    this.code = code;
  }
}

export function courseContentSource(env = process.env) {
  const source = env.COURSE_CONTENT_SOURCE?.trim() || "bundled";
  if (source !== "bundled" && source !== "supabase") throw new CourseContentError("invalid_source");
  return source;
}

async function readBoundedJson(response) {
  const maximum = MAX_CATALOG_BYTES + 1024 * 1024;
  const declared = response.headers.get("content-length");
  if (declared && Number(declared) > maximum) throw new CourseContentError("payload_too_large");
  if (!response.body) throw new CourseContentError("empty_response");
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maximum) { await reader.cancel(); throw new CourseContentError("payload_too_large"); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    if (error instanceof CourseContentError) throw error;
    throw new CourseContentError("invalid_response");
  }
}

/** Uses the publishable key only. The nested SELECT has one database snapshot,
 * so a concurrent publication cannot mix a manifest with another release. */
export async function fetchPublishedCatalog(env = process.env, fetcher = fetch) {
  const config = readSupabaseConfig(env);
  if (!config.enabled) throw new CourseContentError("missing_supabase_config");
  const url = new URL(`${config.url}/rest/v1/course_publication`);
  url.searchParams.set("id", "eq.1");
  url.searchParams.set("select", "revision,release_id,course_releases!inner(catalog)");
  url.searchParams.set("limit", "1");
  const headers = { apikey: config.publishableKey, Accept: "application/json" };
  // Modern publishable keys are opaque, not JWTs. The API gateway accepts apikey.
  if (!config.publishableKey.startsWith("sb_publishable_")) headers.Authorization = `Bearer ${config.publishableKey}`;
  let response;
  try {
    response = await fetcher(url, { headers, cache: "no-store", signal: AbortSignal.timeout(10000), redirect: "error" });
  } catch { throw new CourseContentError("connection_failed"); }
  if (!response.ok) throw new CourseContentError(`http_${response.status}`);
  const rows = await readBoundedJson(response);
  if (!Array.isArray(rows) || rows.length !== 1 || !rows[0]?.course_releases?.catalog) throw new CourseContentError("no_published_release");
  try { return validateCatalog(rows[0].course_releases.catalog); }
  catch { throw new CourseContentError("invalid_published_catalog"); }
}

/** One validated snapshot per server process, refreshed at most every 30 seconds.
 * Concurrent readers share a load. Expired content is never returned on failure. */
export function createPublishedCatalogReader({ load = fetchPublishedCatalog, now = () => performance.now(), ttlMs = 30000 } = {}) {
  let value;
  let expiresAt = 0;
  let inFlight;
  return async () => {
    if (value && now() < expiresAt) return value;
    if (!inFlight) {
      inFlight = Promise.resolve().then(load).then(catalog => {
        value = catalog;
        expiresAt = now() + ttlMs;
        return catalog;
      }).finally(() => { inFlight = undefined; });
    }
    return inFlight;
  };
}
