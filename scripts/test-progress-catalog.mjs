#!/usr/bin/env node
/**
 * Regression for publication/rollback preserving learner-owned progress.
 * Executes the current readProgress and load/save effects, not a copied parser.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import ts from "typescript";
import { readCourseSource } from "./lib/read-course-source.mjs";

const source = readFileSync(new URL("../components/learning-app.tsx", import.meta.url), "utf8");
const start = source.indexOf("function readProgress(");
const end = source.indexOf("\nexport default function LearningApp", start);
assert.ok(start >= 0 && end > start, "Current progress parser must be found");
const compile = code => ts.transpileModule(code, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const parserSource = compile(source.slice(start, end) + "\nexport { readProgress };");
const defaults = () => ({
  completed: [], solved: [], bookmarks: [], finishedProjects: [], quizzes: {},
  lastLesson: null, goal: 30, minutes: {}, notes: "",
});
const normalize = value => JSON.parse(JSON.stringify(value));
const fixture = () => ({
  ...defaults(),
  completed: ["hello-rust", "backend-runtime"],
  solved: ["backend-runtime"],
  bookmarks: ["backend-runtime", "archived_lesson"],
  finishedProjects: ["retired-project"],
  quizzes: { "backend-runtime": 1, archived_lesson: 20 },
  lastLesson: "backend-runtime",
  notes: "Giữ ghi chú qua mỗi lần xuất bản.",
  minutes: { "2026-11-10": 25 },
});
function parser() {
  const context = createContext({
    exports: {}, initialProgress: defaults(),
    isRecord: value => value !== null && typeof value === "object" && !Array.isArray(value),
  });
  runInContext(parserSource, context);
  return context.exports.readProgress;
}
const readProgress = parser();
const full = readCourseSource().lessons;
const base = full.filter(lesson => !lesson.moduleId.startsWith("track-"));

test("a full → foundation-only → full catalog cycle preserves lesson and project progress", () => {
  // Extra JS arguments deliberately exercise the old call shape that caused loss.
  const before = readProgress(fixture(), full);
  const duringRollback = readProgress(before, base);
  const restored = readProgress(duringRollback, full);
  assert.deepEqual(normalize(before), fixture());
  assert.deepEqual(normalize(duringRollback), fixture());
  assert.deepEqual(normalize(restored), fixture());
});

test("malformed IDs and answers are cleaned without rejecting valid hidden lessons", () => {
  const progress = readProgress({
    ...fixture(),
    completed: ["backend-runtime", "backend-runtime", "../bad", "", 3, "_bad", "okay_hidden"],
    solved: ["bad/id", "retired-lesson"],
    bookmarks: [null, "constructor", "future_lesson"],
    finishedProjects: ["old-project", "old-project", "../../file"],
    quizzes: { "hidden_lesson": 20, "negative": -1, "fraction": 1.5, "large": 21, "bad/id": 0, "text": "1" },
    lastLesson: "../bad",
  });
  assert.deepEqual(normalize(progress.completed), ["backend-runtime", "okay_hidden"]);
  assert.deepEqual(normalize(progress.solved), ["retired-lesson"]);
  assert.deepEqual(normalize(progress.bookmarks), ["constructor", "future_lesson"]);
  assert.deepEqual(normalize(progress.finishedProjects), ["old-project"]);
  assert.deepEqual(normalize(progress.quizzes), { hidden_lesson: 20 });
  assert.equal(progress.lastLesson, null);
});

test("oversized ID or answer collections fail instead of silently truncating", () => {
  for (const field of ["completed", "solved", "bookmarks", "finishedProjects"]) {
    assert.throws(() => readProgress({ ...fixture(), [field]: Array.from({ length: 1001 }, (_, index) => `lesson-${index}`) }), /too many IDs/);
  }
  assert.throws(() => readProgress({ ...fixture(), quizzes: Object.fromEntries(Array.from({ length: 1001 }, (_, index) => [`lesson-${index}`, 0])) }), /too many quiz answers/);
  const boundary = readProgress({ ...fixture(), completed: Array.from({ length: 1000 }, (_, index) => `lesson-${index}`) });
  assert.equal(boundary.completed.length, 1000);
});

test("the actual load/save effect preserves raw backup after an oversized snapshot error", () => {
  const raw = JSON.stringify({ ...fixture(), completed: Array.from({ length: 1001 }, (_, index) => `lesson-${index}`) });
  let saved = raw;
  let writes = 0;
  const state = {
    exports: {}, initialProgress: defaults(), progress: defaults(),
    ready: false, progressLoadError: false, progressSaveError: false, hasStoredProgress: false,
    STORE: "test-only-progress", storedProgressRaw: { current: null },
    isRecord: value => value !== null && typeof value === "object" && !Array.isArray(value),
    localStorage: { getItem: () => saved, setItem: (_key, value) => { saved = value; writes++; } },
    useEffect: callback => callback(),
  };
  state.setProgress = value => { state.progress = value; };
  state.setReady = value => { state.ready = value; };
  state.setHasStoredProgress = value => { state.hasStoredProgress = value; };
  state.setProgressLoadError = value => { state.progressLoadError = value; };
  state.setProgressSaveError = value => { state.progressSaveError = value; };
  const context = createContext(state);
  runInContext(parserSource, context);
  const ast = ts.createSourceFile("learning-app.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const findEffect = needle => {
    let result;
    const visit = node => {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "useEffect" && node.arguments[0]?.getText(ast).includes(needle)) result = node.getText(ast);
      ts.forEachChild(node, visit);
    };
    visit(ast);
    assert.ok(result, `Current effect must be found: ${needle}`);
    return result;
  };
  runInContext(compile(findEffect("localStorage.getItem(STORE)")), context);
  runInContext(compile(findEffect("localStorage.setItem(STORE")), context);
  assert.equal(state.ready, true);
  assert.equal(state.progressLoadError, true);
  assert.equal(state.storedProgressRaw.current, raw);
  assert.equal(state.hasStoredProgress, true);
  assert.equal(writes, 0);
  assert.equal(saved, raw);
});
