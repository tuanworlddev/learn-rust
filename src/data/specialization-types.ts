import type { Lesson } from "./curriculum";

export type Specialization = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  outcome: string;
  prerequisites: string[];
  technologies: string[];
  color: "rust" | "blue" | "green" | "purple";
  /** IDs of the ordered, fully written lessons in this track. */
  lessonIds: string[];
  capstone: {
    title: string;
    description: string;
    milestones: { title: string; tasks: string[]; acceptance: string }[];
    deliverables: string[];
    reviewQuestions: string[];
  };
  resources: { label: string; url: string }[];
};

export type SpecializationBundle = { track: Specialization; lessons: Lesson[] };

/** Local Cargo projects complement the browser exercise when hardware, OS,
 * a framework or external services are part of the lesson. */
export type LocalLab = {
  title: string;
  instructions: string;
  files: { path: string; content: string }[];
  commands: string[];
  checks: string[];
};
