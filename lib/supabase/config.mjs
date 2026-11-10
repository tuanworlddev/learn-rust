const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** This only checks key type; Supabase verifies the key itself on requests. */
export function isPublicSupabaseKey(value) {
  if (typeof value !== "string" || value.length > 4096) return false;
  if (/^sb_publishable_[A-Za-z0-9_-]{16,}$/.test(value)) return true;
  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)) return false;
  try {
    const payload = JSON.parse(Buffer.from(value.split(".")[1], "base64url").toString("utf8"));
    return payload !== null && typeof payload === "object" && payload.role === "anon";
  } catch {
    return false;
  }
}

export function normalizeSupabaseUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const url = new URL(value.trim());
    const localHttp = url.protocol === "http:" && LOOPBACK_HOSTS.has(url.hostname);
    if (url.protocol !== "https:" && !localHttp) return null;
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** Never include the reason or an environment value in a learner-facing error. */
export function readSupabaseConfig(env = process.env) {
  const rawUrl = env.SUPABASE_URL?.trim() || "";
  const key = env.SUPABASE_PUBLISHABLE_KEY?.trim() || env.SUPABASE_ANON_KEY?.trim() || "";
  if (!rawUrl && !key) return { enabled: false, reason: "missing" };
  if (!rawUrl || !key) return { enabled: false, reason: "incomplete" };
  const url = normalizeSupabaseUrl(rawUrl);
  if (!url || !isPublicSupabaseKey(key)) return { enabled: false, reason: "invalid" };
  return { enabled: true, url, publishableKey: key };
}
