import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Learn Rust",
  description: "Học Rust từ cơ bản đến nâng cao. Lý thuyết, bài tập và thực hành ngay trên web.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi"><body>{children}</body></html>; }
