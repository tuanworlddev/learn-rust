"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Search, X } from "lucide-react";
import type { Specialization } from "@/src/data/specialization-types";
import type { Progress } from "./learning-shared";
import { useCourse } from "./course-context";
import { AnimatedDisclosure } from "./animated-disclosure";
import "./specialization-views.css";

const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");

export function SpecializationsView({ progress }: { progress: Progress }) {
  const { specializations } = useCourse();
  const [query, setQuery] = useState("");
  const visible = useMemo(() => specializations.filter(track => normalize(`${track.title} ${track.description} ${track.technologies.join(" ")}`).includes(normalize(query.trim()))), [query, specializations]);
  return <section className="specializations-index">
    <header className="specializations-heading"><h1>Chuyên sâu Rust</h1><p>Chọn lĩnh vực, xây kỹ năng qua bài học và một dự án hoàn chỉnh.</p></header>
    <div className="specializations-toolbar"><label className="course-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm lĩnh vực hoặc công nghệ…" aria-label="Tìm hướng chuyên sâu" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Xóa tìm kiếm"><X size={15} /></button>}</label><span role="status">{visible.length} hướng</span></div>
    <div className="specializations-grid">{visible.map(track => {
      const completed = track.lessonIds.filter(id => progress.completed.includes(id)).length;
      return <Link key={track.id} className="specialization-card" href={`/chuyen-sau/${track.id}`} prefetch={false} data-color={track.color}>
        <div className="specialization-card-top"><span className="specialization-number">{String(specializations.indexOf(track) + 1).padStart(2, "0")}</span><span>{track.lessonIds.length} bài{completed > 0 ? ` · ${completed} hoàn thành` : ""}</span><ArrowRight size={17} /></div>
        <h2>{track.title}</h2><p>{track.description}</p><div className="specialization-technologies">{track.technologies.slice(0, 4).join(" · ")}</div>
      </Link>;
    })}</div>
    {!visible.length && <p className="specializations-empty">Chưa có lĩnh vực phù hợp. Thử “backend”, “ESP32” hoặc “AI”.</p>}
    <div className="specialization-foundation"><div><h2>Củng cố nền tảng</h2><p>Ownership, trait, xử lý lỗi và kiểm thử là điểm bắt đầu cho mọi hướng.</p></div><Link href="/" className="text-link">Mở bài học cơ bản<ArrowRight size={15} /></Link></div>
  </section>;
}

export function SpecializationView({ track, progress }: { track: Specialization; progress: Progress }) {
  const { lessons } = useCourse();
  const ordered = track.lessonIds.flatMap(id => { const lesson = lessons.find(item => item.id === id); return lesson ? [lesson] : []; });
  const done = ordered.filter(lesson => progress.completed.includes(lesson.id)).length;
  const resume = ordered.find(lesson => lesson.id === progress.lastLesson && !progress.completed.includes(lesson.id)) ?? ordered.find(lesson => !progress.completed.includes(lesson.id)) ?? ordered[0];
  return <section className="specialization-detail" data-color={track.color}>
    <Link href="/chuyen-sau" className="specialization-back"><ArrowLeft size={15} />Các hướng chuyên sâu</Link>
    <header className="specialization-hero"><div><p className="specialization-kicker">{track.technologies.join(" · ")}</p><h1>{track.title}</h1><p className="specialization-outcome">{track.outcome}</p></div>{resume && <Link className="button button-primary" href={`/bai-hoc/${resume.id}`} prefetch={false}>{done === ordered.length ? "Ôn lại" : done ? "Học tiếp" : "Bắt đầu học"}<ArrowRight size={16} /></Link>}</header>
    <div className="specialization-meta"><span>{ordered.length} bài học</span><span>{Math.round(ordered.reduce((sum, lesson) => sum + lesson.duration, 0) / 60 * 10) / 10} giờ học</span><span>1 dự án tổng hợp</span>{done > 0 && <span>{done}/{ordered.length} hoàn thành</span>}</div>
    <AnimatedDisclosure className="specialization-prerequisites" title={<><span>Kiến thức cần có</span><ChevronDown size={16} /></>}><ul>{track.prerequisites.map(item => <li key={item}>{item}</li>)}</ul></AnimatedDisclosure>
    <section className="specialization-syllabus" aria-labelledby="specialization-syllabus-title"><h2 id="specialization-syllabus-title">Lộ trình học</h2><ol>{ordered.map((lesson, index) => <li key={lesson.id}><Link href={`/bai-hoc/${lesson.id}`} prefetch={false}><span className="specialization-lesson-number">{progress.completed.includes(lesson.id) ? <Check size={16} aria-label="Đã hoàn thành" /> : String(index + 1).padStart(2, "0")}</span><div><h3>{lesson.title}</h3><p>{lesson.description}</p></div><span className="specialization-duration">{lesson.duration} phút</span><ArrowRight size={16} /></Link></li>)}</ol></section>
    <section className="specialization-capstone" aria-labelledby="capstone-title"><div className="specialization-section-title"><span>Dự án cuối lộ trình</span><h2 id="capstone-title">{track.capstone.title}</h2><p>{track.capstone.description}</p></div>
      <div className="specialization-milestones">{track.capstone.milestones.map((milestone, index) => <AnimatedDisclosure key={milestone.title} className="specialization-milestone" title={<><span className="specialization-lesson-number">{index + 1}</span><span>{milestone.title}</span><ChevronDown size={16} /></>}><div className="specialization-milestone-body"><ul>{milestone.tasks.map(task => <li key={task}>{task}</li>)}</ul><p><strong>Hoàn thành khi: </strong>{milestone.acceptance}</p></div></AnimatedDisclosure>)}</div>
      <div className="specialization-capstone-review"><div><h3>Sản phẩm cần bàn giao</h3><ul>{track.capstone.deliverables.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3>Giải thích thiết kế</h3><ul>{track.capstone.reviewQuestions.map(item => <li key={item}>{item}</li>)}</ul></div></div>
    </section>
    <section className="specialization-resources"><h2>Tài liệu để học tiếp</h2><ul>{track.resources.map(resource => <li key={resource.url}><a href={resource.url} target="_blank" rel="noreferrer">{resource.label}<span aria-hidden="true"> ↗</span></a></li>)}</ul></section>
  </section>;
}
