import LearningApp from "./learning-app";
import { pageStructuredData } from "@/lib/seo";
import { getCourseCatalog } from "@/lib/course-content";
import { CourseProvider } from "./course-context";
import type { CourseClientData } from "@/lib/course-types";

export default async function LearningPage({ route }: { route: string }) {
  const catalog = await getCourseCatalog();
  const data = await pageStructuredData(route);
  const clientData: CourseClientData = {
    modules: catalog.modules,
    specializations: catalog.specializations,
    lessons: catalog.lessons.map(({ id, moduleId, title, description, duration, objectives, quiz }) => ({
      id, moduleId, title, description, duration, objectives, quizOptionCount: quiz.options.length,
    })),
    currentLesson: catalog.lessons.find(lesson => route === `bai-hoc/${lesson.id}`) ?? null,
  };
  return <>
    {data.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />}
    <CourseProvider value={clientData}><LearningApp initialRoute={route} /></CourseProvider>
  </>;
}
