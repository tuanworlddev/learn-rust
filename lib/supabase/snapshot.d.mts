export type ProgressSnapshot = {
  completed: string[];
  solved: string[];
  bookmarks: string[];
  quizzes: Record<string, number>;
  lastLesson: string | null;
  goal: number;
  minutes: Record<string, number>;
  notes: string;
  finishedProjects: string[];
};
export type CloudSnapshot = { snapshot: ProgressSnapshot; updatedAt: string };
export const SNAPSHOT_VERSION: 1;
export const MAX_SNAPSHOT_BYTES: number;
export function parseProgressSnapshot(value: unknown): ProgressSnapshot | null;
export function parseCloudSnapshot(value: unknown): CloudSnapshot | null;
