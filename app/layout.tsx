import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site-config";
import "./globals.css";
export const dynamic = "force-dynamic";
export function generateMetadata(): Metadata {
  const { origin, indexable } = getSiteConfig();
  return {
    title: "Learn Rust", applicationName: "Learn Rust",
    description: "Học Rust từ cơ bản đến nâng cao. Lý thuyết, bài tập và thực hành ngay trên web.",
    metadataBase: origin ? new URL(origin) : undefined,
    robots: { index: indexable, follow: true },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi"><body>{children}</body></html>; }
