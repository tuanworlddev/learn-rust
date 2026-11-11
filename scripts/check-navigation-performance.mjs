#!/usr/bin/env node
/** Compare local production HTML and Next.js RSC navigation responses.
 * This is an HTTP/payload probe, not a browser render/INP/LCP benchmark.
 * Uses this installed Next version's serializer and a server-returned router tree.
 */
import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createRequire } from "node:module";
import { gzipSync, brotliCompressSync, constants } from "node:zlib";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  assert.ok(args[i + 1] && !args[i + 1].startsWith("--"), name + " requires a value");
  return args[i + 1];
};
if (args.includes("--help")) {
  console.log("node scripts/check-navigation-performance.mjs [--base http://127.0.0.1:3000] [--label baseline] [--warmup 3] [--samples 8] [--output report.json]");
  process.exit(0);
}
const base = new URL(option("--base", "http://127.0.0.1:3000"));
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "This probe is intentionally restricted to the local review server");
const label = option("--label", "review");
const warmup = Number(option("--warmup", "3"));
const samples = Number(option("--samples", "8"));
assert.ok(Number.isInteger(warmup) && warmup >= 0 && warmup <= 5);
assert.ok(Number.isInteger(samples) && samples >= 3 && samples <= 20);
const output = option("--output", "reports/sidebar-performance/" + label + ".json");
const sourcePath = "/bai-hoc/backend-http";
const paths = [
  "/khoa-hoc/nen-tang",
  "/bai-hoc/ownership",
  "/khoa-hoc/backend",
  "/bai-hoc/backend-domain-boundaries",
  "/bai-hoc/backend-outbox",
  "/bai-hoc/backend-service-project",
];
const require = createRequire(import.meta.url);
const { prepareFlightRouterStateForRequest } = require("next/dist/client/flight-data-helpers.js");
const { setCacheBustingSearchParam } = require("next/dist/client/components/router-reducer/set-cache-busting-search-param.js");
const { RSC_HEADER, NEXT_ROUTER_STATE_TREE_HEADER, NEXT_URL } = require("next/dist/client/components/app-router-headers.js");
const selectedHeaders = ["content-type", "cache-control", "vary", "content-encoding", "content-length"];
const round = n => Math.round(n * 100) / 100;
const percentile = (values, p) => [...values].sort((a,b) => a-b)[Math.max(0, Math.ceil(values.length * p) - 1)];
const stats = values => ({ median: round(percentile(values, 0.5)), p95: round(percentile(values, 0.95)), min: round(Math.min(...values)), max: round(Math.max(...values)) });
const compressed = bytes => ({
  rawBytes: bytes.length,
  gzipBytes: gzipSync(bytes, { level: 6 }).length,
  brotliBytes: brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } }).length,
});
async function request(path, headers = {}) {
  const requestUrl = new URL(path, base);
  if (headers[RSC_HEADER]) await setCacheBustingSearchParam(requestUrl, headers);
  const start = performance.now();
  const response = await fetch(requestUrl, { headers: { "Accept-Encoding": "identity", ...headers }, signal: AbortSignal.timeout(30000), redirect: "manual", cache: "no-store" });
  const ttfb = performance.now() - start;
  const bytes = Buffer.from(await response.arrayBuffer());
  const total = performance.now() - start;
  assert.equal(response.status, 200, path + ": HTTP 200");
  assert.ok(!response.headers.get("content-encoding") || response.headers.get("content-encoding") === "identity", "Measured body must be uncompressed");
  return { bytes, ttfbMs: round(ttfb), totalMs: round(total), headers: Object.fromEntries(selectedHeaders.map(k => [k, response.headers.get(k)])) };
}
const startedAt = new Date().toISOString();
const prime = await request(sourcePath, { [RSC_HEADER]: "1" });
assert.match(prime.headers["content-type"], /^text\/x-component/);
const zero = prime.bytes.toString("utf8").split("\n").find(line => line.startsWith("0:"));
assert.ok(zero, "Next flight response includes root row");
const flight = JSON.parse(zero.slice(2), (_key, value) => value === "$undefined" ? undefined : value);
const sourceTree = flight.f?.[0]?.[0];
assert.ok(Array.isArray(sourceTree) && sourceTree[0] === "", "Read the actual full router tree from this build");
const routerState = prepareFlightRouterStateForRequest(sourceTree);
const rscHeaders = { [RSC_HEADER]: "1", [NEXT_ROUTER_STATE_TREE_HEADER]: routerState, [NEXT_URL]: sourcePath };
const results = [];
const assetRoutes = new Map();
const assetPaths = new Set();
for (const path of paths) {
  for (const mode of ["html", "rsc"]) {
    const headers = mode === "rsc" ? rscHeaders : {};
    for (let i = 0; i < warmup; i++) await request(path, headers);
    const measured = [];
    let representative;
    for (let i = 0; i < samples; i++) {
      const row = await request(path, headers);
      assert.match(row.headers["content-type"], mode === "rsc" ? /^text\/x-component/ : /^text\/html/);
      measured.push({ ttfbMs: row.ttfbMs, totalMs: row.totalMs, rawBytes: row.bytes.length });
      if (!representative) representative = row;
    }
    const body = representative.bytes.toString("utf8");
    if (mode === "html") {
      const assets = [...new Set([...body.matchAll(/<(?:script|link)\b[^>]+(?:src|href)="(\/_next\/static\/[^"]+\.(?:js|css))"/g)].map(m => m[1]))];
      assetRoutes.set(path, assets);
      for (const asset of assets) assetPaths.add(asset);
    }
    results.push({
      path, mode, from: mode === "rsc" ? sourcePath : null,
      status: "passed", headers: representative.headers,
      payload: compressed(representative.bytes),
      timingMs: { ttfb: stats(measured.map(r => r.ttfbMs)), completeBody: stats(measured.map(r => r.totalMs)) },
      serializedIndexMarkers: ["hello-rust", "wasm-bindings", "game-ecs"].filter(id => body.includes('"id":"' + id + '"')),
      samples: measured,
    });
    console.log(JSON.stringify({ path, mode, rawBytes: representative.bytes.length, medianTtfbMs: results.at(-1).timingMs.ttfb.median, medianTotalMs: results.at(-1).timingMs.completeBody.median }));
  }
}
const assets = [];
for (const path of assetPaths) {
  const row = await request(path);
  assets.push({ path, type: path.endsWith(".js") ? "js" : "css", ...compressed(row.bytes), cacheControl: row.headers["cache-control"] });
}
const assetsByPath = new Map(assets.map(a => [a.path, a]));
const initialAssets = paths.map(path => {
  const list = assetRoutes.get(path).map(p => assetsByPath.get(p));
  return { path, requests: list.length, js: list.filter(a => a.type === "js").reduce((out, a) => ({ rawBytes: out.rawBytes+a.rawBytes, gzipBytes: out.gzipBytes+a.gzipBytes, brotliBytes: out.brotliBytes+a.brotliBytes }), {rawBytes:0,gzipBytes:0,brotliBytes:0}), css: list.filter(a => a.type === "css").reduce((out, a) => ({ rawBytes: out.rawBytes+a.rawBytes, gzipBytes: out.gzipBytes+a.gzipBytes, brotliBytes: out.brotliBytes+a.brotliBytes }), {rawBytes:0,gzipBytes:0,brotliBytes:0}) };
});
const negotiated = await fetch(new URL(paths[4], base), { headers: { "Accept-Encoding": "gzip" }, signal: AbortSignal.timeout(30000) });
await negotiated.arrayBuffer();
const report = {
  startedAt, checkedAt: new Date().toISOString(), label, base: base.origin, status: "passed",
  gitHead: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  serverBuildId: flight.b,
  nextVersion: JSON.parse(await readFile("node_modules/next/package.json", "utf8")).version,
  methodology: {
    warmupRequestsPerCase: warmup, measuredRequestsPerCase: samples, sequential: true,
    transport: "Node fetch on loopback; keep-alive; Accept-Encoding identity; no browser/network/CPU throttling",
    gitIdentity: "gitHead identifies the checkout base, not proof that uncommitted source equals the running server. serverBuildId is read from this server Flight response.",
    rsc: "RSC:1 + Next-Router-State-Tree serialized by the installed Next helper from the server's actual source route flight tree + Next-Url + installed Next cache-busting query helper",
    sourceRoute: sourcePath, sourceRouterTree: sourceTree,
    compression: "Offline sizes of representative response: gzip level6 / Brotli quality4; estimates, not observed wire transfer bytes",
    cache: "Requests are no-store; the application can serve or revalidate its process-local catalog cache. Warm-up does not establish a cold Supabase miss or an expired-publication check.",
    initialObservedRequest: { ttfbMs: prime.ttfbMs, totalMs: prime.totalMs, rawBytes: prime.bytes.length, coldCacheGuaranteed: false },
    timing: "TTFB is time until response headers; completeBody includes receiving the entire body. p95 is nearest-rank over a small sample, not a production SLO.",
    browserLimitations: "Does not measure click-to-paint, React commits, sidebar identity/scroll, INP, LCP or browser cache reuse; those require separate UI evidence.",
    actualGzipNegotiation: { status: negotiated.status, contentEncoding: negotiated.headers.get("content-encoding") },
  },
  results, initialAssets, assets,
};
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ status: report.status, label, cases: results.length, output }));
