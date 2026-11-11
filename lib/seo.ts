import type { Metadata } from "next";
import { projects } from "@/src/data/projects";
import { getCourseCatalog } from "./course-content";
import { routeHref } from "./routes";
import { getSiteConfig } from "./site-config";

const staticPages: Record<string, { title: string; description: string; indexable: boolean }> = {
  "lo-trinh": { title: "Học Rust bằng tiếng Việt", description: "Các khóa học Rust bằng tiếng Việt: kiến thức nền tảng và 13 lĩnh vực chuyên sâu. Học lý thuyết, thực hành mã, làm dự án và kiểm tra kiến thức.", indexable: true },
  "khoa-hoc/nen-tang": { title: "Kiến thức nền tảng Rust", description: "Học Rust từ cú pháp, ownership và borrowing đến trait, async, kiểm thử và thiết kế chương trình. Thực hành từng bài ngay trong trình duyệt.", indexable: true },
  "du-an": { title: "Dự án thực hành Rust", description: "Làm dự án Rust theo từng lĩnh vực, từ bài thực hành nền tảng đến ứng dụng chuyên sâu. Có mã Cargo, tình huống kiểm thử và tiêu chí nghiệm thu.", indexable: true },
  "phong-van": { title: "Phỏng vấn Rust", description: "Ôn phỏng vấn Rust với câu hỏi ownership, borrowing, lifetime, trait, async và thiết kế API. Thực hành dự án và tự đánh giá qua mã nguồn, kiểm thử.", indexable: true },
  "thuc-hanh": { title: "Thực hành Rust", description: "Viết, biên dịch và chạy mã Rust ngay trong trình duyệt.", indexable: false },
  "so-tay": { title: "Sổ tay Rust", description: "Ghi chú cá nhân và các bài học Rust đã lưu.", indexable: false },
};

export async function getPageInfo(route: string) {
  const { lessons, specializations } = await getCourseCatalog();
  const empty = { lesson: null, project: null, track: null, courseProject: null, isAssessment: false };
  const lesson = lessons.find(item => route === "bai-hoc/" + item.id);
  if (lesson) return { ...empty, title: lesson.title, description: lesson.description, indexable: true, lesson };
  const track = specializations.find(item => route === "khoa-hoc/" + item.id || route === "khoa-hoc/" + item.id + "/danh-gia");
  if (track) {
    const isAssessment = route.endsWith("/danh-gia");
    if (isAssessment && !track.assessment) return null;
    return { ...empty, title: isAssessment ? track.assessment!.title + " · " + track.shortTitle : track.title,
      description: isAssessment ? track.assessment!.instructions : track.description, indexable: !isAssessment, track, isAssessment };
  }
  const project = projects.find(item => route === "du-an/" + item.id);
  if (project) return { ...empty, title: project.title, description: project.description, indexable: true, project };
  for (const course of specializations) {
    const courseProject = course.projects?.find(item => route === "du-an/" + item.id);
    if (courseProject) return { ...empty, title: courseProject.title, description: courseProject.description, indexable: true, courseProject, track: course };
  }
  const page = Object.prototype.hasOwnProperty.call(staticPages, route) ? staticPages[route] : null;
  return page ? { ...empty, ...page } : null;
}

export async function pageMetadata(route: string): Promise<Metadata> {
  const info = await getPageInfo(route);
  if (!info) return { title: "Không tìm thấy trang", robots: { index: false, follow: true } };
  const { origin, indexable } = getSiteConfig();
  const url = origin ? origin + routeHref(route) : undefined;
  const title = info.title + " · Learn Rust";
  return {
    title, description: info.description,
    alternates: url ? { canonical: url } : undefined,
    robots: { index: indexable && info.indexable, follow: true },
    openGraph: {
      title, description: info.description, siteName: "Learn Rust", locale: "vi_VN",
      type: info.lesson ? "article" : "website", url,
      images: origin ? [{ url: origin + "/opengraph-image", width: 1200, height: 630, alt: "Learn Rust — Học Rust bằng tiếng Việt" }] : [],
    },
    twitter: {
      card: origin ? "summary_large_image" : "summary", title, description: info.description,
      images: origin ? [origin + "/opengraph-image"] : [],
    },
  };
}

export async function indexableRoutes(): Promise<string[]> {
  const { lessons, specializations } = await getCourseCatalog();
  return ["lo-trinh", "khoa-hoc/nen-tang", "du-an", "phong-van",
    ...specializations.map(item => "khoa-hoc/" + item.id),
    ...lessons.map(item => "bai-hoc/" + item.id),
    ...projects.map(item => "du-an/" + item.id),
    ...specializations.flatMap(item => (item.projects ?? []).map(project => "du-an/" + project.id))];
}

export async function pageStructuredData(route: string): Promise<Record<string, unknown>[]> {
  const { origin } = getSiteConfig();
  const info = await getPageInfo(route);
  if (!origin || !info || !info.indexable) return [];
  const url = origin + routeHref(route);
  const { lessons, specializations } = await getCourseCatalog();
  const courseTrack = info.track ?? (info.lesson ? specializations.find(track => track.lessonIds.includes(info.lesson!.id)) : undefined);
  const courseUrl = origin + "/khoa-hoc/" + (courseTrack?.id ?? "nen-tang");
  const courseName = courseTrack?.title ?? "Kiến thức nền tảng Rust";
  if (route === "lo-trinh") return [{
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": origin + "/#courses",
    name: info.title, description: info.description, inLanguage: "vi", url,
    hasPart: [{ "@type": "Course", name: "Kiến thức nền tảng Rust", url: origin + "/khoa-hoc/nen-tang" },
      ...specializations.map(track => ({ "@type": "Course", name: track.title, url: origin + "/khoa-hoc/" + track.id }))],
  }];
  const crumbs: Record<string, unknown>[] = [{ "@type": "ListItem", position: 1, name: "Bài học", item: origin + "/" }];
  if (info.lesson || info.courseProject) crumbs.push({ "@type": "ListItem", position: 2, name: courseName, item: courseUrl });
  else if (info.project) crumbs.push({ "@type": "ListItem", position: 2, name: "Dự án", item: origin + "/du-an" });
  crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: info.title, item: url });
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs };
  if ((info.track && !info.courseProject) || route === "khoa-hoc/nen-tang") return [breadcrumb, {
    "@context": "https://schema.org", "@type": "Course", "@id": url + "#course", url,
    name: info.title, description: info.description, inLanguage: "vi",
    provider: { "@type": "Organization", name: "Learn Rust", url: origin + "/" },
    coursePrerequisites: info.track?.prerequisites.join(", "),
    teaches: info.track?.outcome ?? "Cú pháp Rust, ownership, borrowing, trait, async và kiểm thử.",
    hasPart: (info.track?.lessonIds ?? lessons.filter(lesson => !lesson.moduleId.startsWith("track-")).map(lesson => lesson.id))
      .map(id => ({ "@type": "LearningResource", url: origin + "/bai-hoc/" + id })),
  }];
  if (!info.lesson && !info.project && !info.courseProject) return [breadcrumb];
  return [breadcrumb, {
    "@context": "https://schema.org", "@type": "LearningResource", "@id": url + "#lesson",
    name: info.title, description: info.description, url, inLanguage: "vi",
    learningResourceType: info.lesson ? "Lesson" : "Project",
    teaches: info.lesson?.objectives ?? info.project?.objectives ?? info.courseProject?.requirements,
    isPartOf: { "@type": "Course", "@id": courseUrl + "#course", name: courseName },
  }];
}
