"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CourseClientData } from "@/lib/course-types";

const CourseContext = createContext<CourseClientData | null>(null);

export function CourseProvider({ value, children }: { value: CourseClientData; children: ReactNode }) {
  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourse() {
  const value = useContext(CourseContext);
  if (!value) throw new Error("CourseProvider is required");
  return value;
}
