import assert from "node:assert/strict";
import test from "node:test";
import { readSupabaseConfig } from "./config.mjs";
import { parseCloudSnapshot, parseProgressSnapshot } from "./snapshot.mjs";

const publicKey = "sb_publishable_test_key_for_validation_only";
const jwt = (role) => `${Buffer.from('{"alg":"HS256"}').toString("base64url")}.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.test`;
const progress = () => ({ completed: ["hello-world"], solved: [], bookmarks: [], quizzes: {}, lastLesson: "hello-world", goal: 30, minutes: { "2024-02-29": 5 }, notes: "Ghi chú Rust", finishedProjects: [] });

test("unconfigured integration stays off, incomplete settings do not leak values", () => {
  assert.deepEqual(readSupabaseConfig({}), { enabled: false, reason: "missing" });
  assert.deepEqual(readSupabaseConfig({ SUPABASE_URL: "https://example.supabase.co" }), { enabled: false, reason: "incomplete" });
});

test("only public key types can leave the server", () => {
  for (const key of ["sb_secret_abcdefghijklmnop", jwt("service_role"), jwt("authenticated"), "invalid"]) {
    assert.deepEqual(readSupabaseConfig({ SUPABASE_URL: "https://example.supabase.co", SUPABASE_PUBLISHABLE_KEY: key }), { enabled: false, reason: "invalid" });
  }
  assert.equal(readSupabaseConfig({ SUPABASE_URL: "https://example.supabase.co", SUPABASE_ANON_KEY: jwt("anon") }).enabled, true);
  assert.equal(readSupabaseConfig({ SUPABASE_URL: "https://example.supabase.co/", SUPABASE_PUBLISHABLE_KEY: publicKey }).enabled, true);
});

test("remote HTTP, URL credentials and URL parameters are rejected", () => {
  for (const url of ["http://example.com", "https://user:secret@example.com", "https://example.com/path", "https://example.com?key=value", "https://example.com#fragment"]) {
    assert.equal(readSupabaseConfig({ SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: publicKey }).enabled, false);
  }
  assert.equal(readSupabaseConfig({ SUPABASE_URL: "http://127.0.0.1:54321", SUPABASE_PUBLISHABLE_KEY: publicKey }).enabled, true);
});

test("cloud payload contains core progress only and de-duplicates IDs", () => {
  const value = { ...progress(), completed: ["hello-world", "hello-world"], access_token: "never-upload", drafts: { code: "private" }, careerEvidence: "local" };
  assert.deepEqual(parseProgressSnapshot(value), progress());
});

test("malformed, oversized and invalid calendar data cannot be restored", () => {
  assert.equal(parseProgressSnapshot({ ...progress(), notes: "a".repeat(120001) }), null);
  assert.equal(parseProgressSnapshot({ ...progress(), notes: "ắ".repeat(85000) }), null);
  assert.equal(parseProgressSnapshot({ ...progress(), minutes: { "2025-02-29": 1 } }), null);
  assert.equal(parseProgressSnapshot({ ...progress(), quizzes: { lesson: -1 } }), null);
  assert.equal(parseProgressSnapshot({ ...progress(), completed: ["__proto__"] }), null);
  assert.equal(parseProgressSnapshot({ ...progress(), notes: "a\u0000b" }), null);
  assert.equal(parseProgressSnapshot({ ...progress(), goal: 999 }), null);
});

test("cloud snapshot requires a supported version and timestamp", () => {
  assert.equal(parseCloudSnapshot({ version: 2, updated_at: new Date().toISOString(), snapshot: progress() }), null);
  assert.equal(parseCloudSnapshot({ version: 1, updated_at: "not-a-date", snapshot: progress() }), null);
  const valid = parseCloudSnapshot({ version: 1, updated_at: "2026-11-10T00:00:00Z", snapshot: progress() });
  assert.deepEqual(valid?.snapshot, progress());
});
