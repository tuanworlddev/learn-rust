import { strToU8, zipSync } from "fflate";
import { getCourseCatalog } from "@/lib/course-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9][a-z0-9_-]{0,99}$/.test(id)) return new Response("Không tìm thấy dự án.", { status: 404 });
  try {
    const catalog = await getCourseCatalog();
    const lab = catalog.lessons.find(lesson => lesson.id === id)?.localLab;
    if (!lab) return new Response("Không tìm thấy dự án.", { status: 404 });
    const files: Record<string, Uint8Array> = Object.create(null);
    for (const file of lab.files) files[`${id}/${file.path}`] = strToU8(file.content);
    const guide = [
      `# ${lab.title}`, "", lab.instructions, "",
      "## Chạy dự án", "", "Giải nén và mở terminal trong thư mục có Cargo.toml trước khi chạy các lệnh dưới đây.", "", "```sh", ...lab.commands, "```", "",
      "## Kiểm tra kết quả", "", ...lab.checks.map(check => `- ${check}`), "",
    ].join("\n");
    if (!Object.hasOwn(files, `${id}/LEARN_RUST.md`)) files[`${id}/LEARN_RUST.md`] = strToU8(guide);
    const archive = zipSync(files, { level: 1, mtime: new Date("2026-01-01T00:00:00Z") });
    return new Response(archive, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${id}.zip"`,
        "Content-Length": String(archive.byteLength),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return new Response("Chưa tải được dự án. Hãy thử lại.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
  }
}
