import { CourseProvider } from "@/components/course-context";
import LearningApp from "@/components/learning-app";
import { getCourseNavigation } from "@/lib/course-navigation";

export default async function LearningLayout({ children }: { children: React.ReactNode }) {
  const navigation = await getCourseNavigation();
  return <CourseProvider value={navigation}><LearningApp>{children}</LearningApp></CourseProvider>;
}
