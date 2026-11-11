import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { Script } from "node:vm";
import { readCourseSource } from "../scripts/lib/read-course-source.mjs";

const assessmentModule = { exports: {} };
const source = readFileSync(new URL("./course-assessment.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
new Script("(function(exports,module){" + compiled + "})").runInThisContext()(assessmentModule.exports, assessmentModule);
const { questionAnswerKey, assessmentSubmissionKey, projectCompletionKey, projectCriterionKey, scoreAssessment, reviewedProject } = assessmentModule.exports;
const track = readCourseSource().specializations.find(item => item.assessment);
assert.ok(track, "At least one complete course is required");
const assessment = track.assessment;
const project = track.projects[0];

test("exam accepts only all valid answers; malformed restored progress cannot pass", () => {
  const answers = Object.fromEntries(assessment.questions.map(question => [questionAnswerKey(question), question.correct]));
  assert.equal(scoreAssessment(assessment, answers).passed, true);
  delete answers[questionAnswerKey(assessment.questions[0])];
  assert.equal(scoreAssessment(assessment, answers).passed, false);
  answers[questionAnswerKey(assessment.questions[0])] = 99;
  assert.equal(scoreAssessment(assessment, answers).answered, assessment.questions.length - 1);
  assert.equal(scoreAssessment(assessment, answers).passed, false);
});
test("rounded display percentage never turns a failing exact score into a pass", () => {
  const questions = Array.from({ length: 26 }, (_, i) => ({ ...assessment.questions[0], id: "rounding-" + i }));
  const exam = { ...assessment, questions, passPercent: 81 };
  const answers = Object.fromEntries(questions.map((question, i) => [questionAnswerKey(question), i < 21 ? question.correct : (question.correct + 1) % question.options.length]));
  assert.equal(scoreAssessment(exam, answers).percent, 81);
  assert.equal(scoreAssessment(exam, answers).passed, false);
});
test("changed question options or correct answer invalidate the old answer and submission", () => {
  const changed = structuredClone(assessment);
  changed.questions[0].options.reverse();
  assert.notEqual(questionAnswerKey(changed.questions[0]), questionAnswerKey(assessment.questions[0]));
  assert.notEqual(assessmentSubmissionKey(track.id, changed), assessmentSubmissionKey(track.id, assessment));
  const threshold = { ...assessment, passPercent: assessment.passPercent === 90 ? 80 : 90 };
  assert.notEqual(assessmentSubmissionKey(track.id, threshold), assessmentSubmissionKey(track.id, assessment));
});
test("a project needs every rubric item, and new requirements invalidate old evidence", () => {
  const answers = Object.fromEntries(project.rubric.map(item => [projectCriterionKey(project, item.id), 1]));
  assert.equal(reviewedProject(project, answers), true);
  delete answers[projectCriterionKey(project, project.rubric.at(-1).id)];
  assert.equal(reviewedProject(project, answers), false);
  const changed = { ...project, requirements: [...project.requirements, "A new acceptance requirement"] };
  assert.notEqual(projectCompletionKey(changed), projectCompletionKey(project));
  assert.notEqual(projectCriterionKey(changed, project.rubric[0].id), projectCriterionKey(project, project.rubric[0].id));
  assert.equal(reviewedProject(changed, answers), false);
});
test("all published evidence keys fit progress sync and remain unique", () => {
  const catalog = readCourseSource();
  const keys = [...catalog.lessons.map(lesson => lesson.id)];
  for (const course of catalog.specializations) {
    if (course.assessment) keys.push(assessmentSubmissionKey(course.id, course.assessment), ...course.assessment.questions.map(questionAnswerKey));
    for (const item of course.projects ?? []) keys.push(...item.rubric.map(criterion => projectCriterionKey(item, criterion.id)));
  }
  assert.ok(keys.every(key => /^[a-z0-9][a-z0-9_-]{0,99}$/.test(key)));
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(keys.length <= 1000, "One current catalog fits the cloud progress answer limit");
});
