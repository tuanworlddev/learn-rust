"use client";

import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Progress } from "./learning-shared";

export type LearningState = {
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
  setToast: Dispatch<SetStateAction<string>>;
  go: (route: string) => void;
  visitLesson: (id: string) => void;
  openLesson: (id: string) => void;
  bookmark: (id: string) => void;
};
export const LearningStateContext = createContext<LearningState | null>(null);
export function useLearningState() {
  const value = useContext(LearningStateContext);
  if (!value) throw new Error("LearningApp is required");
  return value;
}
