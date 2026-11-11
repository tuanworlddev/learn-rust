"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Search, X } from "lucide-react";
import type { Specialization } from "@/src/data/specialization-types";
import type { LessonSummary } from "@/lib/course-types";
import type { Progress } from "./learning-shared";
import { projectCompletionKey } from "@/lib/course-assessment";
import { useCourse } from "./course-context";
import { AnimatedDisclosure } from "./animated-disclosure";
import "./specialization-views.css";
import "./course-learning.css";

const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
const projectLevel = { guided: "Có hướng dẫn", independent: "Tự triển khai", capstone: "Dự án cuối khóa" };

export function CoursesView({ progress, resume }: { progress: Progress; resume: LessonSummary }) {
  const { specializations, lessons, modules } = useCourse();
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());
  const visible = useMemo(() => specializations.filter(track => normalize(track.title + " " + track.description + " " + track.technologies.join(" ")).includes(q)), [q, specializations]);
  const base = lessons.filter(lesson => !lesson.moduleId.startsWith("track-"));
  const showFoundation = !q || normalize("Kiến thức nền tảng Rust ownership borrowing trait async Cargo cơ bản").includes(q);
  return <section className="specializations-index">
    <header className="course-catalog-heading"><div><h1>Bài học</h1><p>Xây nền tảng Rust, rồi chọn lĩnh vực bạn muốn phát triển.</p></div>
      {progress.lastLesson && <Link href={"/bai-hoc/" + resume.id} prefetch={false} className="button button-primary">{progress.completed.includes(resume.id) ? "Ôn lại" : "Học tiếp"}<ArrowRight size={16} /></Link>}
    </header>
    <div className="specializations-toolbar"><label className="course-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm khóa học hoặc công nghệ…" aria-label="Tìm khóa học" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Xóa tìm kiếm"><X size={15} /></button>}</label><span role="status">{visible.length + (showFoundation ? 1 : 0)} khóa học</span></div>
    {showFoundation && <Link className="foundation-course-card" href="/khoa-hoc/nen-tang" prefetch={false}>
      <div><span className="course-card-eyebrow">Bắt đầu từ đây</span><h2>Kiến thức nền tảng</h2><p>Ngôn ngữ, ownership, trait, async, kiểm thử và cách tổ chức chương trình.</p><div className="course-card-meta">{modules.filter(item => !item.id.startsWith("track-")).length} chương · {base.length} bài{progress.completed.some(id => base.some(lesson => lesson.id === id)) && " · " + base.filter(lesson => progress.completed.includes(lesson.id)).length + " hoàn thành"}</div></div><ArrowRight size={20} />
    </Link>}
    {visible.length > 0 && <section aria-labelledby="advanced-courses-title"><h2 className="course-group-title" id="advanced-courses-title">Kiến thức chuyên sâu</h2><div className="specializations-grid">{visible.map(track => {
      const completed = track.lessonIds.filter(id => progress.completed.includes(id)).length;
      return <Link key={track.id} className="specialization-card" href={"/khoa-hoc/" + track.id} prefetch={false} data-color={track.color}>
        <div className="specialization-card-top"><span>{track.chapters?.length ?? 1} chương · {track.lessonIds.length} bài</span><ArrowRight size={17} /></div>
        <h3>{track.title}</h3><p>{track.description}</p>
        <div className="course-card-meta">{track.projects.length || 1} dự án{completed > 0 ? " · " + completed + "/" + track.lessonIds.length + " bài hoàn thành" : ""}</div>
      </Link>;
    })}</div></section>}
    {!visible.length && !showFoundation && <p className="specializations-empty">Chưa tìm thấy khóa phù hợp. Thử “backend”, “ESP32” hoặc “AI”.</p>}
  </section>;
}

