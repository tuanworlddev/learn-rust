import { isIP } from "node:net";

/** Read at request time so one Docker image can be promoted between environments. */
export function getSiteConfig() {
  let origin: string | null = null;
  try {
    const value = process.env.SITE_URL?.trim();
    if (value) {
      const url = new URL(value);
      if (["http:", "https:"].includes(url.protocol) && !url.username && !url.password &&
          url.pathname === "/" && !url.search && !url.hash) origin = url.origin;
    }
  } catch { /* An incomplete setup must never emit a made-up canonical URL. */ }
  const hostname = origin ? new URL(origin).hostname : "";
  const labels = hostname.split(".");
  const local = !hostname || isIP(hostname.replace(/^\[|\]$/g, "")) !== 0 || labels.length < 2 ||
    labels.some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) ||
    /(^|\.)(localhost|local|internal|test|invalid|example|example\.com|example\.net|example\.org)$/.test(hostname);
  const indexable = process.env.SITE_INDEXABLE === "true" && !!origin &&
    origin.startsWith("https://") && !new URL(origin).port && !local;
  return { origin, indexable };
}
