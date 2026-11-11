import type { CourseModule, Lesson } from "../curriculum";
import type { SpecializationBundle, TrackExpansion } from "../specialization-types";
import { backendExpansion } from "./expanded/backend";
import { desktopExpansion } from "./expanded/desktop";
import { embeddedExpansion } from "./expanded/embedded";
import { mobileExpansion } from "./expanded/mobile";
import { dataExpansion } from "./expanded/data";
import { aiExpansion } from "./expanded/ai";
import { cliExpansion } from "./expanded/cli";
import { backendBundle } from "./backend";
import { systemsBundle } from "./systems";
import { embeddedBundle } from "./embedded";
import { desktopBundle } from "./desktop";
import { mobileBundle } from "./mobile";
import { cliBundle } from "./cli";
import { wasmBundle } from "./wasm";
import { compilerBundle } from "./compiler";
import { securityBundle } from "./security";
import { gameBundle } from "./game";
import { dataBundle } from "./data";
import { aiBundle } from "./ai";
import { blockchainBundle } from "./blockchain";

import { wasmExpansion } from "./expanded/wasm";

import { gameExpansion } from "./expanded/game";

import { systemsExpansion } from "./expanded/systems";

import { blockchainExpansion } from "./expanded/blockchain";

import { compilerExpansion } from "./expanded/compiler";

import { securityExpansion } from "./expanded/security";

const courseArt: Record<string, NonNullable<Lesson["illustration"]>> = {
  data: { src: "/images/lessons/data-workbench.webp", alt: "Bàn xử lý dữ liệu với bảng dữ liệu, khay bản ghi lỗi và khay dữ liệu đã kiểm tra", caption: "Tách bản ghi lỗi để giữ dữ liệu đầu ra có thể kiểm chứng." },
  ai: { src: "/images/lessons/ai-workbench.webp", alt: "Bàn thực hành AI với mẫu đầu vào, mô hình và các kết quả được đối chiếu", caption: "Kiểm tra dữ liệu, mô hình và kết quả suy luận như ba phần của cùng một hệ thống." },
  compiler: { src: "/images/lessons/compiler-workbench.webp", alt: "Bàn xây compiler với mã nguồn, các token và mô hình cây cú pháp", caption: "Biến mã nguồn thành cấu trúc có thể kiểm tra trước khi thực thi." },
};
const expansions: Record<string, TrackExpansion> = { security: securityExpansion, compiler: compilerExpansion, blockchain: blockchainExpansion, systems: systemsExpansion, game: gameExpansion, wasm: wasmExpansion, backend: backendExpansion, desktop: desktopExpansion, embedded: embeddedExpansion, mobile: mobileExpansion, data: dataExpansion, ai: aiExpansion, cli: cliExpansion };
function expand(bundle: SpecializationBundle): SpecializationBundle {
  const expansion = expansions[bundle.track.id];
  if (!expansion) return bundle;
  const byId = new Map([...bundle.lessons, ...expansion.lessons].map(lesson => [lesson.id, lesson]));
  const lessonIds = expansion.chapters.flatMap(chapter => chapter.lessonIds);
  const ordered = lessonIds.map(id => {
    const lesson = byId.get(id);
    if (!lesson) throw new Error("Course chapter references unknown lesson: " + id);
    return id === expansion.projects[0]?.labLessonId && courseArt[bundle.track.id] ? { ...lesson, illustration: courseArt[bundle.track.id] } : lesson;
  });
  if (byId.size !== ordered.length || new Set(lessonIds).size !== ordered.length) throw new Error("Course chapters must contain every lesson once: " + bundle.track.id);
  return { track: { ...bundle.track, chapters: expansion.chapters, projects: expansion.projects, assessment: expansion.assessment, lessonIds }, lessons: ordered };
}
export const specializationBundles = [backendBundle, systemsBundle, embeddedBundle, desktopBundle, mobileBundle, cliBundle, wasmBundle, compilerBundle, securityBundle, gameBundle, dataBundle, aiBundle, blockchainBundle].map(expand);
export const specializations = specializationBundles.map(bundle => bundle.track);
export const specializationLessons = specializationBundles.flatMap(bundle => bundle.lessons);
export const specializationModules: CourseModule[] = specializations.map(track => ({
  id: `track-${track.id}`, title: track.shortTitle, description: track.description,
  color: track.color, icon: "book", level: "Chuyên sâu",
}));
