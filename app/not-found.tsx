import Link from "next/link";
export default function NotFound() {
  return <main className="mx-auto max-w-xl px-6 py-20">
    <Link href="/" className="text-link">Learn Rust</Link>
    <h1 className="mt-6 text-2xl">Không tìm thấy trang</h1>
    <p className="my-4">Đường dẫn này không còn tồn tại.</p>
    <Link href="/" className="button button-primary">Về mục lục</Link>
  </main>;
}
