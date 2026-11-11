import LearningContent from "./learning-content";
import { pageStructuredData } from "@/lib/seo";
import { getCourseCatalog } from "@/lib/course-content";
import { getCourseNavigation } from "@/lib/course-navigation";
import { projects } from "@/src/data/projects";
import { CoursePageProvider } from "./course-context";
import type { CoursePageData } from "@/lib/course-types";

export default async function LearningPage({ route }: { route: string }) {
  const catalog = await getCourseCatalog();
  const structuredData = await pageStructuredData(route);
  const currentLesson = catalog.lessons.find(lesson => route === "bai-hoc/" + lesson.id) ?? null;
  // Lesson navigation already has its course summary in the persistent layout.
  const currentTrack = currentLesson ? null : catalog.specializations.find(track =>
    route === "khoa-hoc/" + track.id || route === "khoa-hoc/" + track.id + "/danh-gia" ||
    track.projects?.some(project => route === "du-an/" + project.id)
  ) ?? null;
  const pageData: CoursePageData = {
    navigationVersion: (await getCourseNavigation()).version,
    currentLesson,
    currentTrack,
    currentProject: currentTrack?.projects?.find(project => route === "du-an/" + project.id) ?? null,
    foundationProject: projects.find(project => route === "du-an/" + project.id) ?? null,
  };
  return <>
    {structuredData.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />}
    <CoursePageProvider value={pageData}><LearningContent route={route} /></CoursePageProvider>
  </>;
}
