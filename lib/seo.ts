import type { Metadata } from "next";
import { lessons, modules } from "@/src/data/curriculum";
import { projects } from "@/src/data/projects";
import { routeHref } from "./routes";
import { getSiteConfig } from "./site-config";

const staticPages: Record<string, { title: string; description: string; indexable: boolean }> = {
  "lo-trinh": { title: "Học Rust bằng tiếng Việt", description: `Học Rust qua ${modules.length} chương, ${lessons.length} bài học: ownership, trait, async, kiểm thử và dự án. Đọc lý thuyết, viết mã và thực hành ngay trên web.`, indexable: true },
  "du-an": { title: "Dự án thực hành Rust", description: "Vận dụng Rust qua dự án quản lý chi tiêu, phân tích văn bản và quản lý công việc. Có yêu cầu, mã khởi đầu, bài kiểm tra và lời giải.", indexable: true },
  "phong-van": { title: "Phỏng vấn Rust", description: "Ôn phỏng vấn Rust với câu hỏi ownership, borrowing, lifetime, trait, async và thiết kế API. Thực hành dự án và tự đánh giá qua mã nguồn, kiểm thử.", indexable: true },
  "thuc-hanh": { title: "Thực hành Rust", description: "Viết, biên dịch và chạy mã Rust ngay trong trình duyệt.", indexable: false },
  "so-tay": { title: "Sổ tay Rust", description: "Ghi chú cá nhân và các bài học Rust đã lưu.", indexable: false },
};

export function getPageInfo(route: string) {
  const lesson = lessons.find(item => route === `bai-hoc/${item.id}`);
  if (lesson) return { title: lesson.title, description: lesson.description, indexable: true, lesson, project: null };
  const project = projects.find(item => route === `du-an/${item.id}`);
  if (project) return { title: project.title, description: project.description, indexable: true, lesson: null, project };
  const page = Object.prototype.hasOwnProperty.call(staticPages, route) ? staticPages[route] : null;
  return page ? { ...page, lesson: null, project: null } : null;
}

export function pageMetadata(route: string): Metadata {
  const info = getPageInfo(route);
  if (!info) return { title: "Không tìm thấy trang", robots: { index: false, follow: true } };
  const { origin, indexable } = getSiteConfig();
  const url = origin ? `${origin}${routeHref(route)}` : undefined;
  const title = `${info.title} · Learn Rust`;
  const allowIndex = indexable && info.indexable;
  return {
    title, description: info.description,
    alternates: url ? { canonical: url } : undefined,
    robots: { index: allowIndex, follow: true },
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

export function indexableRoutes(): string[] {
  return ["lo-trinh", "du-an", "phong-van", ...lessons.map(item => `bai-hoc/${item.id}`), ...projects.map(item => `du-an/${item.id}`)];
}

export function pageStructuredData(route: string): Record<string, unknown>[] {
  const { origin } = getSiteConfig();
  const info = getPageInfo(route);
  if (!origin || !info || !info.indexable) return [];
  const url = `${origin}${routeHref(route)}`;
  const course = {
    "@context": "https://schema.org", "@type": "Course", "@id": `${origin}/#course`,
    name: "Học Rust bằng tiếng Việt", description: staticPages["lo-trinh"].description,
    inLanguage: "vi", isAccessibleForFree: true, url: `${origin}/`,
    provider: { "@type": "Organization", name: "Learn Rust", url: `${origin}/` },
  };
  if (route === "lo-trinh") return [course];
  const crumbs: Record<string, unknown>[] = [{ "@type": "ListItem", position: 1, name: "Học Rust", item: `${origin}/` }];
  if (info.project) crumbs.push({ "@type": "ListItem", position: 2, name: "Dự án", item: `${origin}/du-an` });
  crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: info.title, item: url });
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs };
  if (!info.lesson && !info.project) return [breadcrumb];
  return [breadcrumb, {
    "@context": "https://schema.org", "@type": "LearningResource", "@id": `${url}#lesson`,
    name: info.title, description: info.description, url, inLanguage: "vi",
    isAccessibleForFree: true, learningResourceType: info.lesson ? "Lesson" : "Exercise",
    teaches: info.lesson?.objectives ?? info.project?.objectives,
    isPartOf: { "@type": "Course", "@id": `${origin}/#course`, name: "Học Rust bằng tiếng Việt" },
  }];
}
