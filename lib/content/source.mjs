import { readSupabaseConfig } from "../supabase/config.mjs";
import { MAX_CATALOG_BYTES, validateCatalog } from "./catalog.mjs";

const CATALOG_RESPONSE_LIMIT = MAX_CATALOG_BYTES + 1024 * 1024;
const PUBLICATION_RESPONSE_LIMIT = 16 * 1024;
const SNAPSHOT_SELECT = "revision,release_id,course_releases!inner(schema_version,catalog)";
const PUBLICATION_SELECT = "revision,release_id";
const RELEASE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

async function readBoundedJson(response, maximum) {
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

async function fetchPublicationRow(env, fetcher, select, maximum) {
  const config = readSupabaseConfig(env);
  if (!config.enabled) throw new CourseContentError("missing_supabase_config");
  const url = new URL(`${config.url}/rest/v1/course_publication`);
  url.searchParams.set("id", "eq.1");
  url.searchParams.set("select", select);
  url.searchParams.set("limit", "1");
  const headers = { apikey: config.publishableKey, Accept: "application/json" };
  // Modern publishable keys are opaque, not JWTs. The API gateway accepts apikey.
  if (!config.publishableKey.startsWith("sb_publishable_")) headers.Authorization = `Bearer ${config.publishableKey}`;
  let response;
  try {
    response = await fetcher(url, { headers, cache: "no-store", signal: AbortSignal.timeout(10000), redirect: "error" });
  } catch { throw new CourseContentError("connection_failed"); }
  if (!response.ok) throw new CourseContentError(`http_${response.status}`);
  const rows = await readBoundedJson(response, maximum);
  if (!Array.isArray(rows) || rows.length !== 1 || !rows[0] || typeof rows[0] !== "object") {
    throw new CourseContentError("no_published_release");
  }
  return rows[0];
}

function publicationIdentity(row) {
  if (row.release_id === null || row.release_id === undefined) throw new CourseContentError("no_published_release");
  if (!Number.isSafeInteger(row.revision) || row.revision < 0 || typeof row.release_id !== "string" || !RELEASE_ID.test(row.release_id)) {
    throw new CourseContentError("invalid_publication");
  }
  return { revision: row.revision, releaseId: row.release_id };
}

async function fetchPublicationIdentity(env, fetcher) {
  return publicationIdentity(await fetchPublicationRow(env, fetcher, PUBLICATION_SELECT, PUBLICATION_RESPONSE_LIMIT));
}

/** The revision, release ID and catalog come from the same database snapshot. */
async function fetchPublishedSnapshot(env, fetcher) {
  const row = await fetchPublicationRow(env, fetcher, SNAPSHOT_SELECT, CATALOG_RESPONSE_LIMIT);
  if (!row.course_releases?.catalog) throw new CourseContentError("no_published_release");
  if (![1, 2].includes(row.course_releases.schema_version)) throw new CourseContentError("unsupported_schema_version");
  const identity = publicationIdentity(row);
  let catalog;
  try { catalog = validateCatalog(row.course_releases.catalog); }
  catch { throw new CourseContentError("invalid_published_catalog"); }
  return { ...identity, catalog };
}

/** Uses the publishable key only. The joined SELECT cannot mix releases. */
export async function fetchPublishedCatalog(env = process.env, fetcher = fetch) {
  return (await fetchPublishedSnapshot(env, fetcher)).catalog;
}

/** Revalidate the publication every 30 seconds; reload its catalog only on change.
 * Concurrent readers share a load. Expired content is never returned on failure.
 * A custom load retains the original TTL-only contract for injected loaders. */
export function createPublishedCatalogReader({
  load,
  env = process.env,
  fetcher = fetch,
  now = () => performance.now(),
  ttlMs = 30000,
} = {}) {
  let value;
  let snapshot;
  let expiresAt = 0;
  let inFlight;

  const refresh = async () => {
    if (load) return load();
    if (snapshot) {
      const published = await fetchPublicationIdentity(env, fetcher);
      if (published.revision === snapshot.revision && published.releaseId === snapshot.releaseId) {
        return snapshot.catalog;
      }
    }
    // Publication may change after the identity check. Only store the identity
    // returned with this catalog, never the identity from that earlier request.
    const next = await fetchPublishedSnapshot(env, fetcher);
    snapshot = next;
    return next.catalog;
  };

  return async () => {
    if (value && now() < expiresAt) return value;
    if (!inFlight) {
      inFlight = Promise.resolve().then(refresh).then(catalog => {
        value = catalog;
        expiresAt = now() + ttlMs;
        return catalog;
      }).finally(() => { inFlight = undefined; });
    }
    return inFlight;
  };
}
