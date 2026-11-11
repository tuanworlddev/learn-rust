import type { CourseModule, Lesson } from "@/src/data/curriculum";
import type { Specialization, TrackProject } from "@/src/data/specialization-types";

export type LessonSummary = Pick<Lesson, "id" | "moduleId" | "title" | "description" | "duration" | "objectives"> & { quizOptionCount: number; hasLab: boolean };
export type TrackProjectSummary = Pick<TrackProject, "id" | "title" | "description" | "level" | "estimatedHours" | "labLessonId"> & { completionKey: string };
export type SpecializationSummary = Omit<Specialization, "capstone" | "resources" | "assessment" | "projects"> & {
  projects: TrackProjectSummary[];
  hasAssessment: boolean;
};
export type CourseCatalog = {
  modules: CourseModule[];
  lessons: Lesson[];
  specializations: Specialization[];
};
export type CourseClientData = {
  modules: CourseModule[];
  lessons: LessonSummary[];
  specializations: SpecializationSummary[];
  currentLesson: Lesson | null;
  currentTrack: Specialization | null;
  currentProject: TrackProject | null;
};
