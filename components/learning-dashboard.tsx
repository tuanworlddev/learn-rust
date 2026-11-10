"use client";
import {useEffect,useState} from "react";
import {ArrowRight,Bookmark,Check,ChevronDown,Search,X} from "lucide-react";
import {modules,lessons,type Lesson} from "@/src/data/curriculum";
import {EmptyState,PageHeading,type Progress} from "./learning-shared";

const normalize=(s:string)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d");

export function Roadmap({progress,resume,initialModule,onLesson,onBookmark}:{progress:Progress;resume:Lesson;initialModule:string|null;onLesson:(id:string)=>void;onBookmark:(id:string)=>void}){
 const [query,setQuery]=useState("");
 const [expanded,setExpanded]=useState<string[]>(modules.map(m=>m.id));
 useEffect(()=>{if(initialModule){setExpanded(p=>p.includes(initialModule)?p:[...p,initialModule]);document.getElementById(`module-${initialModule}`)?.scrollIntoView({behavior:"smooth",block:"start"});}},[initialModule]);
 const q=normalize(query.trim());
 const visible=modules.map((module,index)=>({module,index,items:lessons.filter(l=>l.moduleId===module.id&&(!q||normalize(`${module.title} ${l.title} ${l.description} ${l.objectives.join(" ")}`).includes(q)))})).filter(m=>m.items.length);
 const count=visible.reduce((n,m)=>n+m.items.length,0);
 const allOpen=visible.every(m=>expanded.includes(m.module.id));
 return <section className="course-index">
  <header className="course-header"><PageHeading title="Học Rust" description="Lý thuyết và thực hành, từ cơ bản đến nâng cao."><button className="button button-primary" onClick={()=>onLesson(resume.id)}>{progress.lastLesson?"Học tiếp":"Bắt đầu học"}<ArrowRight size={16}/></button></PageHeading><p className="course-meta">{modules.length} chương · {lessons.length} bài học</p></header>
  <div className="course-toolbar"><label className="course-search"><Search size={16}/><input aria-label="Lọc mục lục" placeholder="Tìm trong mục lục…" value={query} onChange={e=>{setQuery(e.target.value);if(e.target.value.trim())setExpanded(modules.map(m=>m.id));}}/>{query&&<button aria-label="Xóa bộ lọc" onClick={()=>setQuery("")}><X size={15}/></button>}</label><button className="text-link" onClick={()=>setExpanded(allOpen?[]:modules.map(m=>m.id))}>{allOpen?"Thu gọn":"Mở tất cả"}<ChevronDown size={14} className={`transition-transform duration-200 ${allOpen?"rotate-180":""}`}/></button></div>
  {query&&<p className="mb-4 text-sm text-[var(--muted)]" role="status">{count} bài phù hợp</p>}
  <div className="toc-grid">{visible.map(({module,index,items})=>{const isOpen=expanded.includes(module.id);const allItems=lessons.filter(l=>l.moduleId===module.id);return <section className="toc-chapter" key={module.id} id={`module-${module.id}`}>
   <button className="toc-heading" aria-expanded={isOpen} aria-controls={`toc-${module.id}`} onClick={()=>setExpanded(p=>p.includes(module.id)?p.filter(id=>id!==module.id):[...p,module.id])}><span>{String(index+1).padStart(2,"0")}</span><h2>{module.title}</h2><ChevronDown size={15} className={`transition-transform duration-200 ${isOpen?"rotate-180":""}`}/></button>
   <div id={`toc-${module.id}`} className={`toc-collapse ${isOpen?"is-open":""}`} inert={!isOpen} aria-hidden={!isOpen}><div>{items.map(lesson=>{const saved=progress.bookmarks.includes(lesson.id);const done=progress.completed.includes(lesson.id);return <div className="toc-row" key={lesson.id}><button className="toc-link" onClick={()=>onLesson(lesson.id)}><span>{index+1}.{allItems.indexOf(lesson)+1}</span><span>{lesson.title}</span>{done&&<Check size={14} aria-label="Đã hoàn thành"/>}</button><button className={`icon-button toc-bookmark ${saved?"bookmarked":""}`} onClick={()=>onBookmark(lesson.id)} aria-label={saved?`Bỏ lưu ${lesson.title}`:`Lưu ${lesson.title}`}><Bookmark size={14} fill={saved?"currentColor":"none"}/></button></div>;})}</div></div>
  </section>;})}{!visible.length&&<div className="course-empty"><EmptyState title="Không có bài phù hợp">Thử tìm “ownership”, “async” hoặc “Cargo”.</EmptyState></div>}</div>
  <footer className="course-reference"><a href="https://doc.rust-lang.org/book/" target="_blank" rel="noreferrer">The Rust Book ↗</a><a href="https://doc.rust-lang.org/std/" target="_blank" rel="noreferrer">Thư viện chuẩn ↗</a></footer>
 </section>;
}
