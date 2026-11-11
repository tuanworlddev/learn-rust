/** Additive learning structure. Existing releases remain readable and rollback-safe. */
export function validateSimulation(value, path, h) {
  const { object, text, list, id, unique, fail } = h;
  object(value, path, ["title", "description", "kind", "nodes", "scenarios"]);
  text(value.title, path + ".title", 500);
  text(value.description, path + ".description", 5000);
  if (!["sequence", "pipeline", "memory", "timeline"].includes(value.kind)) fail(path, "unknown simulation kind");
  list(value.nodes, path + ".nodes", 2, 8);
  const nodeIds = [];
  for (const node of value.nodes) {
    object(node, path + ".node", ["id", "label", "detail"]);
    id(node.id, path + ".node.id");
    text(node.label, path + ".node.label", 300);
    text(node.detail, path + ".node.detail", 3000);
    nodeIds.push(node.id);
  }
  unique(nodeIds, path + ".nodes");
  list(value.scenarios, path + ".scenarios", 1, 6);
  unique(value.scenarios.map(item => item.id), path + ".scenarios");
  for (const scenario of value.scenarios) {
    object(scenario, path + ".scenario", ["id", "label", "steps"]);
    id(scenario.id, path + ".scenario.id");
    text(scenario.label, path + ".scenario.label", 500);
    list(scenario.steps, path + ".steps", 2, 20);
    for (const step of scenario.steps) {
      object(step, path + ".step", ["title", "description", "activeNodeIds", "values"]);
      text(step.title, path + ".step.title", 500);
      text(step.description, path + ".step.description", 6000);
      list(step.activeNodeIds, path + ".activeNodeIds", 0, 8);
      unique(step.activeNodeIds, path + ".activeNodeIds");
      if (step.activeNodeIds.some(item => !nodeIds.includes(item))) fail(path, "unknown simulation node");
      list(step.values, path + ".values", 0, 16);
      for (const entry of step.values) {
        object(entry, path + ".value", ["label", "value"]);
        text(entry.label, path + ".value.label", 300);
        text(entry.value, path + ".value.value", 3000, true);
      }
    }
  }
}

