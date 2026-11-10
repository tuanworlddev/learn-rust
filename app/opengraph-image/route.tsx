import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-static";
export async function GET() {
  const font = new Uint8Array(await readFile(join(process.cwd(), "public/fonts/OpenSans-Semibold.ttf"))).buffer;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", padding: "80px", background: "#f8f7f4", color: "#17191d", fontFamily: "Open Sans" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: 38 }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, background: "#a63d26", color: "white", borderRadius: 12 }}>R</span>
        <span>Learn Rust</span>
      </div>
      <div style={{ display: "flex", marginTop: 64, fontSize: 66, lineHeight: 1.2 }}>Học Rust bằng tiếng Việt</div>
      <div style={{ display: "flex", marginTop: 24, fontSize: 29, color: "#4b4e53" }}>Lý thuyết · Thực hành · Phỏng vấn</div>
      <div style={{ display: "flex", marginTop: "auto", fontSize: 25, color: "#a63d26" }}>Từ bài học đầu tiên đến dự án thực tế.</div>
    </div>,
    { width: 1200, height: 630, fonts: [{ name: "Open Sans", data: font, weight: 600, style: "normal" }] },
  );
}
