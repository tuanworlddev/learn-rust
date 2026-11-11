"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Search, X } from "lucide-react";
import { projects } from "@/src/data/projects";
import { useCourse } from "./course-context";
import type { Progress } from "./learning-shared";

import "./specialization-views.css";
import "./course-learning.css";

export function CourseProjectsIndex({ progress }: { progress: Progress }) {
  const { specializations } = useCourse();
  const [query, setQuery] = useState("");
  const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const q = normalize(query.trim());
  const foundation = projects.filter(project => normalize(project.title + " " + project.description).includes(q));
  const groups = specializations.map(track => ({ track, projects: track.projects.filter(project => normalize(track.title + " " + project.title + " " + project.description).includes(q)) })).filter(group => group.projects.length > 0);
  const total = foundation.length + groups.reduce((sum, group) => sum + group.projects.length, 0);
  return <section className="specializations-index">
    <header className="course-catalog-heading"><div><h1>Dự án thực hành</h1><p>Áp dụng kiến thức vào sản phẩm, kiểm thử và giải thích thiết kế.</p></div></header>
    <div className="specializations-toolbar"><label className="course-search"><Search size={16} /><input aria-label="Tìm dự án" placeholder="Tìm dự án hoặc lĩnh vực…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => setQuery("")}><X size={15} /></button>}</label><span role="status">{total} dự án</span></div>
    {foundation.length > 0 && <section><h2 className="course-group-title">Kiến thức nền tảng</h2><div className="course-project-grid">{foundation.map(project => <Link key={project.id} className="course-project-card" href={"/du-an/" + project.id} prefetch={false}><span>Thực hành trên web</span><h3>{project.title}</h3><p>{project.description}</p><footer><span>Mã Rust · Kiểm thử</span>{progress.finishedProjects.includes(project.id) ? <Check size={16} /> : <ArrowRight size={16} />}</footer></Link>)}</div></section>}
    {groups.map(({ track, projects: items }) => <section key={track.id}><h2 className="course-group-title"><Link href={"/khoa-hoc/" + track.id}>{track.title}</Link></h2><div className="course-project-grid">{items.map(project => <Link key={project.id} className="course-project-card" href={"/du-an/" + project.id} prefetch={false}><span>{project.level === "guided" ? "Có hướng dẫn" : project.level === "independent" ? "Tự triển khai" : "Dự án cuối khóa"}</span><h3>{project.title}</h3><p>{project.description}</p><footer><span>{project.estimatedHours} giờ thực hành</span>{progress.finishedProjects.includes(project.completionKey) ? <Check size={16} /> : <ArrowRight size={16} />}</footer></Link>)}</div></section>)}
    {total === 0 && <p className="specializations-empty">Chưa có dự án phù hợp với từ khóa này.</p>}
  </section>;
}
