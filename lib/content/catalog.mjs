/** Shared by the import CLI and the server loader. Content is text, never HTML. */
export const CATALOG_SCHEMA_VERSION = 1;
export const MAX_CATALOG_BYTES = 16 * 1024 * 1024;

function fail(path, message) { throw new Error(`Invalid course content at ${path}: ${message}`); }
function object(value, path, required, optional = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(path, "expected object");
  const keys = Object.keys(value);
  if (required.some(key => !Object.hasOwn(value, key))) fail(path, "missing required field");
  if (keys.some(key => !required.includes(key) && !optional.includes(key))) fail(path, "unknown field");
}
function text(value, path, max = 20000, allowEmpty = false) {
  if (typeof value !== "string" || value.length > max || (!allowEmpty && !value.trim()) || value.includes("\0")) fail(path, "invalid text");
}
function list(value, path, min = 1, max = 1000) {
  if (!Array.isArray(value) || value.length < min || value.length > max) fail(path, "invalid list length");
}
function texts(value, path, min = 1, max = 50, itemMax = 12000) {
  list(value, path, min, max);
  value.forEach((item, index) => text(item, `${path}[${index}]`, itemMax));
}
function id(value, path) {
  if (typeof value !== "string" || !/^[a-z0-9][a-z0-9_-]{0,99}$/.test(value)) fail(path, "invalid ID");
}
function url(value, path, image = false) {
  text(value, path, 2048);
  if (image && /^\/(?!\/)[a-zA-Z0-9_./-]+$/.test(value) && !value.split("/").includes("..")) return;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) fail(path, "expected HTTPS URL");
  } catch { fail(path, "invalid HTTPS URL"); }
}
function reference(value, path) {
  object(value, path, ["label", "url"]);
  text(value.label, `${path}.label`, 300);
  url(value.url, `${path}.url`);
}
function unique(items, path) {
  if (new Set(items).size !== items.length) fail(path, "duplicate ID");
}
function localLab(lab, path) {
  object(lab, path, ["title", "instructions", "files", "commands", "checks"]);
  text(lab.title, `${path}.title`, 300);
  text(lab.instructions, `${path}.instructions`, 40000);
  list(lab.files, `${path}.files`, 1, 60);
  const paths = [];
  lab.files.forEach((file, index) => {
    const fp = `${path}.files[${index}]`;
    object(file, fp, ["path", "content"]);
    if (typeof file.path !== "string" || file.path.length > 200 || !/^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*$/.test(file.path) || file.path.split("/").some(part => part === "." || part === "..")) fail(`${fp}.path`, "expected safe relative file path");
    text(file.content, `${fp}.content`, 150000, true);
    paths.push(file.path);
  });
  unique(paths, `${path}.files`);
  texts(lab.commands, `${path}.commands`, 1, 50, 4000);
  texts(lab.checks, `${path}.checks`, 1, 50);
}

