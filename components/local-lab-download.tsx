import { Download } from "lucide-react";
import type { Lesson } from "@/src/data/curriculum";

export function LocalLabDownload({ lessonId, lab }: { lessonId: string; lab: NonNullable<Lesson["localLab"]> }) {
  return <div className="lv-lab-download">
    <a href={`/api/lessons/${lessonId}/lab`} download={`${lessonId}.zip`} aria-label={`Tải dự án: ${lab.title}`}>
      <Download size={14} />Tải dự án
    </a>
  </div>;
}
