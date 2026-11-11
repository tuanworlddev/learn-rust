import LearningApp from "./learning-app";
import { pageStructuredData } from "@/lib/seo";
import { getCourseCatalog } from "@/lib/course-content";
import { projectCompletionKey } from "@/lib/course-assessment";
import { CourseProvider } from "./course-context";
import type { CourseClientData } from "@/lib/course-types";

export default async function LearningPage({ route }: { route: string }) {
  const catalog = await getCourseCatalog();
  const data = await pageStructuredData(route);
  const currentLesson = catalog.lessons.find(lesson => route === "bai-hoc/" + lesson.id) ?? null;
  const currentTrack = catalog.specializations.find(track =>
    route === "khoa-hoc/" + track.id || route === "khoa-hoc/" + track.id + "/danh-gia" ||
    currentLesson?.moduleId === "track-" + track.id ||
    track.projects?.some(project => route === "du-an/" + project.id)
  ) ?? null;
  const clientData: CourseClientData = {
    modules: catalog.modules,
    specializations: catalog.specializations.map(track => ({
      id: track.id, title: track.title, shortTitle: track.shortTitle, description: track.description,
      outcome: track.outcome, prerequisites: track.prerequisites, technologies: track.technologies,
      color: track.color, lessonIds: track.lessonIds, chapters: track.chapters,
      hasAssessment: Boolean(track.assessment),
      projects: (track.projects ?? []).map(project => ({
        id: project.id, title: project.title, description: project.description, level: project.level,
        estimatedHours: project.estimatedHours, labLessonId: project.labLessonId,
        completionKey: projectCompletionKey(project),
      })),
    })),
    lessons: catalog.lessons.map(({ id, moduleId, title, description, duration, objectives, quiz, localLab }) => ({
      id, moduleId, title, description, duration, objectives, quizOptionCount: quiz.options.length, hasLab: Boolean(localLab),
    })),
    currentLesson,
    currentTrack,
    currentProject: currentTrack?.projects?.find(project => route === "du-an/" + project.id) ?? null,
  };
  return <>
    {data.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />}
    <CourseProvider value={clientData}><LearningApp initialRoute={route} /></CourseProvider>
  </>;
}