export function SpecializationView({ track, progress }: { track: Specialization; progress: Progress }) {
  const { lessons } = useCourse();
  const ordered = track.lessonIds.flatMap(id => { const lesson = lessons.find(item => item.id === id); return lesson ? [lesson] : []; });
  const done = ordered.filter(lesson => progress.completed.includes(lesson.id)).length;
  const resume = ordered.find(lesson => lesson.id === progress.lastLesson && !progress.completed.includes(lesson.id)) ?? ordered.find(lesson => !progress.completed.includes(lesson.id)) ?? ordered[0];
  const chapters = track.chapters ?? [{ id: track.id + "-overview", title: "Lộ trình học", description: track.outcome, lessonIds: track.lessonIds, outcomes: [] }];
  return <section className="specialization-detail" data-color={track.color}>
    <Link href="/" className="specialization-back"><ArrowLeft size={15} />Bài học</Link>
    <header className="specialization-hero"><div><p className="specialization-kicker">Khóa chuyên sâu</p><h1>{track.title}</h1><p className="specialization-outcome">{track.outcome}</p></div>{resume && <Link className="button button-primary" href={"/bai-hoc/" + resume.id} prefetch={false}>{done === ordered.length ? "Ôn lại" : done ? "Học tiếp" : "Bắt đầu học"}<ArrowRight size={16} /></Link>}</header>
    <div className="specialization-meta"><span>{chapters.length} chương</span><span>{ordered.length} bài học</span><span>{track.projects?.length ?? 1} dự án</span>{done > 0 && <span>{done}/{ordered.length} bài hoàn thành</span>}</div>
    <nav className="course-section-nav" aria-label="Các phần của khóa học"><a href="#course-chapters">Chương học</a><a href="#course-projects">Dự án</a>{track.assessment && <Link href={"/khoa-hoc/" + track.id + "/danh-gia"} prefetch={false}>Đánh giá năng lực<ArrowRight size={14} /></Link>}</nav>
    <AnimatedDisclosure className="specialization-prerequisites" title={<><span>Kiến thức cần có</span><ChevronDown size={16} /></>}><ul>{track.prerequisites.map(item => <li key={item}>{item}</li>)}</ul><Link className="text-link course-prerequisite-link" href="/khoa-hoc/nen-tang">Ôn kiến thức nền tảng<ArrowRight size={14} /></Link></AnimatedDisclosure>
    <section className="course-chapters" id="course-chapters" aria-labelledby="course-chapters-title"><h2 id="course-chapters-title">Chương học</h2>
      {chapters.map((chapter, chapterIndex) => <AnimatedDisclosure key={chapter.id} className="course-chapter" defaultOpen={chapterIndex === 0 || chapter.lessonIds.includes(progress.lastLesson ?? "")} title={<><span className="course-chapter-index">{String(chapterIndex + 1).padStart(2, "0")}</span><span>{chapter.title}<small>{chapter.lessonIds.filter(id => progress.completed.includes(id)).length > 0 ? chapter.lessonIds.filter(id => progress.completed.includes(id)).length + "/" + chapter.lessonIds.length + " bài hoàn thành" : chapter.lessonIds.length + " bài"}</small></span><ChevronDown size={16} /></>}>
        <div className="course-chapter-intro"><p>{chapter.description}</p>{chapter.outcomes.length > 0 && <ul>{chapter.outcomes.map(item => <li key={item}>{item}</li>)}</ul>}</div>
        <ol className="course-chapter-lessons">{chapter.lessonIds.map((id, lessonIndex) => {
          const lesson = lessons.find(item => item.id === id); if (!lesson) return null;
          return <li key={id}><Link href={"/bai-hoc/" + id} prefetch={false}><span className="course-lesson-index">{progress.completed.includes(id) ? <Check size={15} aria-label="Đã hoàn thành" /> : chapterIndex + 1 + "." + (lessonIndex + 1)}</span><div><h3>{lesson.title}</h3>{lesson.hasLab && <span>Dự án Cargo</span>}</div><span className="specialization-duration">{lesson.duration} phút</span><ArrowRight size={14} /></Link></li>;
        })}</ol>
      </AnimatedDisclosure>)}
    </section>
    <section className="course-projects-section" id="course-projects" aria-labelledby="course-projects-title"><h2 id="course-projects-title">Dự án thực tế</h2>
      {track.projects?.length ? <div className="course-project-grid">{track.projects.map((project, index) => <Link key={project.id} href={"/du-an/" + project.id} prefetch={false} className="course-project-card"><span>{String(index + 1).padStart(2, "0")} · {projectLevel[project.level]}</span><h3>{project.title}</h3><p>{project.description}</p><footer><span>{project.estimatedHours} giờ thực hành</span>{progress.finishedProjects.includes(projectCompletionKey(project)) ? <Check size={16} aria-label="Đã tự nghiệm thu" /> : <ArrowRight size={16} />}</footer></Link>)}</div> :
        <div className="course-legacy-capstone"><h3>{track.capstone.title}</h3><p>{track.capstone.description}</p>{track.capstone.milestones.map(item => <AnimatedDisclosure key={item.title} className="course-chapter" title={<><span>{item.title}</span><ChevronDown size={16} /></>}><ul>{item.tasks.map(task => <li key={task}>{task}</li>)}</ul><p>{item.acceptance}</p></AnimatedDisclosure>)}</div>}
    </section>
    {track.assessment && <section className="course-assessment-callout"><div><h2>Kiểm tra trước khi nhận dự án</h2><p>Giải quyết tình huống, rà sản phẩm và xác định phần cần luyện thêm.</p></div><Link href={"/khoa-hoc/" + track.id + "/danh-gia"} prefetch={false} className="button button-secondary">Đánh giá năng lực<ArrowRight size={16} /></Link></section>}
  </section>;
}
