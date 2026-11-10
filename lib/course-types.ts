import type { CourseModule, Lesson } from "@/src/data/curriculum";
import type { Specialization } from "@/src/data/specialization-types";

export type LessonSummary = Pick<Lesson, "id" | "moduleId" | "title" | "description" | "duration" | "objectives"> & { quizOptionCount: number };
export type CourseCatalog = {
  modules: CourseModule[];
  lessons: Lesson[];
  specializations: Specialization[];
};
export type CourseClientData = {
  modules: CourseModule[];
  lessons: LessonSummary[];
  specializations: Specialization[];
  currentLesson: Lesson | null;
};
