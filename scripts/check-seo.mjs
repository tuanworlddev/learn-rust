#!/usr/bin/env node
// HTTP-level checks: HTML visible without JavaScript, crawlable URLs and deployment metadata.
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  assert.ok(args[index + 1] && !args[index + 1].startsWith("--"), `${name} needs a value`);
  return args[index + 1];
};
if (args.includes("--help")) {
  console.log("node scripts/check-seo.mjs [--base http://127.0.0.1:3000] [--canonical https://your-domain] [--indexable] [--output report.json]");
  process.exit(0);
}
const base = new URL(option("--base", "http://127.0.0.1:3000")).origin;
const canonical = option("--canonical", "").replace(/\/$/, "");
const indexable = args.includes("--indexable");
const output = option("--output", "");
assert.ok(!indexable || canonical, "--indexable requires --canonical");
const results = [];
const decode = value => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, name, value]) => [name, decode(value)]));
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map(match => attrs(match[0]));
const textOnly = html => decode(html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
const unique = values => [...new Set(values)];
async function fetchPage(path, options = {}) {
  return fetch(`${base}${path}`, { ...options, signal: AbortSignal.timeout(30_000) });
}
async function checkPage(path, shouldIndex = indexable) {
  const response = await fetchPage(path);
  assert.equal(response.status, 200, `${path}: HTTP 200`);
  const raw = await response.text();
  const head = raw.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const body = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const meta = tags(head, "meta");
  const title = textOnly(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = meta.find(item => item.name === "description")?.content;
  const robots = meta.find(item => item.name === "robots")?.content ?? "";
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => textOnly(match[1]));
  assert.match(body, /<html[^>]+lang="vi"/, `${path}: Vietnamese language`);
  assert.ok(title && title.includes("Learn Rust"), `${path}: unique branded title in head`);
  assert.ok(description && description.length > 20, `${path}: description in head`);
  assert.equal(h1s.length, 1, `${path}: one server-rendered h1`);
  assert.equal(robots.includes("noindex"), !shouldIndex, `${path}: correct index policy`);
  const canonicalTags = tags(head, "link").filter(item => item.rel === "canonical");
  assert.equal(canonicalTags.length, canonical ? 1 : 0, `${path}: canonical count`);
  if (canonical) {
    assert.equal(new URL(canonicalTags[0].href).href, new URL(`${canonical}${path}`).href, `${path}: canonical origin/path`);
    assert.equal(new URL(meta.find(item => item.property === "og:url")?.content).href, new URL(`${canonical}${path}`).href, `${path}: Open Graph URL`);
    if (shouldIndex || !["/so-tay", "/thuc-hanh"].includes(path)) {
      const data = [...raw.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
      assert.ok(data.length > 0, `${path}: JSON-LD present`);
      assert.ok(data.flat().every(item => item["@context"] === "https://schema.org"), `${path}: valid JSON-LD context`);
    }
  }
  for (const phrase of ["Biên dịch qua", "Mỗi ví dụ có bản nháp riêng", "Không nhập dữ liệu bí mật", "chưa hỗ trợ stdin tương tác", ">Đi làm<"]) {
    assert.ok(!body.includes(phrase), `${path}: removed learner clutter (${phrase})`);
  }
  const main = body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  if (path.startsWith("/bai-hoc/")) {
    assert.ok(textOnly(main).length > 500, `${path}: lesson text delivered without JavaScript`);
    assert.ok(!h1s.includes("Học Rust"), `${path}: lesson route renders its own content`);
  }
  results.push({ path, title, heading: h1s[0], indexable: shouldIndex, status: response.status });
  return body;
}

const root = await checkPage("/");
const lessonPaths = unique(tags(root, "a").map(item => item.href).filter(href => /^\/bai-hoc\/[^/?#]+$/.test(href ?? "")));
assert.ok(lessonPaths.length > 0, "Foundation lessons linked in initial HTML");
const tracks = await checkPage("/chuyen-sau");
const trackPaths = unique(tags(tracks, "a").map(item => item.href).filter(href => /^\/chuyen-sau\/[^/?#]+$/.test(href ?? "")));
assert.ok(trackPaths.length > 0, "Specializations linked in initial HTML");
for (const path of trackPaths) {
  const html = await checkPage(path);
  const paths = unique(tags(html, "a").map(item => item.href).filter(href => /^\/bai-hoc\/[^/?#]+$/.test(href ?? "")));
  assert.ok(paths.length > 0, `${path}: lessons linked in initial HTML`);
  for (const lesson of paths) if (!lessonPaths.includes(lesson)) lessonPaths.push(lesson);
}
const projects = await checkPage("/du-an");
const projectPaths = unique(tags(projects, "a").map(item => item.href).filter(href => /^\/du-an\/[^/?#]+$/.test(href ?? "")));
assert.equal(projectPaths.length, 3, "All 3 practice projects linked in initial HTML");
const queue = [...lessonPaths, ...projectPaths, "/phong-van"];
// Bound concurrency so the check is safe to run on a small VPS.
for (let i = 0; i < queue.length; i += 4) await Promise.all(queue.slice(i, i + 4).map(path => checkPage(path)));
await checkPage("/thuc-hanh", false);
await checkPage("/so-tay", false);
assert.equal(unique(results.map(row => row.title)).length, results.length, "Every content route has its own title");
for (const [oldPath, destination] of [["/di-lam", "/phong-van"], ["/lo-trinh", "/"]]) {
  const response = await fetchPage(oldPath, { redirect: "manual" });
  assert.equal(response.status, 308, `${oldPath}: permanent redirect`);
  assert.equal(new URL(response.headers.get("location"), base).pathname, destination);
}
for (const path of ["/bai-hoc/seo-check-missing-lesson", "/chuyen-sau/seo-check-missing-track", "/constructor", "/toString", "/__proto__"]) {
  const missing = await fetchPage(path);
  assert.equal(missing.status, 404, `${path}: missing route returns HTTP 404`);
  const missingHtml = await missing.text();
  assert.match(missingHtml, /name="robots" content="noindex/, `${path}: missing route is noindex`);
}
const robots = await (await fetchPage("/robots.txt")).text();
assert.match(robots, /Disallow: \/api\//, "API paths excluded from crawler discovery");
assert.equal(robots.includes("Sitemap:"), indexable, "Sitemap advertised only for public release");
const sitemap = await (await fetchPage("/sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
const expected = indexable ? results.filter(item => item.indexable).map(item => `${canonical}${item.path}`).sort() : [];
assert.deepEqual(urls.sort(), expected, "Sitemap contains only the complete canonical public route set");
const image = await fetchPage("/opengraph-image");
assert.equal(image.status, 200, "Social preview image responds");
assert.match(image.headers.get("content-type") ?? "", /^image\/png/, "Social image is PNG");
const imageData = Buffer.from(await image.arrayBuffer());
assert.equal(imageData.readUInt32BE(16), 1200, "Social image width");
assert.equal(imageData.readUInt32BE(20), 630, "Social image height");
const report = { checkedAt: new Date().toISOString(), base, canonical: canonical || null, indexable, pages: results.length, lessons: lessonPaths.length, specializations: trackPaths.length, projects: projectPaths.length, sitemapUrls: urls.length, image: "1200x630 PNG", status: "passed", routes: results.sort((a, b) => a.path.localeCompare(b.path)) };
if (output) await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`SEO HTTP checks passed: ${report.pages} pages, ${report.lessons} lessons, ${report.projects} projects, ${report.sitemapUrls} sitemap URLs; redirects, 404, SSR, metadata and social image.`);