/** Throws with a field path, never logs actual content or environment values. */
export function validateCatalog(catalog) {
  object(catalog, "catalog", ["modules", "lessons", "specializations"]);
  let serialized;
  try { serialized = JSON.stringify(catalog); } catch { fail("catalog", "not serializable"); }
  if (Buffer.byteLength(serialized, "utf8") > MAX_CATALOG_BYTES) fail("catalog", "exceeds 16 MiB");
  list(catalog.modules, "modules", 1, 200);
  list(catalog.lessons, "lessons", 1, 1000);
  list(catalog.specializations, "specializations", 0, 100);
  catalog.modules.forEach((module, index) => {
    const path = `modules[${index}]`;
    object(module, path, ["id", "title", "description", "color", "icon", "level"]);
    id(module.id, `${path}.id`);
    for (const field of ["title", "description", "color", "icon", "level"]) text(module[field], `${path}.${field}`, field === "description" ? 4000 : 300);
  });
  const moduleIds = new Set(catalog.modules.map(module => module.id));
  unique(catalog.modules.map(module => module.id), "modules");
  catalog.lessons.forEach((lesson, index) => {
    const path = `lessons[${index}]`;
    object(lesson, path, ["id", "moduleId", "title", "description", "duration", "objectives", "sections", "tip", "exercise", "starterCode", "solutionCode", "expectedOutput", "hints", "quiz", "reference"], ["localLab", "illustration"]);
    id(lesson.id, `${path}.id`);
    id(lesson.moduleId, `${path}.moduleId`);
    if (!moduleIds.has(lesson.moduleId)) fail(`${path}.moduleId`, "unknown module");
    text(lesson.title, `${path}.title`, 500);
    text(lesson.description, `${path}.description`, 5000);
    if (!Number.isInteger(lesson.duration) || lesson.duration < 1 || lesson.duration > 10080) fail(`${path}.duration`, "invalid minutes");
    texts(lesson.objectives, `${path}.objectives`, 1, 30);
    list(lesson.sections, `${path}.sections`, 1, 40);
    lesson.sections.forEach((section, sectionIndex) => {
      const sp = `${path}.sections[${sectionIndex}]`;
      object(section, sp, ["title", "text"], ["code"]);
      text(section.title, `${sp}.title`, 500);
      text(section.text, `${sp}.text`, 150000);
      if (section.code !== undefined) text(section.code, `${sp}.code`, 150000, true);
    });
    text(lesson.tip, `${path}.tip`, 20000, true);
    object(lesson.exercise, `${path}.exercise`, ["title", "instructions", "requirements"]);
    text(lesson.exercise.title, `${path}.exercise.title`, 500);
    text(lesson.exercise.instructions, `${path}.exercise.instructions`, 40000);
    texts(lesson.exercise.requirements, `${path}.exercise.requirements`, 1, 50);
    for (const field of ["starterCode", "solutionCode", "expectedOutput"]) text(lesson[field], `${path}.${field}`, 150000, field === "expectedOutput");
    texts(lesson.hints, `${path}.hints`, 0, 30);
    object(lesson.quiz, `${path}.quiz`, ["question", "options", "correct", "explanation"]);
    text(lesson.quiz.question, `${path}.quiz.question`, 10000);
    texts(lesson.quiz.options, `${path}.quiz.options`, 2, 20, 10000);
    if (!Number.isInteger(lesson.quiz.correct) || lesson.quiz.correct < 0 || lesson.quiz.correct >= lesson.quiz.options.length) fail(`${path}.quiz.correct`, "answer outside options");
    text(lesson.quiz.explanation, `${path}.quiz.explanation`, 20000);
    reference(lesson.reference, `${path}.reference`);
    if (lesson.localLab !== undefined) localLab(lesson.localLab, `${path}.localLab`);
    if (lesson.illustration !== undefined) {
      object(lesson.illustration, `${path}.illustration`, ["src", "alt", "caption"]);
      url(lesson.illustration.src, `${path}.illustration.src`, true);
      text(lesson.illustration.alt, `${path}.illustration.alt`, 2000);
      text(lesson.illustration.caption, `${path}.illustration.caption`, 5000);
    }
  });
  unique(catalog.lessons.map(lesson => lesson.id), "lessons");
  const lessons = new Map(catalog.lessons.map(lesson => [lesson.id, lesson]));
  const assigned = new Set();
  catalog.specializations.forEach((track, index) => {
    const path = `specializations[${index}]`;
    object(track, path, ["id", "title", "shortTitle", "description", "outcome", "prerequisites", "technologies", "color", "lessonIds", "capstone", "resources"]);
    id(track.id, `${path}.id`);
    for (const field of ["title", "shortTitle", "description", "outcome"]) text(track[field], `${path}.${field}`, field === "description" || field === "outcome" ? 10000 : 500);
    if (!["rust", "blue", "green", "purple"].includes(track.color)) fail(`${path}.color`, "unknown color");
    texts(track.prerequisites, `${path}.prerequisites`, 1, 30);
    texts(track.technologies, `${path}.technologies`, 1, 30, 500);
    texts(track.lessonIds, `${path}.lessonIds`, 1, 100, 100);
    unique(track.lessonIds, `${path}.lessonIds`);
    track.lessonIds.forEach(lessonId => {
      if (!lessons.has(lessonId)) fail(`${path}.lessonIds`, "unknown lesson");
      if (lessons.get(lessonId).moduleId !== `track-${track.id}`) fail(`${path}.lessonIds`, "lesson belongs to another module");
      if (assigned.has(lessonId)) fail(`${path}.lessonIds`, "lesson in multiple tracks");
      assigned.add(lessonId);
    });
    object(track.capstone, `${path}.capstone`, ["title", "description", "milestones", "deliverables", "reviewQuestions"]);
    text(track.capstone.title, `${path}.capstone.title`, 500);
    text(track.capstone.description, `${path}.capstone.description`, 20000);
    list(track.capstone.milestones, `${path}.capstone.milestones`, 1, 30);
    track.capstone.milestones.forEach((milestone, milestoneIndex) => {
      const mp = `${path}.capstone.milestones[${milestoneIndex}]`;
      object(milestone, mp, ["title", "tasks", "acceptance"]);
      text(milestone.title, `${mp}.title`, 500);
      texts(milestone.tasks, `${mp}.tasks`, 1, 30);
      text(milestone.acceptance, `${mp}.acceptance`, 20000);
    });
    texts(track.capstone.deliverables, `${path}.capstone.deliverables`, 1, 30);
    texts(track.capstone.reviewQuestions, `${path}.capstone.reviewQuestions`, 1, 30);
    list(track.resources, `${path}.resources`, 1, 50);
    track.resources.forEach((resource, resourceIndex) => reference(resource, `${path}.resources[${resourceIndex}]`));
  });
  unique(catalog.specializations.map(track => track.id), "specializations");
  for (const lesson of catalog.lessons) if (lesson.moduleId.startsWith("track-") && !assigned.has(lesson.id)) fail(`lessons.${lesson.id}`, "specialization lesson is not assigned");
  for (const courseModule of catalog.modules) if (!catalog.lessons.some(lesson => lesson.moduleId === courseModule.id)) fail(`modules.${courseModule.id}`, "empty module");
  return catalog;
}

export function canonicalCatalog(catalog) {
  validateCatalog(catalog);
  const sort = value => Array.isArray(value) ? value.map(sort) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])])) : value;
  return JSON.stringify(sort(catalog));
}

export function parseCourseExport(value) {
  object(value, "export", ["schemaVersion", "catalog"], ["exportedAt", "sourceRevision"]);
  if (value.schemaVersion !== CATALOG_SCHEMA_VERSION) fail("schemaVersion", "unsupported version");
  return validateCatalog(value.catalog);
}
