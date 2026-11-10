import type { Metadata } from "next";
import { projects } from "@/src/data/projects";
import { getCourseCatalog } from "./course-content";
import { routeHref } from "./routes";
import { getSiteConfig } from "./site-config";

const staticPages: Record<string, { title: string; description: string; indexable: boolean }> = {
  "lo-trinh": { title: "Học Rust bằng tiếng Việt", description: "Học Rust từ cơ bản đến nâng cao: ownership, trait, async, kiểm thử và dự án. Đọc lý thuyết, viết mã và thực hành ngay trên web.", indexable: true },
  "chuyen-sau": { title: "Các hướng chuyên sâu Rust", description: "Học Rust theo lĩnh vực: backend, hệ thống, nhúng, desktop, mobile, CLI, WebAssembly, compiler, bảo mật, game, dữ liệu, AI và blockchain.", indexable: true },
  "du-an": { title: "Dự án thực hành Rust", description: "Vận dụng Rust qua dự án quản lý chi tiêu, phân tích văn bản và quản lý công việc. Có yêu cầu, mã khởi đầu, bài kiểm tra và lời giải.", indexable: true },
  "phong-van": { title: "Phỏng vấn Rust", description: "Ôn phỏng vấn Rust với câu hỏi ownership, borrowing, lifetime, trait, async và thiết kế API. Thực hành dự án và tự đánh giá qua mã nguồn, kiểm thử.", indexable: true },
  "thuc-hanh": { title: "Thực hành Rust", description: "Viết, biên dịch và chạy mã Rust ngay trong trình duyệt.", indexable: false },
  "so-tay": { title: "Sổ tay Rust", description: "Ghi chú cá nhân và các bài học Rust đã lưu.", indexable: false },
};

export async function getPageInfo(route: string) {
  const { lessons, specializations } = await getCourseCatalog();
  const lesson = lessons.find(item => route === `bai-hoc/${item.id}`);
  if (lesson) return { title: lesson.title, description: lesson.description, indexable: true, lesson, project: null, track: null };
  const track = specializations.find(item => route === `chuyen-sau/${item.id}`);
  if (track) return { title: track.title, description: track.description, indexable: true, lesson: null, project: null, track };
  const project = projects.find(item => route === `du-an/${item.id}`);
  if (project) return { title: project.title, description: project.description, indexable: true, lesson: null, project, track: null };
  const page = Object.prototype.hasOwnProperty.call(staticPages, route) ? staticPages[route] : null;
  return page ? { ...page, lesson: null, project: null, track: null } : null;
}

export async function pageMetadata(route: string): Promise<Metadata> {
  const info = await getPageInfo(route);
  if (!info) return { title: "Không tìm thấy trang", robots: { index: false, follow: true } };
  const { origin, indexable } = getSiteConfig();
  const url = origin ? `${origin}${routeHref(route)}` : undefined;
  const title = `${info.title} · Learn Rust`;
  return {
    title, description: info.description,
    alternates: url ? { canonical: url } : undefined,
    robots: { index: indexable && info.indexable, follow: true },
    openGraph: {
      title, description: info.description, siteName: "Learn Rust", locale: "vi_VN",
      type: info.lesson ? "article" : "website", url,
      images: origin ? [{ url: `${origin}/opengraph-image`, width: 1200, height: 630, alt: "Learn Rust — Học Rust bằng tiếng Việt" }] : [],
    },
    twitter: {
      card: origin ? "summary_large_image" : "summary", title, description: info.description,
      images: origin ? [`${origin}/opengraph-image`] : [],
    },
  };
}

export async function indexableRoutes(): Promise<string[]> {
  const { lessons, specializations } = await getCourseCatalog();
  return ["lo-trinh", "chuyen-sau", "du-an", "phong-van", ...specializations.map(item => `chuyen-sau/${item.id}`), ...lessons.map(item => `bai-hoc/${item.id}`), ...projects.map(item => `du-an/${item.id}`)];
}

export async function pageStructuredData(route: string): Promise<Record<string, unknown>[]> {
  const { origin } = getSiteConfig();
  const info = await getPageInfo(route);
  if (!origin || !info || !info.indexable) return [];
  const url = `${origin}${routeHref(route)}`;
  const { specializations } = await getCourseCatalog();
  const lessonTrack = info.lesson ? specializations.find(track => track.lessonIds.includes(info.lesson!.id)) : undefined;
  const course = {
    "@context": "https://schema.org", "@type": "Course", "@id": `${origin}/#course`,
    name: "Học Rust bằng tiếng Việt", description: staticPages["lo-trinh"].description,
    inLanguage: "vi", url: `${origin}/`,
    provider: { "@type": "Organization", name: "Learn Rust", url: `${origin}/` },
  };
  if (route === "lo-trinh") return [course];
  const crumbs: Record<string, unknown>[] = [{ "@type": "ListItem", position: 1, name: "Học Rust", item: `${origin}/` }];
  if (info.project) crumbs.push({ "@type": "ListItem", position: 2, name: "Dự án", item: `${origin}/du-an` });
  if (info.track || lessonTrack) crumbs.push({ "@type": "ListItem", position: 2, name: "Chuyên sâu", item: `${origin}/chuyen-sau` });
  if (lessonTrack) crumbs.push({ "@type": "ListItem", position: 3, name: lessonTrack.title, item: `${origin}/chuyen-sau/${lessonTrack.id}` });
  crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: info.title, item: url });
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs };
  if (info.track) return [breadcrumb, {
    ...course, "@id": `${url}#course`, url, name: info.title, description: info.description,
    coursePrerequisites: info.track.prerequisites.join(", "), teaches: info.track.outcome,
    hasPart: info.track.lessonIds.map(id => ({ "@type": "LearningResource", url: `${origin}/bai-hoc/${id}` })),
  }];
  if (!info.lesson && !info.project) return [breadcrumb];
  return [breadcrumb, {
    "@context": "https://schema.org", "@type": "LearningResource", "@id": `${url}#lesson`,
    name: info.title, description: info.description, url, inLanguage: "vi",
    learningResourceType: info.lesson ? "Lesson" : "Exercise",
    teaches: info.lesson?.objectives ?? info.project?.objectives,
    isPartOf: { "@type": "Course", "@id": lessonTrack ? `${origin}/chuyen-sau/${lessonTrack.id}#course` : `${origin}/#course`, name: lessonTrack?.title ?? "Học Rust bằng tiếng Việt" },
  }];
}
