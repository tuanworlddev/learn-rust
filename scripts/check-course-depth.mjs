#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { readCourseSource } from "./lib/read-course-source.mjs";
import { validateCatalog, canonicalCatalog } from "../lib/content/catalog.mjs";

const args = process.argv.slice(2);
const outputIndex = args.indexOf("--output");
const output = outputIndex >= 0 ? args[outputIndex + 1] : "reports/course-expansion/content-depth.json";
const catalog = validateCatalog(readCourseSource());
const foundations = catalog.lessons.filter(lesson => !lesson.moduleId.startsWith("track-"));
assert.equal(foundations.length, 80, "Foundation lessons remain available");
assert.equal(catalog.specializations.length, 13, "All requested specializations remain present");
const rows = [];
for (const track of catalog.specializations) {
  assert.ok(track.chapters?.length >= 6, track.id + ": at least six coherent chapters");
  assert.ok(track.lessonIds.length >= 18, track.id + ": at least eighteen lessons");
  assert.ok(track.chapters.every(chapter => chapter.lessonIds.length >= 3), track.id + ": chapter progression");
  assert.equal(track.projects?.length, 3, track.id + ": three distinct applied projects");
  assert.deepEqual([...new Set(track.projects.map(project => project.level))].sort(), ["capstone", "guided", "independent"], track.id + ": project progression");
  assert.ok(track.assessment.questions.length >= 12, track.id + ": scenario assessment");
  assert.ok(track.assessment.skills.length >= 6, track.id + ": explicit practical skills");
  const lessons = track.lessonIds.map(id => catalog.lessons.find(lesson => lesson.id === id));
  const simulations = lessons.filter(lesson => lesson.simulation);
  assert.ok(simulations.length >= 2, track.id + ": two interactive simulations");
  for (const lesson of simulations) {
    assert.ok(lesson.simulation.scenarios.length >= 2, lesson.id + ": alternate scenarios");
    assert.ok(lesson.simulation.scenarios.every(scenario => scenario.steps.length >= 4), lesson.id + ": substantive trace");
  }
  for (const project of track.projects) {
    const lesson = lessons.find(item => item.id === project.labLessonId);
    const files = lesson.localLab.files;
    assert.ok(files.some(file => file.path === "Cargo.toml"), project.id + ": Cargo manifest");
    assert.ok(files.some(file => /^src\/.*\.rs$/.test(file.path)), project.id + ": real Rust source");
    assert.ok(files.some(file => /#\[test\]|#\[(tokio|wasm_bindgen_test)::test\]|#\[tokio::test\]/.test(file.content)), project.id + ": executable regression tests");
    assert.ok(project.milestones.length >= 3, project.id + ": staged implementation");
    assert.ok(project.testCases.length >= 3 && project.rubric.length >= 4, project.id + ": test and review criteria");
  }
  rows.push({ id: track.id, title: track.title, chapters: track.chapters.length, lessons: lessons.length,
    projects: track.projects.map(project => ({ id: project.id, title: project.title, labLessonId: project.labLessonId, estimatedHours: project.estimatedHours })),
    scenarios: track.assessment.questions.length, skills: track.assessment.skills.length, simulations: simulations.map(lesson => lesson.id),
    theoryWords: lessons.reduce((sum, lesson) => sum + lesson.sections.map(section => section.text).join(" ").trim().split(/\s+/).length, 0) });
}
const images = [...new Set(catalog.lessons.flatMap(lesson => lesson.illustration?.src.startsWith("/") ? [lesson.illustration.src] : []))];
for (const image of images) {
  const path = resolve("public", "." + image);
  assert.ok(existsSync(path) && readFileSync(path).length > 0, image + ": image exists");
}
const report = {
  checkedAt: new Date().toISOString(), status: "passed",
  catalogSha256: createHash("sha256").update(canonicalCatalog(catalog)).digest("hex"),
  foundations: foundations.length, specializations: rows.length, lessons: catalog.lessons.length,
  chapters: catalog.modules.filter(module => !module.id.startsWith("track-")).length + rows.reduce((sum, row) => sum + row.chapters, 0),
  specializedProjects: rows.reduce((sum, row) => sum + row.projects.length, 0),
  downloadableLabs: catalog.lessons.filter(lesson => lesson.localLab).length,
  scenarioQuestions: rows.reduce((sum, row) => sum + row.scenarios, 0),
  interactiveSpecializationSimulations: rows.reduce((sum, row) => sum + row.simulations.length, 0),
  images, courses: rows,
  scope: "Structural and source coverage gate. Passing does not certify learner competence or target-device/deployment behavior."
};
writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ status: report.status, lessons: report.lessons, chapters: report.chapters, projects: report.specializedProjects, labs: report.downloadableLabs, simulations: report.interactiveSpecializationSimulations }));
