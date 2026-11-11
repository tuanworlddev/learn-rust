import type { Lesson } from "./curriculum";

export type CourseQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  lessonIds: string[];
};
export type CourseChapter = {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
  outcomes: string[];
};
export type ProjectRubric = { id: string; title: string; criteria: string[]; critical: boolean };
export type TrackProject = {
  id: string;
  title: string;
  description: string;
  level: "guided" | "independent" | "capstone";
  estimatedHours: number;
  /** A published lesson with a complete, runnable Cargo project download. */
  labLessonId: string;
  requirements: string[];
  milestones: { title: string; tasks: string[]; acceptance: string }[];
  testCases: { name: string; setup: string; expected: string }[];
  rubric: ProjectRubric[];
  deliverables: string[];
};
export type TrackAssessment = {
  title: string;
  instructions: string;
  passPercent: number;
  questions: CourseQuestion[];
  skills: {
    id: string;
    title: string;
    description: string;
    lessonIds: string[];
    projectIds: string[];
    required: boolean;
  }[];
};
export type Specialization = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  outcome: string;
  prerequisites: string[];
  technologies: string[];
  color: "rust" | "blue" | "green" | "purple";
  lessonIds: string[];
  capstone: {
    title: string;
    description: string;
    milestones: { title: string; tasks: string[]; acceptance: string }[];
    deliverables: string[];
    reviewQuestions: string[];
  };
  /** Author bibliography; not displayed as outbound learner navigation. */
  resources: { label: string; url: string }[];
  chapters?: CourseChapter[];
  projects?: TrackProject[];
  assessment?: TrackAssessment;
};
export type SpecializationBundle = { track: Specialization; lessons: Lesson[] };
export type TrackExpansion = {
  chapters: CourseChapter[];
  lessons: Lesson[];
  projects: TrackProject[];
  assessment: TrackAssessment;
};
export type LessonSimulation = {
  title: string;
  description: string;
  kind: "sequence" | "pipeline" | "memory" | "timeline";
  nodes: { id: string; label: string; detail: string }[];
  scenarios: {
    id: string;
    label: string;
    steps: {
      title: string;
      description: string;
      activeNodeIds: string[];
      values: { label: string; value: string }[];
    }[];
  }[];
};
/** Full Cargo samples, target-specific instructions and acceptance checks. */
export type LocalLab = {
  title: string;
  instructions: string;
  files: { path: string; content: string }[];
  commands: string[];
  checks: string[];
};
