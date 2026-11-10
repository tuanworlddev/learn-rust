export const SNAPSHOT_VERSION = 1;
// Leave room for the spaces that PostgreSQL adds when serializing jsonb.
export const MAX_SNAPSHOT_BYTES = 240 * 1024;
const ID = /^[a-z0-9][a-z0-9_-]{0,99}$/;
const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const validId = (value) => typeof value === "string" && ID.test(value);

function readIds(value) {
  if (!Array.isArray(value) || value.length > 1000 || !value.every(validId)) return null;
  return [...new Set(value)];
}

function readNumbers(value, dates = false) {
  if (!isRecord(value)) return null;
  const entries = Object.entries(value);
  if (entries.length > (dates ? 5000 : 1000)) return null;
  for (const [key, amount] of entries) {
    if (!Number.isInteger(amount) || amount < 0 || amount > (dates ? 1440 : 20)) return null;
    if (dates) {
      if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(key)) return null;
      const date = new Date(`${key}T00:00:00Z`);
      if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== key) return null;
    } else if (!validId(key)) return null;
  }
  return Object.fromEntries(entries);
}

/** Only core learning progress is allowed across the cloud boundary. */
export function parseProgressSnapshot(value) {
  if (!isRecord(value)) return null;
  const completed = readIds(value.completed);
  const solved = readIds(value.solved);
  const bookmarks = readIds(value.bookmarks);
  const finishedProjects = readIds(value.finishedProjects);
  const quizzes = readNumbers(value.quizzes);
  const minutes = readNumbers(value.minutes, true);
  if (!completed || !solved || !bookmarks || !finishedProjects || !quizzes || !minutes) return null;
  if (value.lastLesson !== null && !validId(value.lastLesson)) return null;
  if (![15, 30, 45].includes(value.goal)) return null;
  if (typeof value.notes !== "string" || value.notes.length > 120000 || value.notes.includes("\u0000")) return null;
  const snapshot = {
    completed, solved, bookmarks, quizzes,
    lastLesson: value.lastLesson, goal: value.goal, minutes,
    notes: value.notes, finishedProjects,
  };
  return new TextEncoder().encode(JSON.stringify(snapshot)).byteLength <= MAX_SNAPSHOT_BYTES ? snapshot : null;
}

export function parseCloudSnapshot(value) {
  if (!isRecord(value) || value.version !== SNAPSHOT_VERSION || typeof value.updated_at !== "string") return null;
  if (!Number.isFinite(new Date(value.updated_at).getTime())) return null;
  const snapshot = parseProgressSnapshot(value.snapshot);
  return snapshot ? { snapshot, updatedAt: value.updated_at } : null;
}
