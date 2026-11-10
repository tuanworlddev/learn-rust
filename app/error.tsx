"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center gap-4 px-6">
    <p className="text-sm text-[var(--accent)]">Learn Rust</p>
    <h1 className="text-2xl font-semibold">Chưa tải được nội dung</h1>
    <p className="text-sm leading-7 text-[var(--muted)]">Hãy thử lại sau ít phút. Tiến độ và bản nháp của bạn vẫn được giữ.</p>
    <div className="flex gap-4"><button type="button" className="button button-primary" onClick={reset}>Thử lại</button><Link className="button button-secondary" href="/">Về lộ trình</Link></div>
  </main>;
}