export function validateTrackStructure(track, lessons, path, h) {
  const { object, text, list, texts, id, unique, fail } = h;
  const fields = ["chapters", "projects", "assessment"];
  if (!fields.some(field => track[field] !== undefined)) return;
  if (!fields.every(field => track[field] !== undefined)) fail(path, "incomplete learning structure");
  const trackIds = new Set(track.lessonIds);
  const ownLessons = (ids, field) => {
    texts(ids, field, 1, 100, 100);
    unique(ids, field);
    if (ids.some(value => !trackIds.has(value))) fail(field, "lesson outside course");
  };
  list(track.chapters, path + ".chapters", 1, 30);
  unique(track.chapters.map(chapter => chapter.id), path + ".chapters");
  const chapterOrder = [];
  for (const chapter of track.chapters) {
    object(chapter, path + ".chapter", ["id", "title", "description", "lessonIds", "outcomes"]);
    id(chapter.id, path + ".chapter.id");
    text(chapter.title, path + ".chapter.title", 500);
    text(chapter.description, path + ".chapter.description", 10000);
    texts(chapter.outcomes, path + ".chapter.outcomes", 1, 20);
    ownLessons(chapter.lessonIds, path + ".chapter.lessonIds");
    chapterOrder.push(...chapter.lessonIds);
  }
  unique(chapterOrder, path + ".chapterLessons");
  if (JSON.stringify(chapterOrder) !== JSON.stringify(track.lessonIds)) fail(path, "chapters must partition the ordered course lessons");

  list(track.projects, path + ".projects", 1, 12);
  const projectIds = track.projects.map(project => project.id);
  unique(projectIds, path + ".projects");
  unique(track.projects.map(project => project.labLessonId), path + ".projectLabs");
  for (const project of track.projects) {
    const pp = path + ".project." + project.id;
    object(project, pp, ["id", "title", "description", "level", "estimatedHours", "labLessonId", "requirements", "milestones", "testCases", "rubric", "deliverables"]);
    id(project.id, pp + ".id");
    if (!project.id.startsWith(track.id + "-project-") || lessons.has(project.id)) fail(pp, "project ID must be namespaced and distinct from lessons");
    text(project.title, pp + ".title", 500);
    text(project.description, pp + ".description", 20000);
    if (!["guided", "independent", "capstone"].includes(project.level)) fail(pp, "invalid project level");
    if (!Number.isFinite(project.estimatedHours) || project.estimatedHours < 1 || project.estimatedHours > 1000) fail(pp, "invalid project duration");
    if (!trackIds.has(project.labLessonId) || !lessons.get(project.labLessonId)?.localLab) fail(pp, "project requires a downloadable lab from this course");
    texts(project.requirements, pp + ".requirements", 1, 40);
    texts(project.deliverables, pp + ".deliverables", 1, 30);
    list(project.milestones, pp + ".milestones", 1, 20);
    for (const milestone of project.milestones) {
      object(milestone, pp + ".milestone", ["title", "tasks", "acceptance"]);
      text(milestone.title, pp + ".milestone.title", 500);
      texts(milestone.tasks, pp + ".milestone.tasks", 1, 30);
      text(milestone.acceptance, pp + ".milestone.acceptance", 20000);
    }
    list(project.testCases, pp + ".testCases", 3, 30);
    for (const entry of project.testCases) {
      object(entry, pp + ".testCase", ["name", "setup", "expected"]);
      for (const field of ["name", "setup", "expected"]) text(entry[field], pp + ".testCase." + field, 12000);
    }
    list(project.rubric, pp + ".rubric", 3, 8);
    unique(project.rubric.map(entry => entry.id), pp + ".rubric");
    if (!project.rubric.some(entry => entry.critical)) fail(pp, "project needs a required criterion");
    for (const entry of project.rubric) {
      object(entry, pp + ".criterion", ["id", "title", "criteria", "critical"]);
      id(entry.id, pp + ".criterion.id");
      text(entry.title, pp + ".criterion.title", 500);
      texts(entry.criteria, pp + ".criterion.criteria", 1, 20);
      if (typeof entry.critical !== "boolean") fail(pp, "invalid criterion requirement");
    }
  }

  const assessment = track.assessment;
  const ap = path + ".assessment";
  object(assessment, ap, ["title", "instructions", "passPercent", "questions", "skills"]);
  text(assessment.title, ap + ".title", 500);
  text(assessment.instructions, ap + ".instructions", 20000);
  if (!Number.isInteger(assessment.passPercent) || assessment.passPercent < 60 || assessment.passPercent > 100) fail(ap, "invalid pass percentage");
  list(assessment.questions, ap + ".questions", 6, 40);
  unique(assessment.questions.map(question => question.id), ap + ".questions");
  for (const question of assessment.questions) {
    const qp = ap + ".question." + question.id;
    object(question, qp, ["id", "question", "options", "correct", "explanation", "lessonIds"]);
    id(question.id, qp + ".id");
    if (lessons.has(question.id)) fail(qp, "question ID collides with a lesson");
    text(question.question, qp + ".question", 10000);
    texts(question.options, qp + ".options", 2, 8, 10000);
    if (!Number.isInteger(question.correct) || question.correct < 0 || question.correct >= question.options.length) fail(qp, "answer outside options");
    text(question.explanation, qp + ".explanation", 20000);
    ownLessons(question.lessonIds, qp + ".lessonIds");
  }
  for (const chapter of track.chapters) {
    if (!assessment.questions.some(question => question.lessonIds.some(value => chapter.lessonIds.includes(value)))) fail(ap, "assessment omits a chapter");
  }
  list(assessment.skills, ap + ".skills", 3, 30);
  unique(assessment.skills.map(skill => skill.id), ap + ".skills");
  for (const skill of assessment.skills) {
    object(skill, ap + ".skill", ["id", "title", "description", "lessonIds", "projectIds", "required"]);
    id(skill.id, ap + ".skill.id");
    text(skill.title, ap + ".skill.title", 500);
    text(skill.description, ap + ".skill.description", 12000);
    ownLessons(skill.lessonIds, ap + ".skill.lessonIds");
    texts(skill.projectIds, ap + ".skill.projectIds", 1, 12, 100);
    unique(skill.projectIds, ap + ".skill.projectIds");
    if (skill.projectIds.some(value => !projectIds.includes(value))) fail(ap, "skill references unknown project");
    if (typeof skill.required !== "boolean") fail(ap, "invalid required skill flag");
  }
}
