#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createHash } from "node:crypto";
import { createPublishedCatalogReader } from "../lib/content/source.mjs";
import { canonicalCatalog } from "../lib/content/catalog.mjs";

const args = process.argv.slice(2);
let base = "http://127.0.0.1:3000";
let output = "reports/sidebar-performance/supabase-revalidation-after.json";
for (let i = 0; i < args.length; i++) {
  const value = args[++i];
  if (!value) throw new Error("Each option needs a value.");
  if (args[i - 1] === "--base") base = value;
  else if (args[i - 1] === "--output") output = value;
  else throw new Error("Unknown option.");
}
const endpoint = new URL(base);
if (!["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname) || !["http:", "https:"].includes(endpoint.protocol) || endpoint.username || endpoint.password) {
  throw new Error("Use a loopback application URL.");
}
const sha256 = value => createHash("sha256").update(value).digest("hex");
const rounded = value => Math.round(value * 100) / 100;
const configuration = await fetch(new URL("/api/public-config", endpoint), { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000) });
if (!configuration.ok) throw new Error("Public configuration unavailable.");
const config = await configuration.json();
if (!config.enabled || !config.url || !config.publishableKey) throw new Error("Supabase public configuration is disabled.");
// The public key stays in memory and is never written to a report or stdout.
const env = { SUPABASE_URL: config.url, SUPABASE_PUBLISHABLE_KEY: config.publishableKey };
let requests = [];

async function measuredFetch(input, options) {
  const start = performance.now();
  const row = { kind: new URL(input).searchParams.get("select") === "revision,release_id" ? "publication" : "catalog", status: null, decodedBytes: 0 };
  requests.push(row);
  const response = await fetch(input, options);
  row.status = response.status;
  row.ttfbMs = rounded(performance.now() - start);
  row.contentType = response.headers.get("content-type");
  row.contentEncoding = response.headers.get("content-encoding");
  row.declaredContentLength = response.headers.get("content-length");
  if (!response.body) return response;
  const reader = response.body.getReader();
  const body = new ReadableStream({
    async pull(controller) {
      try {
        const item = await reader.read();
        if (item.done) {
          row.bodyCompleteMs = rounded(performance.now() - start);
          controller.close();
        } else {
          row.decodedBytes += item.value.byteLength;
          controller.enqueue(item.value);
        }
      } catch (error) { controller.error(error); }
    },
    cancel(reason) { return reader.cancel(reason); },
  });
  return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
}

let tick = 0;
const ttlMs = 30000;
const read = createPublishedCatalogReader({ env, fetcher: measuredFetch, now: () => tick, ttlMs });
const results = [];
let first;
for (let run = 0; run < 4; run++) {
  requests = [];
  tick = run * ttlMs;
  const start = performance.now();
  try {
    const catalog = await read();
    const totalMs = rounded(performance.now() - start);
    if (run === 0) first = catalog;
    const row = {
      phase: run === 0 ? "initial-catalog" : "expired-revalidation",
      run,
      status: "passed",
      totalMs,
      requestCount: requests.length,
      reusedInitialCatalog: run > 0 ? catalog === first : null,
      lessons: catalog.lessons.length,
      courses: catalog.specializations.length,
      catalogSha256: sha256(canonicalCatalog(catalog)),
      requests,
    };
    results.push(row);
    console.log(JSON.stringify({ phase: row.phase, run, totalMs, requestCount: row.requestCount, decodedBytes: requests.reduce((sum, request) => sum + request.decodedBytes, 0), reusedInitialCatalog: row.reusedInitialCatalog }));
  } catch (error) {
    results.push({ phase: run === 0 ? "initial-catalog" : "expired-revalidation", run, status: "failed", error: error.code || "measurement_failed", totalMs: rounded(performance.now() - start), requestCount: requests.length, requests });
    break;
  }
}
const revalidations = results.filter(row => row.phase === "expired-revalidation");
const durations = revalidations.map(row => row.totalMs).sort((a, b) => a - b);
const status = results.length === 4 && results.every(row => row.status === "passed") && revalidations.every(row => row.reusedInitialCatalog && row.requestCount === 1 && row.requests[0].kind === "publication") ? "passed" : "review-required";
const report = {
  checkedAt: new Date().toISOString(),
  status,
  methodology: {
    reader: "createPublishedCatalogReader with the default publication-aware loader",
    loaderSha256: sha256(await readFile(new URL("../lib/content/source.mjs", import.meta.url))),
    process: "Separate Node process; no server restart, application process mutation, database write or publication change",
    clock: "Injected monotonic clock advances exactly 30 seconds between reads to exercise expiration without a blocking sleep; HTTPS transport and loader code are real",
    requests: "One initial catalog read and three sequential expired-cache revalidations; publication changes are reported for review rather than treated as unchanged",
    timing: "Reader duration includes network, body read and any validation; report hashing is outside the measured interval",
    byteMeaning: "Decoded Fetch response bytes, not compressed wire bytes; content encoding is retained for context",
    configuration: "Publishable config read from loopback into memory; no key or environment values are saved",
    scope: "Loader behavior and network cost only; not browser, rendering, production SLO or the live server cache",
  },
  medianRevalidationMs: durations.length ? durations[Math.floor(durations.length / 2)] : null,
  results,
};
await mkdir(dirname(resolve(output)), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ status, output, medianRevalidationMs: report.medianRevalidationMs }));
if (status !== "passed") process.exitCode = 1;
