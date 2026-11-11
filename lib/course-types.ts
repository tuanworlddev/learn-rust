import type { CourseModule, Lesson } from "@/src/data/curriculum";
import type { Specialization, TrackProject } from "@/src/data/specialization-types";
import type { RustProject } from "@/src/data/projects";

export type LessonSummary = Pick<Lesson, "id" | "moduleId" | "title" | "description" | "duration" | "objectives"> & { quizOptionCount: number; hasLab: boolean };
export type TrackProjectSummary = Pick<TrackProject, "id" | "title" | "description" | "level" | "estimatedHours" | "labLessonId"> & { completionKey: string };
export type SpecializationSummary = Omit<Specialization, "capstone" | "resources" | "assessment" | "projects"> & {
  projects: TrackProjectSummary[];
  hasAssessment: boolean;
  assessmentTitle?: string;
};
export type CourseCatalog = { modules: CourseModule[]; lessons: Lesson[]; specializations: Specialization[] };
export type CourseNavigationData = {
  version: string;
  modules: CourseModule[];
  lessons: LessonSummary[];
  specializations: SpecializationSummary[];
  foundationProjects: Pick<RustProject, "id" | "title">[];
};
export type CoursePageData = {
  navigationVersion: string;
  currentLesson: Lesson | null;
  currentTrack: Specialization | null;
  currentProject: TrackProject | null;
  foundationProject: RustProject | null;
};
export type CourseClientData = CourseNavigationData & CoursePageData;
