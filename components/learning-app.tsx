"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, ChevronRight, CircleCheck, Download, ExternalLink, Menu, Moon, Search, Settings2, Sun, X} from "lucide-react";
import {lessons,modules} from "@/src/data/curriculum";
import {projects} from "@/src/data/projects";
import {Brand,EmptyState,initialProgress,navItems,todayKey,type Progress} from "./learning-shared";
import {Roadmap} from "./learning-dashboard";
import {LessonView,Notebook,Playground,ProjectsView,ProjectWorkspace} from "./learning-views";
import CareerHub from "./career-hub";

const STORE="rustviet-learning-v1";
const normalize=(s:string)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d");
const lessonIds = new Set(lessons.map(lesson => lesson.id));
const projectIds = new Set(projects.map(project => project.id));
const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
function readProgress(value: unknown): Progress {
 if (!isRecord(value)) return {...initialProgress};
 const validIds = (items: unknown, allowed: Set<string>): string[] => Array.isArray(items) ? [...new Set(items.filter((id): id is string => typeof id === "string" && allowed.has(id)))] : [];
 const minutes: Record<string, number> = {};
 if (isRecord(value.minutes)) for (const [date, amount] of Object.entries(value.minutes)) {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date) || typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) continue;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date) minutes[date] = Math.min(1440, Math.floor(amount));
 }
 const quizzes: Record<string, number> = {};
 if (isRecord(value.quizzes)) for (const [id, answer] of Object.entries(value.quizzes)) {
  const lesson = lessons.find(item => item.id === id);
  if (lesson && typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer < lesson.quiz.options.length) quizzes[id] = answer;
 }
 return {
  completed: validIds(value.completed, lessonIds), solved: validIds(value.solved, lessonIds), bookmarks: validIds(value.bookmarks, lessonIds), finishedProjects: validIds(value.finishedProjects, projectIds),
  quizzes, minutes, notes: typeof value.notes === "string" ? value.notes : "", lastLesson: typeof value.lastLesson === "string" && lessonIds.has(value.lastLesson) ? value.lastLesson : null,
  goal: typeof value.goal === "number" && [15, 30, 45].includes(value.goal) ? value.goal : 30,
 };
}
export default function LearningApp(){
 const [route,setRoute]=useState("lo-trinh"); const [progress,setProgress]=useState<Progress>(initialProgress);
 const [ready,setReady]=useState(false); const [sidebarOpen,setSidebarOpen]=useState(false);
 const [searchOpen,setSearchOpen]=useState(false); const [query,setQuery]=useState("");
 const [settingsOpen,setSettingsOpen]=useState(false); const [resetConfirm,setResetConfirm]=useState(false);
 const [toast,setToast]=useState("");
 const [progressSaveError,setProgressSaveError]=useState(false);
 const [expandedChapters,setExpandedChapters]=useState<string[]>([modules[0].id]);
 const [theme,setTheme]=useState<"light"|"dark">("light"); const [themeReady,setThemeReady]=useState(false);
 const sidebarRef=useRef<HTMLElement>(null);
 const previousRoute=useRef<string|null>(null);
 const searchRef=useRef<HTMLInputElement>(null); const modalReturnFocus=useRef<HTMLElement|null>(null); const searchDialogRef=useRef<HTMLElement>(null); const settingsDialogRef=useRef<HTMLElement>(null); const mainRef=useRef<HTMLElement>(null); const lastActive=useRef(Date.now());
 useEffect(()=>{try{setProgress(readProgress(JSON.parse(localStorage.getItem(STORE)||"null")));}catch{}
  const sync=()=>{try{const hash=decodeURIComponent(location.hash.slice(1));setRoute(!hash||hash==="tong-quan"?"lo-trinh":hash);}catch{setRoute("lo-trinh");}setSidebarOpen(false);window.scrollTo({top:0});};sync();setReady(true);window.addEventListener("hashchange",sync);return()=>window.removeEventListener("hashchange",sync);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(STORE,JSON.stringify(progress));setProgressSaveError(false);}catch{setProgressSaveError(true);}},[progress,ready]);
 useEffect(()=>{const handler=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();const active=document.activeElement;if(active instanceof HTMLElement&&!active.closest('[role="dialog"]'))modalReturnFocus.current=active;setSettingsOpen(false);setSearchOpen(v=>!v);}if(e.key==="Escape"){setSearchOpen(false);setSettingsOpen(false);setSidebarOpen(false);}};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);},[]);
 useEffect(()=>{
  const dialog = searchOpen ? searchDialogRef.current : settingsOpen ? settingsDialogRef.current : sidebarOpen ? sidebarRef.current : null;
  if (!dialog) return;
  const previousFocus = modalReturnFocus.current || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(element => element.getClientRects().length > 0);
  const focusFirst = () => (searchOpen && searchRef.current ? searchRef.current : focusable()[0] || dialog).focus();
  const frame = requestAnimationFrame(focusFirst);
  const trapTab = (event: KeyboardEvent) => {
   if (event.key !== "Tab") return;
   const elements = focusable();
   if (!elements.length) { event.preventDefault(); dialog.focus(); return; }
   const first = elements[0]; const last = elements[elements.length - 1];
   const active = document.activeElement;
   if (event.shiftKey && (active === first || !dialog.contains(active))) { event.preventDefault(); last.focus(); }
   else if (!event.shiftKey && (active === last || !dialog.contains(active))) { event.preventDefault(); first.focus(); }
  };
  const containFocus = (event: FocusEvent) => { if (event.target instanceof Node && !dialog.contains(event.target)) focusFirst(); };
  document.addEventListener("keydown", trapTab);
  document.addEventListener("focusin", containFocus);
  return () => {
   cancelAnimationFrame(frame);
   document.removeEventListener("keydown", trapTab);
   document.removeEventListener("focusin", containFocus);
   document.body.style.overflow = previousOverflow;
   if (previousFocus?.isConnected) previousFocus.focus();
  };
 },[searchOpen,settingsOpen,sidebarOpen]);
 useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(""),4200);return()=>clearTimeout(t);}},[toast]);
 useEffect(()=>{const active=()=>{lastActive.current=Date.now();};window.addEventListener("pointerdown",active);window.addEventListener("keydown",active);const t=setInterval(()=>{if(document.visibilityState==="visible"&&Date.now()-lastActive.current<300000&&(route.startsWith("bai-hoc/")||route==="thuc-hanh"||route.startsWith("du-an/")))setProgress(p=>({...p,minutes:{...p.minutes,[todayKey()]:(p.minutes[todayKey()]||0)+1}}));},60000);return()=>{clearInterval(t);window.removeEventListener("pointerdown",active);window.removeEventListener("keydown",active);};},[route]);
 useEffect(()=>{let saved:string|null=null;try{saved=localStorage.getItem("learn-rust-theme");}catch{}setTheme(saved==="dark"||saved!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");setThemeReady(true);},[]);
 useEffect(()=>{if(!themeReady)return;document.documentElement.dataset.theme=theme;try{localStorage.setItem("learn-rust-theme",theme);}catch{}},[theme,themeReady]);
 useEffect(()=>{const media=window.matchMedia("(min-width: 901px)");const resize=()=>{if(media.matches)setSidebarOpen(false);};media.addEventListener("change",resize);return()=>media.removeEventListener("change",resize);},[]);
 const rememberFocus=()=>{const active=document.activeElement;if(active instanceof HTMLElement&&!active.closest('[role="dialog"]'))modalReturnFocus.current=active;};
 const openSettings=()=>{rememberFocus();setSearchOpen(false);setSettingsOpen(true);setResetConfirm(false);};
 const openSearch=()=>{rememberFocus();setSettingsOpen(false);setSearchOpen(true);};
 const go=(r:string)=>{setSidebarOpen(false);setSearchOpen(false);setQuery("");location.hash=r;};
 const openLesson=(id:string)=>{setProgress(p=>({...p,lastLesson:id}));go(`bai-hoc/${id}`);};
 const bookmark=(id:string)=>setProgress(p=>({...p,bookmarks:p.bookmarks.includes(id)?p.bookmarks.filter(x=>x!==id):[...p.bookmarks,id]}));
 const currentLesson=lessons.find(l=>route===`bai-hoc/${l.id}`);const currentProject=projects.find(p=>route===`du-an/${p.id}`);
 const next=lessons.find(l=>!progress.completed.includes(l.id))||lessons[0];const resume=lessons.find(l=>l.id===progress.lastLesson&&!progress.completed.includes(l.id))||next;
 const activeNav=currentLesson?"lo-trinh":currentProject?"du-an":route;const label=navItems.find(n=>n.id===activeNav)?.label||"Bài học";
 const results=useMemo(()=>lessons.filter(l=>normalize(`${l.title} ${l.description} ${l.objectives.join(" ")}`).includes(normalize(query))).slice(0,10),[query]);
 const currentModule=modules.find(m=>m.id===currentLesson?.moduleId);
 const pageTitle=currentLesson?.title||currentProject?.title||label;
 useEffect(()=>{
  if(!ready)return;
  document.title=`${pageTitle} · Learn Rust`;
  const changed=previousRoute.current!==null&&previousRoute.current!==route;
  previousRoute.current=route;
  if(changed){const frame=requestAnimationFrame(()=>mainRef.current?.focus({preventScroll:true}));return()=>cancelAnimationFrame(frame);}
 },[route,ready,pageTitle]);
 useEffect(()=>{if(currentLesson)setExpandedChapters(p=>p.includes(currentLesson.moduleId)?p:[...p,currentLesson.moduleId]);},[currentLesson]);
 const exportProgress=()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(progress,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=u;a.download="learn-rust-progress.json";a.click();URL.revokeObjectURL(u);};
 return <div className="app-shell">
  <a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();mainRef.current?.focus();}}>Đến nội dung chính</a>
  <header className="topbar" inert={searchOpen||settingsOpen||sidebarOpen}>
   <div className="flex min-w-0 items-center gap-3">
    <button className="icon-button mobile-menu" aria-label="Mở mục lục" aria-expanded={sidebarOpen} aria-controls="learning-sidebar" onClick={()=>{rememberFocus();setSidebarOpen(true);}}><Menu size={20}/></button>
    <button className="brand-button" aria-label="Learn Rust — Lộ trình" onClick={()=>go("lo-trinh")}><Brand/></button>
    <span className="topbar-divider"/>
    <span className="topbar-context">{currentModule?.title||label}</span>
   </div>
   <div className="flex shrink-0 items-center gap-1 sm:gap-2">
    <button className="search-trigger" aria-label="Tìm kiếm bài học" onClick={openSearch}><Search size={17}/><span>Tìm kiếm</span><kbd>⌘ K</kbd></button>
    <button className="icon-button theme-toggle" aria-label={theme==="dark"?"Chuyển sang giao diện sáng":"Chuyển sang giao diện tối"} title={theme==="dark"?"Giao diện sáng":"Giao diện tối"} onClick={()=>setTheme(theme==="dark"?"light":"dark")}>{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button>
    <button className="icon-button" aria-label="Cài đặt" title="Cài đặt" onClick={openSettings}><Settings2 size={18}/></button>
   </div>
  </header>
  {sidebarOpen&&<button className="sidebar-scrim" aria-label="Đóng mục lục" onClick={()=>setSidebarOpen(false)}/>}
  <aside id="learning-sidebar" ref={sidebarRef} tabIndex={-1} role={sidebarOpen?"dialog":undefined} aria-modal={sidebarOpen?true:undefined} aria-label="Mục lục khóa học" inert={searchOpen||settingsOpen} className={`sidebar ${sidebarOpen?"sidebar-open":""}`}>
   <div className="sidebar-mobile-heading"><Brand/><button className="icon-button" aria-label="Đóng mục lục" onClick={()=>setSidebarOpen(false)}><X size={20}/></button></div>
   <nav className="primary-nav" aria-label="Điều hướng chính">{navItems.map(({id,label,icon:Icon})=><button key={id} aria-current={activeNav===id&&!currentLesson?"page":undefined} className={`nav-item ${activeNav===id?"active":""}`} onClick={()=>go(id)}><Icon size={17} strokeWidth={1.7}/><span>{label}</span></button>)}</nav>
   <div className="sidebar-course-label">Mục lục</div>
   <nav className="chapter-nav" aria-label="Các chương Rust">{modules.map((module,index)=>{const isOpen=expandedChapters.includes(module.id);const items=lessons.filter(l=>l.moduleId===module.id);return <div className="sidebar-chapter" key={module.id}>
    <button className={`chapter-trigger ${currentModule?.id===module.id?"chapter-current":""}`} aria-expanded={isOpen} aria-controls={`sidebar-${module.id}`} onClick={()=>setExpandedChapters(p=>isOpen?p.filter(id=>id!==module.id):[...p,module.id])}><span className="chapter-number">{String(index+1).padStart(2,"0")}</span><span>{module.title}</span><ChevronDown size={14} className={`transition-transform duration-200 ${isOpen?"rotate-180":""}`}/></button>
    <div id={`sidebar-${module.id}`} className={`chapter-collapse ${isOpen?"is-open":""}`} inert={!isOpen} aria-hidden={!isOpen}><div>{items.map((lesson,i)=><button key={lesson.id} className={`chapter-lesson ${currentLesson?.id===lesson.id?"active":""}`} aria-current={currentLesson?.id===lesson.id?"page":undefined} onClick={()=>openLesson(lesson.id)}><span>{progress.completed.includes(lesson.id)?<Check size={13}/>: `${index+1}.${i+1}`}</span><span>{lesson.title}</span></button>)}</div></div>
   </div>;})}</nav>
   <div className="sidebar-bottom"><span>{progress.completed.length}/{lessons.length} bài hoàn thành</span><a href="https://doc.rust-lang.org/book/" target="_blank" rel="noreferrer" aria-label="The Rust Book — tài liệu chính thức" title="The Rust Book"><ExternalLink size={15}/></a></div>
  </aside>
  <div className="app-main" inert={searchOpen||settingsOpen||sidebarOpen}>
   {progressSaveError&&<div className="progress-save-warning" role="alert"><span>Chưa lưu được tiến độ và ghi chú. Hãy tải bản sao trước khi đóng trang.</span><button className="button button-secondary" onClick={exportProgress}><Download size={15}/>Tải bản sao</button></div>}
   <main key={route} id="main-content" ref={mainRef} tabIndex={-1} aria-label={pageTitle} className={`page-content motion-safe:animate-[page-in_180ms_ease-out_both] ${currentLesson||currentProject?"page-content-learning":""}`}>
    {route==="lo-trinh"&&<Roadmap progress={progress} resume={resume} initialModule={null} onLesson={openLesson} onBookmark={bookmark}/>}
    {currentLesson&&<LessonView key={currentLesson.id} lesson={currentLesson} progress={progress} onBookmark={()=>bookmark(currentLesson.id)} onQuiz={answer=>setProgress(p=>({...p,quizzes:{...p.quizzes,[currentLesson.id]:answer}}))} onPass={()=>{setProgress(p=>({...p,solved:[...new Set([...p.solved,currentLesson.id])]}));setToast("Bài thực hành đã qua kiểm tra kết quả mẫu.");}} onComplete={()=>{setProgress(p=>({...p,completed:[...new Set([...p.completed,currentLesson.id])]}));setToast("Đã hoàn thành bài học.");}} onNavigate={openLesson} onBack={()=>go("lo-trinh")}/>}
    {route==="thuc-hanh"&&<Playground go={go}/>}
    {route==="di-lam"&&<CareerHub/>}
    {route==="du-an"&&<ProjectsView progress={progress} go={go}/>}
    {currentProject&&<ProjectWorkspace project={currentProject} progress={progress} go={go} onPass={()=>{setProgress(p=>({...p,finishedProjects:[...new Set([...p.finishedProjects,currentProject.id])]}));setToast("Dự án đã qua kiểm tra kết quả mẫu.");}}/>}
    {route==="so-tay"&&<Notebook progress={progress} onLesson={openLesson} onBookmark={bookmark} onNotes={notes=>setProgress(p=>({...p,notes}))}/>}
    {!navItems.some(n=>n.id===route)&&!currentLesson&&!currentProject&&<EmptyState title="Không tìm thấy bài học"><button className="text-link" onClick={()=>go("lo-trinh")}>Mở lộ trình</button></EmptyState>}
   </main>
  </div>
  {searchOpen&&<div className="modal-backdrop" onClick={()=>setSearchOpen(false)}><section ref={searchDialogRef} tabIndex={-1} className="search-modal" role="dialog" aria-modal="true" aria-label="Tìm kiếm bài học" onClick={e=>e.stopPropagation()}><div className="search-modal-input"><Search size={20}/><input ref={searchRef} aria-label="Tìm bài học hoặc chủ đề Rust" placeholder="Tìm bài học hoặc chủ đề…" value={query} onChange={e=>setQuery(e.target.value)}/><button className="icon-button" onClick={()=>setSearchOpen(false)} aria-label="Đóng tìm kiếm"><X size={18}/></button></div><div className="search-results">{results.map(l=><button key={l.id} onClick={()=>openLesson(l.id)}><BookOpen size={17}/><span><strong>{l.title}</strong><small>{modules.find(m=>m.id===l.moduleId)?.title}</small></span><ArrowUpRight size={16}/></button>)}{!results.length&&<EmptyState title="Không có kết quả">Thử một từ khóa khác.</EmptyState>}</div><div className="search-modal-footer"><span>Tìm theo tên bài hoặc khái niệm</span><kbd>Esc</kbd></div></section></div>}
  {settingsOpen&&<div className="modal-backdrop" onClick={()=>setSettingsOpen(false)}><section ref={settingsDialogRef} tabIndex={-1} className="settings-modal card" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={e=>e.stopPropagation()}><div className="card-heading"><h2 id="settings-title">Cài đặt</h2><button className="icon-button" aria-label="Đóng cài đặt" onClick={()=>setSettingsOpen(false)}><X size={19}/></button></div><p>Tiến độ, bản nháp và ghi chú được lưu trên trình duyệt này.</p><button className="button button-secondary full-width" onClick={exportProgress}><Download size={16}/>Tải tiến độ</button><div className="settings-reset">{resetConfirm?<><p>Xóa tiến độ, bài đã lưu và ghi chú? Bản nháp mã vẫn được giữ.</p><div className="flex justify-end gap-2"><button className="button button-secondary" onClick={()=>setResetConfirm(false)}>Hủy</button><button className="button button-danger" onClick={()=>{setProgress(initialProgress);setResetConfirm(false);setToast("Đã đặt lại tiến độ.");}}>Xóa tiến độ</button></div></>:<button className="danger-link" onClick={()=>setResetConfirm(true)}>Đặt lại tiến độ</button>}</div></section></div>}
  {toast&&<div className="toast" role="status"><CircleCheck size={18}/>{toast}<button aria-label="Đóng thông báo" onClick={()=>setToast("")}><X size={15}/></button></div>}
 </div>;
}
