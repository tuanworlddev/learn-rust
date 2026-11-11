"use client";
import {useCallback,useEffect,useMemo,useRef,useState,type ReactNode} from "react";
import Link from "next/link";
import {usePathname,useRouter} from "next/navigation";
import dynamic from "next/dynamic";
import {routeHref} from "@/lib/routes";
import {ArrowUpRight, BookOpen, Check, ChevronDown, CircleCheck, Download, Menu, Moon, Search, Settings2, Sun, X} from "lucide-react";
import {useCourseNavigation} from "./course-context";
import {LearningStateContext} from "./learning-state";
import {Brand,EmptyState,initialProgress,navItems,todayKey,type Progress} from "./learning-shared";

const AccountSettings = dynamic(() => import("./account-settings"));

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
export default function LearningApp({children}:{children:ReactNode}){
 const router=useRouter();
 const pathname=usePathname();
 const {lessons,modules,specializations,foundationProjects}=useCourseNavigation();
 const route=pathname==="/"? "lo-trinh":pathname.replace(/^\/|\/$/g,"");
 const lessonsById=useMemo(()=>new Map(lessons.map(lesson=>[lesson.id,lesson])),[lessons]);
 const currentLesson=route.startsWith("bai-hoc/")?lessonsById.get(route.slice(8)):undefined;
 const currentTrack=specializations.find(track=>currentLesson?track.lessonIds.includes(currentLesson.id):
  route==="khoa-hoc/"+track.id||route==="khoa-hoc/"+track.id+"/danh-gia"||track.projects.some(project=>route==="du-an/"+project.id));
 const currentCourseProject=currentTrack?.projects.find(project=>route==="du-an/"+project.id);
 const currentProject=foundationProjects.find(project=>route==="du-an/"+project.id);
 const foundationLessons=useMemo(()=>lessons.filter(lesson=>!lesson.moduleId.startsWith("track-")),[lessons]);
 const isFoundation=route==="khoa-hoc/nen-tang"||Boolean(currentLesson&&!currentLesson.moduleId.startsWith("track-"));
 const foundationChapters=useMemo(()=>modules.filter(item=>!item.id.startsWith("track-")).map(item=>({id:item.id,title:item.title,lessonIds:foundationLessons.filter(lesson=>lesson.moduleId===item.id).map(lesson=>lesson.id)})),[modules,foundationLessons]);
 const sidebarChapters=currentTrack?(currentTrack.chapters??[{id:"track-"+currentTrack.id,title:currentTrack.shortTitle,lessonIds:currentTrack.lessonIds}]):isFoundation?foundationChapters:[];
 const [progress,setProgress]=useState<Progress>(initialProgress);
 const [ready,setReady]=useState(false); const [sidebarOpen,setSidebarOpen]=useState(false);
 const [searchOpen,setSearchOpen]=useState(false); const [query,setQuery]=useState("");
 const [settingsOpen,setSettingsOpen]=useState(false); const [resetConfirm,setResetConfirm]=useState(false);
 const [toast,setToast]=useState("");
 const [progressSaveError,setProgressSaveError]=useState(false);
 const [progressLoadError,setProgressLoadError]=useState(false);
 const [hasStoredProgress,setHasStoredProgress]=useState(false);
 const storedProgressRaw=useRef<string|null>(null);
 const currentChapterId=sidebarChapters.find(chapter=>chapter.lessonIds.includes(currentLesson?.id??progress.lastLesson??""))?.id||sidebarChapters[0]?.id;
 const [expandedChapters,setExpandedChapters]=useState<string[]>(()=>currentChapterId?[currentChapterId]:[]);
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
    if (["lo-trinh","tong-quan","di-lam","chuyen-sau",...navItems.map(item=>item.id)].includes(legacy) ||
        specializations.some(item=>legacy===`chuyen-sau/${item.id}`) || lessons.some(item=>legacy===`bai-hoc/${item.id}`) || foundationProjects.some(item=>legacy===`du-an/${item.id}`)) {
     router.replace(routeHref(legacy));
    }
   } catch { /* Keep normal anchors and malformed fragments out of app routing. */ }
  };
  migrateHash();window.addEventListener("hashchange",migrateHash);
  return()=>window.removeEventListener("hashchange",migrateHash);
 },[router,lessons,specializations,foundationProjects]);
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
 const closeNavigation=useCallback(()=>{setSidebarOpen(false);setSearchOpen(false);setQuery("");},[setSidebarOpen,setSearchOpen,setQuery]);
 const go=useCallback((r:string)=>{closeNavigation();router.push(routeHref(r));},[closeNavigation,router]);
 const visitLesson=useCallback((id:string)=>{setProgress(p=>p.lastLesson===id?p:{...p,lastLesson:id});closeNavigation();},[closeNavigation,setProgress]);
 const openLesson=useCallback((id:string)=>{visitLesson(id);go(`bai-hoc/${id}`);},[visitLesson,go]);
 const bookmark=useCallback((id:string)=>setProgress(p=>({...p,bookmarks:p.bookmarks.includes(id)?p.bookmarks.filter(x=>x!==id):[...p.bookmarks,id]})),[setProgress]);
 const learningState=useMemo(()=>({progress,setProgress,setToast,go,visitLesson,openLesson,bookmark}),[progress,setProgress,setToast,go,visitLesson,openLesson,bookmark]);
 const visibleLessons=currentTrack?currentTrack.lessonIds.flatMap(id=>{const lesson=lessonsById.get(id);return lesson?[lesson]:[];}):isFoundation?foundationLessons:lessons;
 const activeNav=route.startsWith("du-an/")?"du-an":currentTrack||isFoundation||currentLesson?"lo-trinh":route;
 const label=navItems.find(n=>n.id===activeNav)?.label||"Bài học";
 const searchIndex=useMemo(()=>lessons.map(lesson=>({lesson,text:normalize(`${lesson.title} ${lesson.description} ${lesson.objectives.join(" ")}`)})),[lessons]);
 const results=useMemo(()=>searchOpen?searchIndex.filter(item=>item.text.includes(normalize(query))).slice(0,10).map(item=>item.lesson):[],[query,searchOpen,searchIndex]);
 const previousRoute=useRef(route);
 // Browser Back/Forward also closes transient UI now that the shell is persistent.
 useEffect(()=>{if(previousRoute.current===route)return;previousRoute.current=route;closeNavigation();setSettingsOpen(false);},[route,closeNavigation,setSettingsOpen]);
 const currentModule=modules.find(m=>m.id===currentLesson?.moduleId);
 const pageTitle=currentLesson?.title||currentCourseProject?.title||currentProject?.title||(route.endsWith("/danh-gia")?currentTrack?.assessmentTitle:currentTrack?.title)||(isFoundation?"Kiến thức nền tảng":label);
 // Navigation focus waits until modal cleanup has restored its trigger focus.
 // Closing a modal without navigation keeps that normal return-focus behavior.
 const focusAfterNavigation=useRef(true);
 const focusRoute=useRef(route);
 useEffect(()=>{
  if(focusRoute.current!==route){
   focusRoute.current=route;
   focusAfterNavigation.current=true;
  }
  if(!ready||searchOpen||settingsOpen||sidebarOpen||!focusAfterNavigation.current)return;
  const frame=requestAnimationFrame(()=>{
   const main=mainRef.current;
   if(!main)return;
   main.focus({preventScroll:true});
   focusAfterNavigation.current=false;
  });
  return()=>cancelAnimationFrame(frame);
 },[route,ready,searchOpen,settingsOpen,sidebarOpen]);

 const sidebarScope=currentTrack?.id??(isFoundation?"foundation":null);
 const sidebarReveal=useRef<{scope:string|null|undefined;route:string;pending:boolean}>({scope:undefined,route,pending:true});
 useEffect(()=>{
  const state=sidebarReveal.current;
  if(state.scope!==sidebarScope){
   state.scope=sidebarScope;state.route=route;state.pending=true;
  }else if(state.route!==route){
   // A lesson change inside the same course never requests a sidebar scroll.
   state.route=route;state.pending=false;
  }
  if(!sidebarScope||!state.pending)return;
  let cancelled=false;
  let frame=0;
  const reveal=()=>{
   if(cancelled)return;
   const nav=sidebarRef.current?.querySelector<HTMLElement>(".chapter-nav");
   const activeLesson=nav?.querySelector<HTMLElement>('.chapter-lesson[aria-current="page"]');
   const collapsed=activeLesson?.closest<HTMLElement>(".chapter-collapse")?.getAttribute("aria-hidden")==="true";
   const target=(!collapsed?activeLesson:null)??nav?.querySelector<HTMLElement>(".chapter-trigger.chapter-current");
   if(!nav||!target||nav.clientHeight===0)return;
   state.pending=false;
   const bounds=nav.getBoundingClientRect();
   const targetBounds=target.getBoundingClientRect();
   const top=bounds.top+nav.clientTop;
   const bottom=top+nav.clientHeight;
   const delta=targetBounds.top<top?targetBounds.top-top:targetBounds.bottom>bottom?targetBounds.bottom-bottom:0;
   if(Math.abs(delta)<1)return;
   nav.scrollTo({top:Math.max(0,nav.scrollTop+delta),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
  };
  const afterCommit=()=>{
   if(cancelled)return;
   const activeLesson=sidebarRef.current?.querySelector<HTMLElement>('.chapter-nav .chapter-lesson[aria-current="page"]');
   const panel=activeLesson?.closest<HTMLElement>(".chapter-collapse");
   const transitions=panel?.getAnimations().filter(animation=>animation.playState==="running")??[];
   // Expanding a chapter changes scrollHeight. Wait before computing/clamping
   // the destination; scroll only the navigation container, never the window.
   if(transitions.length){
    void Promise.allSettled(transitions.map(animation=>animation.finished)).then(()=>{
     if(!cancelled)frame=requestAnimationFrame(reveal);
    });
   }else reveal();
  };
  // Give the active-chapter effect time to commit before measuring its panel.
  frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(afterCommit);});
  return()=>{cancelled=true;cancelAnimationFrame(frame);};
 },[sidebarScope,route,sidebarOpen]);
 // Router changes, including browser navigation, reveal the active lesson in the sidebar.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{if(currentChapterId)setExpandedChapters(p=>p.includes(currentChapterId)?p:[...p,currentChapterId]);},[currentChapterId]);
 // Record direct URL and browser navigation only after saved progress has loaded.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{if(ready&&currentLesson)setProgress(p=>p.lastLesson===currentLesson.id?p:{...p,lastLesson:currentLesson.id});},[ready,currentLesson]);
 const exportProgress=()=>{const u=URL.createObjectURL(new Blob([progressLoadError&&storedProgressRaw.current!==null?storedProgressRaw.current:JSON.stringify(progress,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=u;a.download="learn-rust-progress.json";a.click();URL.revokeObjectURL(u);};
 return <LearningStateContext.Provider value={learningState}><div className="app-shell">
  <a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();mainRef.current?.focus();}}>Đến nội dung chính</a>
  <header className="topbar" inert={searchOpen||settingsOpen||sidebarOpen}>
   <div className="flex min-w-0 items-center gap-3">
    <button className="icon-button mobile-menu" aria-label="Mở mục lục" aria-expanded={sidebarOpen} aria-controls="learning-sidebar" onClick={()=>{rememberFocus();setSidebarOpen(true);}}><Menu size={20}/></button>
    <Link href="/" className="brand-button" aria-label="Learn Rust — Bài học" onNavigate={closeNavigation}><Brand/></Link>
    <span className="topbar-divider"/>
    <span className="topbar-context">{currentTrack?.shortTitle||(isFoundation?"Kiến thức nền tảng":currentModule?.title||label)}</span>
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
   <div className="sidebar-course-label">{sidebarChapters.length?<Link href="/" onNavigate={closeNavigation}>← Bài học</Link>:"Khóa học"}</div>
   {sidebarChapters.length?<><Link href={currentTrack?"/khoa-hoc/"+currentTrack.id:"/khoa-hoc/nen-tang"} className="course-sidebar-title" onNavigate={closeNavigation}>{currentTrack?.shortTitle??"Kiến thức nền tảng"}</Link><nav className="chapter-nav" aria-label="Các chương Rust">{sidebarChapters.map((chapter,index)=>{const isOpen=expandedChapters.includes(chapter.id);return <div className="sidebar-chapter" key={chapter.id}>
    <button className={"chapter-trigger "+(currentChapterId===chapter.id?"chapter-current":"")} aria-expanded={isOpen} aria-controls={"sidebar-"+chapter.id} onClick={()=>setExpandedChapters(previous=>isOpen?previous.filter(id=>id!==chapter.id):[...previous,chapter.id])}><span className="chapter-number">{String(index+1).padStart(2,"0")}</span><span>{chapter.title}</span><ChevronDown size={14} className={"transition-transform duration-200 "+(isOpen?"rotate-180":"")}/></button>
    <div id={"sidebar-"+chapter.id} className={"chapter-collapse "+(isOpen?"is-open":"")} inert={!isOpen} aria-hidden={!isOpen}><div>{chapter.lessonIds.map((id,i)=>{const lesson=lessonsById.get(id);return lesson?<Link key={id} href={"/bai-hoc/"+id} prefetch={false} className={"chapter-lesson "+(currentLesson?.id===id?"active":"")} aria-current={currentLesson?.id===id?"page":undefined} onNavigate={()=>visitLesson(id)}><span>{progress.completed.includes(id)?<Check size={13}/>:index+1+"."+(i+1)}</span><span>{lesson.title}</span></Link>:null;})}</div></div>
   </div>;})}</nav></>:<nav className="sidebar-course-list" aria-label="Các khóa học"><Link href="/khoa-hoc/nen-tang" onNavigate={closeNavigation}>Kiến thức nền tảng</Link><span>Chuyên sâu</span>{specializations.map(track=><Link key={track.id} href={"/khoa-hoc/"+track.id} prefetch={false} onNavigate={closeNavigation}>{track.shortTitle}</Link>)}</nav>}
   <div className="sidebar-bottom"><span>{visibleLessons.filter(lesson=>progress.completed.includes(lesson.id)).length}/{visibleLessons.length} bài hoàn thành</span></div>
  </aside>
  <div className="app-main" inert={searchOpen||settingsOpen||sidebarOpen}>
   {(progressSaveError||progressLoadError)&&<div className="progress-save-warning" role="alert"><span>{progressLoadError?"Chưa đọc được tiến độ đã lưu. Dữ liệu cũ vẫn được giữ.":"Chưa lưu được tiến độ và ghi chú. Hãy tải bản sao trước khi đóng trang."}</span>{(!progressLoadError||hasStoredProgress)&&<button className="button button-secondary" onClick={exportProgress}><Download size={15}/>Tải bản sao</button>}{progressLoadError&&<button className="button button-secondary" onClick={()=>window.location.reload()}>Tải lại trang</button>}</div>}
   <main key={route} id="main-content" ref={mainRef} tabIndex={-1} aria-label={pageTitle} className={`page-content motion-safe:animate-[page-in_180ms_ease-out_both] ${currentLesson||currentProject?"page-content-learning":""}`}>
     {children}
   </main>
  </div>
  {searchOpen&&<div className="modal-backdrop" onClick={()=>setSearchOpen(false)}><section ref={searchDialogRef} tabIndex={-1} className="search-modal" role="dialog" aria-modal="true" aria-label="Tìm kiếm bài học" onClick={e=>e.stopPropagation()}><div className="search-modal-input"><Search size={20}/><input ref={searchRef} aria-label="Tìm bài học hoặc chủ đề Rust" placeholder="Tìm bài học hoặc chủ đề…" value={query} onChange={e=>setQuery(e.target.value)}/><button className="icon-button" onClick={()=>setSearchOpen(false)} aria-label="Đóng tìm kiếm"><X size={18}/></button></div><div className="search-results">{results.map(l=><button key={l.id} onClick={()=>openLesson(l.id)}><BookOpen size={17}/><span><strong>{l.title}</strong><small>{modules.find(m=>m.id===l.moduleId)?.title}</small></span><ArrowUpRight size={16}/></button>)}{!results.length&&<EmptyState title="Không có kết quả">Thử một từ khóa khác.</EmptyState>}</div></section></div>}
  {settingsOpen&&<div className="modal-backdrop" onClick={()=>setSettingsOpen(false)}><section ref={settingsDialogRef} tabIndex={-1} className="settings-modal card" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={e=>e.stopPropagation()}><div className="card-heading"><h2 id="settings-title">Cài đặt</h2><button className="icon-button" aria-label="Đóng cài đặt" onClick={()=>setSettingsOpen(false)}><X size={19}/></button></div><AccountSettings getSnapshot={()=>progress} onRestore={snapshot=>{setProgress(readProgress(snapshot));setProgressLoadError(false);storedProgressRaw.current=null;}}/><button className="button button-secondary full-width" onClick={exportProgress}><Download size={16}/>Tải tiến độ</button><div className="settings-reset">{resetConfirm?<><p>Xóa tiến độ, bài đã lưu và ghi chú? Bản nháp mã vẫn được giữ.</p><div className="flex justify-end gap-2"><button className="button button-secondary" onClick={()=>setResetConfirm(false)}>Hủy</button><button className="button button-danger" onClick={()=>{setProgress(initialProgress);setProgressLoadError(false);storedProgressRaw.current=null;setResetConfirm(false);setToast("Đã đặt lại tiến độ.");}}>Xóa tiến độ</button></div></>:<button className="danger-link" onClick={()=>setResetConfirm(true)}>Đặt lại tiến độ</button>}</div></section></div>}
  {toast&&<div className="toast" role="status"><CircleCheck size={18}/>{toast}<button aria-label="Đóng thông báo" onClick={()=>setToast("")}><X size={15}/></button></div>}
 </div></LearningStateContext.Provider>;
}
