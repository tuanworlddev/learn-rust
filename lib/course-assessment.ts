import type { CourseQuestion, TrackAssessment, TrackProject } from "@/src/data/specialization-types";

/** Fingerprints isolate evidence when a question, rubric or project contract changes. */
function fingerprint(value: unknown): string {
  const input = JSON.stringify(value);
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) hash = Math.imul(hash ^ input.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(36);
}
function key(prefix: string, id: string, value: unknown) {
  return prefix + "-" + id.slice(0, 65) + "-" + fingerprint(value);
}
export function questionAnswerKey(question: CourseQuestion) {
  return key("exam", question.id, [question.question, question.options, question.correct]);
}
export function assessmentSubmissionKey(trackId: string, assessment: TrackAssessment) {
  return key("exam-done", trackId, [assessment.passPercent, assessment.questions.map(questionAnswerKey)]);
}
export function projectCriterionKey(project: TrackProject, criterionId: string) {
  return key("review", project.id, [projectCompletionKey(project), criterionId]);
}
export function projectCompletionKey(project: TrackProject) {
  return key("project", project.id, [project.labLessonId, project.requirements, project.milestones, project.testCases, project.rubric, project.deliverables]);
}
export function scoreAssessment(assessment: TrackAssessment, answers: Record<string, number>) {
  const answered = assessment.questions.filter(question => {
    const answer = answers[questionAnswerKey(question)];
    return Number.isInteger(answer) && answer >= 0 && answer < question.options.length;
  }).length;
  const correct = assessment.questions.filter(question => answers[questionAnswerKey(question)] === question.correct).length;
  const total = assessment.questions.length;
  const percent = total ? Math.round(correct / total * 100) : 0;
  return { answered, correct, total, percent, passed: total > 0 && answered === total && correct * 100 >= assessment.passPercent * total };
}
export function reviewedProject(project: TrackProject, answers: Record<string, number>) {
  return project.rubric.length > 0 && project.rubric.every(item => answers[projectCriterionKey(project, item.id)] === 1);
}
