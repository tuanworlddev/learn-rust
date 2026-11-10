"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {routeHref} from "@/lib/routes";
import AccountSettings from "./account-settings";
import {ArrowUpRight, BookOpen, Check, ChevronDown, CircleCheck, Download, ExternalLink, Menu, Moon, Search, Settings2, Sun, X} from "lucide-react";
import {useCourse} from "./course-context";
import type {LessonSummary} from "@/lib/course-types";
import {SpecializationsView, SpecializationView} from "./specialization-views";
import {projects} from "@/src/data/projects";
import {Brand,EmptyState,initialProgress,navItems,todayKey,type Progress} from "./learning-shared";
import {Roadmap} from "./learning-dashboard";
import {LessonView,Notebook,Playground,ProjectsView,ProjectWorkspace} from "./learning-views";
import CareerHub from "./career-hub";

const STORE="rustviet-learning-v1";
const normalize=(s:string)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d");
const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
function readProgress(value: unknown): Progress {
 if (!isRecord(value)) return {...initialProgress};
 // Publication and rollback may temporarily hide lessons. Preserve their progress.
 const validId = (id: unknown): id is string => typeof id === "string" && /^[a-z0-9][a-z0-9_-]{0,99}$/.test(id);
 const validIds = (items: unknown): string[] => {
  if (!Array.isArray(items)) return [];
  if (items.length > 1000) throw new Error("Progress contains too many IDs");
  return [...new Set(items.filter(validId))];
 };
 const minutes: Record<string, number> = {};
 if (isRecord(value.minutes)) for (const [date, amount] of Object.entries(value.minutes)) {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date) || typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) continue;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date) minutes[date] = Math.min(1440, Math.floor(amount));
 }
 const quizzes: Record<string, number> = {};
 if (isRecord(value.quizzes)) {
  const answers = Object.entries(value.quizzes);
  if (answers.length > 1000) throw new Error("Progress contains too many quiz answers");
  for (const [id, answer] of answers) {
   if (validId(id) && typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer <= 20) quizzes[id] = answer;
  }
 }
 return {
  completed: validIds(value.completed), solved: validIds(value.solved), bookmarks: validIds(value.bookmarks), finishedProjects: validIds(value.finishedProjects),
  quizzes, minutes, notes: typeof value.notes === "string" ? value.notes : "", lastLesson: validId(value.lastLesson) ? value.lastLesson : null,
  goal: typeof value.goal === "number" && [15, 30, 45].includes(value.goal) ? value.goal : 30,
 };
}
export default function LearningApp({initialRoute="lo-trinh"}:{initialRoute?:string}){
 const router=useRouter();
 const {lessons,modules,specializations,currentLesson}=useCourse();
 const route=initialRoute;
 const [progress,setProgress]=useState<Progress>(initialProgress);
 const [ready,setReady]=useState(false); const [sidebarOpen,setSidebarOpen]=useState(false);
 const [searchOpen,setSearchOpen]=useState(false); const [query,setQuery]=useState("");
 const [settingsOpen,setSettingsOpen]=useState(false); const [resetConfirm,setResetConfirm]=useState(false);
 const [toast,setToast]=useState("");
 const [progressSaveError,setProgressSaveError]=useState(false);
 const [progressLoadError,setProgressLoadError]=useState(false);
 const [hasStoredProgress,setHasStoredProgress]=useState(false);
 const storedProgressRaw=useRef<string|null>(null);
 const [expandedChapters,setExpandedChapters]=useState<string[]>([modules[0].id]);
 const [theme,setTheme]=useState<"light"|"dark">("light"); const [themeReady,setThemeReady]=useState(false);
 const sidebarRef=useRef<HTMLElement>(null);
 const searchRef=useRef<HTMLInputElement>(null); const modalReturnFocus=useRef<HTMLElement|null>(null); const searchDialogRef=useRef<HTMLElement>(null); const settingsDialogRef=useRef<HTMLElement>(null); const mainRef=useRef<HTMLElement>(null); const lastActive=useRef(0);
 useEffect(()=>{
  try {
   const raw=localStorage.getItem(STORE);storedProgressRaw.current=raw;
   // Restore browser-owned progress after SSR; preserve the exact raw data if parsing fails.
   // eslint-disable-next-line react-hooks/set-state-in-effect
   setHasStoredProgress(raw!==null);
   if(raw!==null){const saved:unknown=JSON.parse(raw);if(!isRecord(saved))throw new Error("Invalid progress");setProgress(readProgress(saved));}
  }catch{setProgressLoadError(true);}
  setReady(true);
 },[]);
 useEffect(()=>{
  const migrateHash=()=>{
   try {
    const legacy=decodeURIComponent(location.hash.slice(1));
    if (["lo-trinh","tong-quan","di-lam",...navItems.map(item=>item.id)].includes(legacy) ||
        lessons.some(item=>legacy===`bai-hoc/${item.id}`) || projects.some(item=>legacy===`du-an/${item.id}`)) {
     router.replace(routeHref(legacy));
    }
   } catch { /* Keep normal anchors and malformed fragments out of app routing. */ }
  };
  migrateHash();window.addEventListener("hashchange",migrateHash);
  return()=>window.removeEventListener("hashchange",migrateHash);
 },[router,lessons]);
 // Report the outcome of persisting learner state; never overwrite an unreadable snapshot.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{if(ready&&!progressLoadError)try{localStorage.setItem(STORE,JSON.stringify(progress));setProgressSaveError(false);}catch{setProgressSaveError(true);}},[progress,ready,progressLoadError]);
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
 useEffect(()=>{if(lastActive.current===0)lastActive.current=Date.now();const active=()=>{lastActive.current=Date.now();};window.addEventListener("pointerdown",active);window.addEventListener("keydown",active);const t=setInterval(()=>{if(document.visibilityState==="visible"&&Date.now()-lastActive.current<300000&&(route.startsWith("bai-hoc/")||route==="thuc-hanh"||route.startsWith("du-an/")))setProgress(p=>({...p,minutes:{...p.minutes,[todayKey()]:(p.minutes[todayKey()]||0)+1}}));},60000);return()=>{clearInterval(t);window.removeEventListener("pointerdown",active);window.removeEventListener("keydown",active);};},[route]);
 // Read the browser theme only after SSR so server and initial client markup match.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{let saved:string|null=null;try{saved=localStorage.getItem("learn-rust-theme");}catch{}setTheme(saved==="dark"||saved!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");setThemeReady(true);},[]);
 useEffect(()=>{if(!themeReady)return;document.documentElement.dataset.theme=theme;try{localStorage.setItem("learn-rust-theme",theme);}catch{}},[theme,themeReady]);
 useEffect(()=>{const media=window.matchMedia("(min-width: 901px)");const resize=()=>{if(media.matches)setSidebarOpen(false);};media.addEventListener("change",resize);return()=>media.removeEventListener("change",resize);},[]);
 const rememberFocus=()=>{const active=document.activeElement;if(active instanceof HTMLElement&&!active.closest('[role="dialog"]'))modalReturnFocus.current=active;};
 const openSettings=()=>{rememberFocus();setSearchOpen(false);setSettingsOpen(true);setResetConfirm(false);};
 const openSearch=()=>{rememberFocus();setSettingsOpen(false);setSearchOpen(true);};
 const closeNavigation=()=>{setSidebarOpen(false);setSearchOpen(false);setQuery("");};
 const go=(r:string)=>{closeNavigation();router.push(routeHref(r));};
 const visitLesson=(id:string)=>{setProgress(p=>({...p,lastLesson:id}));closeNavigation();};
 const openLesson=(id:string)=>{visitLesson(id);go(`bai-hoc/${id}`);};
 const bookmark=(id:string)=>setProgress(p=>({...p,bookmarks:p.bookmarks.includes(id)?p.bookmarks.filter(x=>x!==id):[...p.bookmarks,id]}));
 const currentProject=projects.find(p=>route===`du-an/${p.id}`);
 const lastLesson=lessons.find(lesson=>lesson.id===progress.lastLesson);
 const resumePath=lessons.filter(lesson=>lastLesson?.moduleId.startsWith("track-")?lesson.moduleId===lastLesson.moduleId:!lesson.moduleId.startsWith("track-"));
 const lastIndex=resumePath.findIndex(lesson=>lesson.id===lastLesson?.id);
 const unfinished=(lesson:LessonSummary)=>!progress.completed.includes(lesson.id);
 const resume=lastLesson&&unfinished(lastLesson)?lastLesson:resumePath.slice(lastIndex+1).find(unfinished)||resumePath.find(unfinished)||resumePath[0]||lessons[0];
 const currentTrack=specializations.find(track=>route===`chuyen-sau/${track.id}`||currentLesson?.moduleId===`track-${track.id}`);
 const visibleModules=modules.filter(module=>currentTrack?module.id===`track-${currentTrack.id}`:!module.id.startsWith("track-"));
 const visibleLessons=lessons.filter(lesson=>visibleModules.some(module=>module.id===lesson.moduleId));
 const activeNav=currentTrack||route==="chuyen-sau"?"chuyen-sau":currentLesson?"lo-trinh":currentProject?"du-an":route;const label=navItems.find(n=>n.id===activeNav)?.label||"Bài học";
 const results=useMemo(()=>lessons.filter(l=>normalize(`${l.title} ${l.description} ${l.objectives.join(" ")}`).includes(normalize(query))).slice(0,10),[query,lessons]);
 const currentModule=modules.find(m=>m.id===currentLesson?.moduleId);
 const pageTitle=currentLesson?.title||currentTrack?.title||currentProject?.title||label;
 useEffect(()=>{
  if(!ready)return;
  const frame=requestAnimationFrame(()=>mainRef.current?.focus({preventScroll:true}));
  return()=>cancelAnimationFrame(frame);
 },[route,ready]);
 // Router changes, including browser navigation, reveal the active lesson in the sidebar.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{if(currentLesson)setExpandedChapters(p=>p.includes(currentLesson.moduleId)?p:[...p,currentLesson.moduleId]);},[currentLesson]);
 // Record direct URL and browser navigation only after saved progress has loaded.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{if(ready&&currentLesson)setProgress(p=>p.lastLesson===currentLesson.id?p:{...p,lastLesson:currentLesson.id});},[ready,currentLesson]);
 const exportProgress=()=>{const u=URL.createObjectURL(new Blob([progressLoadError&&storedProgressRaw.current!==null?storedProgressRaw.current:JSON.stringify(progress,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=u;a.download="learn-rust-progress.json";a.click();URL.revokeObjectURL(u);};
 return <div className="app-shell">
  <a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();mainRef.current?.focus();}}>Đến nội dung chính</a>
  <header className="topbar" inert={searchOpen||settingsOpen||sidebarOpen}>
   <div className="flex min-w-0 items-center gap-3">
    <button className="icon-button mobile-menu" aria-label="Mở mục lục" aria-expanded={sidebarOpen} aria-controls="learning-sidebar" onClick={()=>{rememberFocus();setSidebarOpen(true);}}><Menu size={20}/></button>
    <Link href="/" className="brand-button" aria-label="Learn Rust — Lộ trình" onNavigate={closeNavigation}><Brand/></Link>
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
   <nav className="primary-nav" aria-label="Điều hướng chính">{navItems.map(({id,label,icon:Icon})=><Link key={id} href={routeHref(id)} prefetch={false} aria-current={activeNav===id&&!currentLesson?"page":undefined} className={`nav-item ${activeNav===id?"active":""}`} onNavigate={closeNavigation}><Icon size={17} strokeWidth={1.7}/><span>{label}</span></Link>)}</nav>
   <div className="sidebar-course-label">{currentTrack?<Link href="/chuyen-sau" onNavigate={closeNavigation}>← Các hướng chuyên sâu</Link>:"Mục lục"}</div>
   <nav className="chapter-nav" aria-label="Các chương Rust">{visibleModules.map((module,index)=>{const isOpen=expandedChapters.includes(module.id);const items=lessons.filter(l=>l.moduleId===module.id);return <div className="sidebar-chapter" key={module.id}>
    <button className={`chapter-trigger ${currentModule?.id===module.id?"chapter-current":""}`} aria-expanded={isOpen} aria-controls={`sidebar-${module.id}`} onClick={()=>setExpandedChapters(p=>isOpen?p.filter(id=>id!==module.id):[...p,module.id])}><span className="chapter-number">{String(index+1).padStart(2,"0")}</span><span>{module.title}</span><ChevronDown size={14} className={`transition-transform duration-200 ${isOpen?"rotate-180":""}`}/></button>
    <div id={`sidebar-${module.id}`} className={`chapter-collapse ${isOpen?"is-open":""}`} inert={!isOpen} aria-hidden={!isOpen}><div>{items.map((lesson,i)=><Link key={lesson.id} href={routeHref(`bai-hoc/${lesson.id}`)} prefetch={false} className={`chapter-lesson ${currentLesson?.id===lesson.id?"active":""}`} aria-current={currentLesson?.id===lesson.id?"page":undefined} onNavigate={()=>visitLesson(lesson.id)}><span>{progress.completed.includes(lesson.id)?<Check size={13}/>: `${index+1}.${i+1}`}</span><span>{lesson.title}</span></Link>)}</div></div>
   </div>;})}</nav>
   <div className="sidebar-bottom"><span>{visibleLessons.filter(lesson=>progress.completed.includes(lesson.id)).length}/{visibleLessons.length} bài hoàn thành</span><a href="https://doc.rust-lang.org/book/" target="_blank" rel="noreferrer" aria-label="The Rust Book — tài liệu chính thức" title="The Rust Book"><ExternalLink size={15}/></a></div>
  </aside>
  <div className="app-main" inert={searchOpen||settingsOpen||sidebarOpen}>
   {(progressSaveError||progressLoadError)&&<div className="progress-save-warning" role="alert"><span>{progressLoadError?"Chưa đọc được tiến độ đã lưu. Dữ liệu cũ vẫn được giữ.":"Chưa lưu được tiến độ và ghi chú. Hãy tải bản sao trước khi đóng trang."}</span>{(!progressLoadError||hasStoredProgress)&&<button className="button button-secondary" onClick={exportProgress}><Download size={15}/>Tải bản sao</button>}{progressLoadError&&<button className="button button-secondary" onClick={()=>window.location.reload()}>Tải lại trang</button>}</div>}
   <main key={route} id="main-content" ref={mainRef} tabIndex={-1} aria-label={pageTitle} className={`page-content motion-safe:animate-[page-in_180ms_ease-out_both] ${currentLesson||currentProject?"page-content-learning":""}`}>
    {route==="lo-trinh"&&<Roadmap progress={progress} resume={resume} initialModule={null} onLesson={openLesson} onVisit={visitLesson} onBookmark={bookmark}/>}
    {currentLesson&&<LessonView key={currentLesson.id} lesson={currentLesson} progress={progress} onBookmark={()=>bookmark(currentLesson.id)} onQuiz={answer=>setProgress(p=>({...p,quizzes:{...p.quizzes,[currentLesson.id]:answer}}))} onPass={()=>{setProgress(p=>({...p,solved:[...new Set([...p.solved,currentLesson.id])]}));}} onComplete={()=>{setProgress(p=>({...p,completed:[...new Set([...p.completed,currentLesson.id])]}));setToast("Đã hoàn thành bài học.");}} onNavigate={openLesson} onBack={()=>go(currentTrack?`chuyen-sau/${currentTrack.id}`:"lo-trinh")}/>}
    {route==="chuyen-sau"&&<SpecializationsView progress={progress}/>}
    {route.startsWith("chuyen-sau/")&&currentTrack&&<SpecializationView track={currentTrack} progress={progress}/>}
    {route==="thuc-hanh"&&<Playground go={go}/>}
    {route==="phong-van"&&<CareerHub/>}
    {route==="du-an"&&<ProjectsView progress={progress} go={go}/>}
    {currentProject&&<ProjectWorkspace project={currentProject} progress={progress} go={go} onPass={()=>{setProgress(p=>({...p,finishedProjects:[...new Set([...p.finishedProjects,currentProject.id])]}));}}/>}
    {route==="so-tay"&&<Notebook progress={progress} onLesson={openLesson} onBookmark={bookmark} onNotes={notes=>setProgress(p=>({...p,notes}))}/>}
    {!navItems.some(n=>n.id===route)&&!currentLesson&&!currentProject&&!currentTrack&&<EmptyState title="Không tìm thấy bài học"><button className="text-link" onClick={()=>go("lo-trinh")}>Mở lộ trình</button></EmptyState>}
   </main>
  </div>
  {searchOpen&&<div className="modal-backdrop" onClick={()=>setSearchOpen(false)}><section ref={searchDialogRef} tabIndex={-1} className="search-modal" role="dialog" aria-modal="true" aria-label="Tìm kiếm bài học" onClick={e=>e.stopPropagation()}><div className="search-modal-input"><Search size={20}/><input ref={searchRef} aria-label="Tìm bài học hoặc chủ đề Rust" placeholder="Tìm bài học hoặc chủ đề…" value={query} onChange={e=>setQuery(e.target.value)}/><button className="icon-button" onClick={()=>setSearchOpen(false)} aria-label="Đóng tìm kiếm"><X size={18}/></button></div><div className="search-results">{results.map(l=><button key={l.id} onClick={()=>openLesson(l.id)}><BookOpen size={17}/><span><strong>{l.title}</strong><small>{modules.find(m=>m.id===l.moduleId)?.title}</small></span><ArrowUpRight size={16}/></button>)}{!results.length&&<EmptyState title="Không có kết quả">Thử một từ khóa khác.</EmptyState>}</div></section></div>}
  {settingsOpen&&<div className="modal-backdrop" onClick={()=>setSettingsOpen(false)}><section ref={settingsDialogRef} tabIndex={-1} className="settings-modal card" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={e=>e.stopPropagation()}><div className="card-heading"><h2 id="settings-title">Cài đặt</h2><button className="icon-button" aria-label="Đóng cài đặt" onClick={()=>setSettingsOpen(false)}><X size={19}/></button></div><AccountSettings getSnapshot={()=>progress} onRestore={snapshot=>{setProgress(readProgress(snapshot));setProgressLoadError(false);storedProgressRaw.current=null;}}/><button className="button button-secondary full-width" onClick={exportProgress}><Download size={16}/>Tải tiến độ</button><div className="settings-reset">{resetConfirm?<><p>Xóa tiến độ, bài đã lưu và ghi chú? Bản nháp mã vẫn được giữ.</p><div className="flex justify-end gap-2"><button className="button button-secondary" onClick={()=>setResetConfirm(false)}>Hủy</button><button className="button button-danger" onClick={()=>{setProgress(initialProgress);setProgressLoadError(false);storedProgressRaw.current=null;setResetConfirm(false);setToast("Đã đặt lại tiến độ.");}}>Xóa tiến độ</button></div></>:<button className="danger-link" onClick={()=>setResetConfirm(true)}>Đặt lại tiến độ</button>}</div></section></div>}
  {toast&&<div className="toast" role="status"><CircleCheck size={18}/>{toast}<button aria-label="Đóng thông báo" onClick={()=>setToast("")}><X size={15}/></button></div>}
 </div>;
}
