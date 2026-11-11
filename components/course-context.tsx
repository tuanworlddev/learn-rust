"use client";

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { CourseClientData, CourseNavigationData, CoursePageData } from "@/lib/course-types";

const NavigationContext = createContext<CourseNavigationData | null>(null);
const PageContext = createContext<CoursePageData | null>(null);

export function CourseProvider({ value, children }: { value: CourseNavigationData; children: ReactNode }) {
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
export function CoursePageProvider({ value, children }: { value: CoursePageData; children: ReactNode }) {
  const navigation = useCourseNavigation();
  const router = useRouter();
  const requestedVersion = useRef<string | null>(null);
  useEffect(() => {
    if (navigation.version === value.navigationVersion) {
      requestedVersion.current = null;
      return;
    }
    const mismatch = navigation.version + ":" + value.navigationVersion;
    if (requestedVersion.current === mismatch) return;
    requestedVersion.current = mismatch;
    // Refresh a changed course index without resetting the persistent learner shell.
    router.refresh();
  }, [navigation.version, value.navigationVersion, router]);
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}
export function useCourseNavigation() {
  const value = useContext(NavigationContext);
  if (!value) throw new Error("CourseProvider is required");
  return value;
}
export function useCourse(): CourseClientData {
  const navigation = useCourseNavigation();
  const page = useContext(PageContext);
  if (!page) throw new Error("CoursePageProvider is required");
  return useMemo(() => ({ ...navigation, ...page }), [navigation, page]);
}
