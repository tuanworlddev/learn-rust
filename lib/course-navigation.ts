import "server-only";
import { createHash } from "node:crypto";
import { getCourseCatalog } from "./course-content";
import { projectCompletionKey } from "./course-assessment";
import { projects } from "@/src/data/projects";
import type { CourseCatalog, CourseNavigationData } from "./course-types";

const navigationCache = new WeakMap<CourseCatalog, CourseNavigationData>();

/** Reuse navigation metadata for the lifetime of an immutable catalog snapshot. */
export async function getCourseNavigation(): Promise<CourseNavigationData> {
  const catalog = await getCourseCatalog();
  const existing = navigationCache.get(catalog);
  if (existing) return existing;
  const navigation: Omit<CourseNavigationData, "version"> = {
    modules: catalog.modules,
    specializations: catalog.specializations.map(track => ({
      id: track.id, title: track.title, shortTitle: track.shortTitle, description: track.description,
      outcome: track.outcome, prerequisites: track.prerequisites, technologies: track.technologies,
      color: track.color, lessonIds: track.lessonIds, chapters: track.chapters,
      hasAssessment: Boolean(track.assessment), assessmentTitle: track.assessment?.title,
      projects: (track.projects ?? []).map(project => ({
        id: project.id, title: project.title, description: project.description, level: project.level,
        estimatedHours: project.estimatedHours, labLessonId: project.labLessonId,
        completionKey: projectCompletionKey(project),
      })),
    })),
    lessons: catalog.lessons.map(({ id, moduleId, title, description, duration, objectives, quiz, localLab }) => ({
      id, moduleId, title, description, duration, objectives,
      quizOptionCount: quiz.options.length, hasLab: Boolean(localLab),
    })),
    foundationProjects: projects.map(({ id, title }) => ({ id, title })),
  };
  const result = { ...navigation, version: createHash("sha256").update(JSON.stringify(navigation)).digest("hex") };
  navigationCache.set(catalog, result);
  return result;
}
