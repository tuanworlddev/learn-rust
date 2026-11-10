"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, CheckCircle2,
  ChevronDown, Circle, CircleAlert, Code2, Copy, Download, ExternalLink, FileText, FolderCode, Lightbulb,
  ListTodo, Terminal, Wallet,
} from "lucide-react";
import type { Lesson } from "@/src/data/curriculum";
import { projects, type RustProject } from "@/src/data/projects";
import { CodeLab } from "./code-lab";
import { LessonVisual } from "./lesson-visual";
import { LocalLabDownload } from "./local-lab-download";
import { CodeHighlight } from "./code-highlight";
import { AnimatedDisclosure } from "./animated-disclosure";
import { useCourse } from "./course-context";
import { scrollWithMotion } from "./learning-motion";
import type { Progress } from "./learning-shared";
import "./learning-views.css";

function ViewTabs({ id, items, value, onChange, label }: {
  id: string;
  items: { id: string; title: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="lv-tabs" role="tablist" aria-label={label}>
    {items.map((item, index) => <button type="button" key={item.id}
      ref={element => { buttons.current[index] = element; }}
      role="tab" id={`${id}-${item.id}-tab`} aria-controls={`${id}-${item.id}-panel`}
      aria-selected={value === item.id} tabIndex={value === item.id ? 0 : -1}
      className={`lv-tab transition-colors duration-150 motion-reduce:transition-none ${value === item.id ? "lv-tab-active" : ""}`}
      onClick={() => onChange(item.id)} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % items.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = items.length - 1;
        else return;
        event.preventDefault();
        onChange(items[next].id);
        buttons.current[next]?.focus({ preventScroll: true });
      }}>
      {item.title}
    </button>)}
  </div>;
}

function WorkspaceSwitch({ pane, onChange }: { pane: "reading" | "code"; onChange: (pane: "reading" | "code") => void }) {
  return <div className="lv-workspace-switch" role="group" aria-label="Chọn khu vực học">
    <button type="button" aria-pressed={pane === "reading"} onClick={() => onChange("reading")}><BookOpen size={16} />Nội dung</button>
    <button type="button" aria-pressed={pane === "code"} onClick={() => onChange("code")}><Code2 size={16} />Viết mã</button>
  </div>;
}

function useWorkspacePane() {
  const [pane, setPane] = useState<"reading" | "code">("reading");
  const root = useRef<HTMLElement>(null);
  const positions = useRef<Partial<Record<"reading" | "code", number>>>({});
  const pending = useRef(false);
  const cancelScroll = useRef<(() => void) | null>(null);
  useEffect(() => () => cancelScroll.current?.(), []);
  const select = (next: "reading" | "code") => {
    if (next === pane) return;
    cancelScroll.current?.();
    if (root.current && window.matchMedia("(max-width: 900px)").matches) {
      positions.current[pane] = window.scrollY;
      root.current.style.minHeight = `${root.current.getBoundingClientRect().height}px`;
      pending.current = true;
    }
    setPane(next);
  };
  useLayoutEffect(() => {
    const element = root.current;
    if (!pending.current || !element) return;
    pending.current = false;
    const visible = element.querySelector<HTMLElement>(pane === "reading" ? ".lv-reading-column" : ".lv-practice-column");
    const switchHeight = element.querySelector<HTMLElement>(".lv-workspace-switch")?.offsetHeight ?? 0;
    const naturalHeight = (visible?.offsetHeight ?? 0) + switchHeight;
    const max = Math.max(0, document.documentElement.scrollHeight - element.offsetHeight + naturalHeight - window.innerHeight);
    const start = window.scrollY + element.getBoundingClientRect().top - 60;
    const top = Math.max(0, Math.min(max, positions.current[pane] ?? start));
    cancelScroll.current = scrollWithMotion(window, top, () => { element.style.minHeight = ""; });
  }, [pane]);
  return { pane, select, root };
}

function LocalLabFile({ path, content }: { path: string; content: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setFailed(false);
    } catch { setFailed(true); }
  }
  return <div className="lv-lab-file">
    <div className="lv-lab-file-heading"><code>{path}</code><button type="button" onClick={copy}
      aria-label={`Sao chép ${path}`}><Copy size={13} />{copied ? "Đã chép" : "Sao chép"}</button></div>
    <pre className="lv-sample-code" tabIndex={0}>{content}</pre>
    {failed && <p role="status">Hãy chọn mã để sao chép.</p>}
  </div>;
}

function LocalLab({ lab, lessonId }: { lab: NonNullable<Lesson["localLab"]>; lessonId: string }) {
  return <AnimatedDisclosure className="lv-local-lab" title={<><span>Dự án Cargo</span><ChevronDown size={16} /></>}>
    <div className="lv-local-lab-body">
      <h2>{lab.title}</h2>
      <p>{lab.instructions}</p>
      <LocalLabDownload lessonId={lessonId} lab={lab} />
      {lab.files.map(file => <LocalLabFile key={file.path} {...file} />)}
      <h3>Chạy dự án</h3>
      <pre className="lv-sample-code" tabIndex={0}>{lab.commands.join("\n")}</pre>
      <h3>Kiểm tra kết quả</h3>
      <ul>{lab.checks.map(check => <li key={check}>{check}</li>)}</ul>
    </div>
  </AnimatedDisclosure>;
}

function ViewHeading({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return <header className="lv-page-heading">
    <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {children}
  </header>;
}

function SampleCode({ code }: { code: string }) {
  return <pre className="lv-sample-code"><CodeHighlight code={code} /></pre>;
}

function ExpectedOutput({ output }: { output: string }) {
  return <div className="lv-expected">
    <div><Terminal size={15} /><span>Kết quả mong đợi</span></div>
    <pre>{output || "(Không có đầu ra)"}</pre>
  </div>;
}

type LessonViewProps = {
  lesson: Lesson;
  progress: Progress;
  onBookmark: () => void;
  onQuiz: (answer: number) => void;
  onPass: () => void;
  onComplete: () => void;
  onNavigate: (id: string) => void;
  onBack: () => void;
};

export function LessonView({ lesson, progress, onBookmark, onQuiz, onPass, onComplete, onNavigate, onBack }: LessonViewProps) {
  const { lessons: catalogLessons } = useCourse();
  const lessons = catalogLessons.filter(item => lesson.moduleId.startsWith("track-") ? item.moduleId === lesson.moduleId : !item.moduleId.startsWith("track-"));
  const [tab, setTab] = useState("theory");
  const tabsId = useId();
  const { pane: mobilePane, select: selectPane, root: workspaceRef } = useWorkspacePane();
  const practiceRef = useRef<HTMLElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const tabPositions = useRef<Record<string, number>>({});
  const pendingTab = useRef<{ fromFooter: boolean } | null>(null);
  const cancelScroll = useRef<(() => void) | null>(null);
  useEffect(() => () => cancelScroll.current?.(), []);
  const openTab = (next: string, fromFooter = false) => {
    if (next === tab) return;
    cancelScroll.current?.();
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    tabPositions.current[`${mobile ? "mobile" : "desktop"}-${tab}`] = mobile ? window.scrollY : readingRef.current?.scrollTop ?? 0;
    if (flowRef.current) flowRef.current.style.minHeight = `${flowRef.current.getBoundingClientRect().height}px`;
    pendingTab.current = { fromFooter };
    setTab(next);
  };
  useLayoutEffect(() => {
    const pending = pendingTab.current;
    const reading = readingRef.current;
    const flow = flowRef.current;
    const body = bodyRef.current;
    if (!pending || !reading || !flow || !body) return;
    pendingTab.current = null;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const panel = document.getElementById(`${tabsId}-${tab}-panel`);
    const scroller = mobile ? window : reading;
    const previous = tabPositions.current[`${mobile ? "mobile" : "desktop"}-${tab}`];
    const naturalHeight = mobile
      ? document.documentElement.scrollHeight - flow.offsetHeight + body.offsetHeight
      : reading.scrollHeight - flow.offsetHeight + body.offsetHeight;
    const max = Math.max(0, naturalHeight - (mobile ? window.innerHeight : reading.clientHeight));
    const panelTop = panel ? (mobile
      ? window.scrollY + panel.getBoundingClientRect().top - 170
      : reading.scrollTop + panel.getBoundingClientRect().top - reading.getBoundingClientRect().top - 64) : 0;
    const start = mobile ? window.scrollY + reading.getBoundingClientRect().top - 112 : 0;
    const target = Math.max(0, Math.min(max, pending.fromFooter ? panelTop : previous ?? start));
    if (pending.fromFooter) panel?.focus({ preventScroll: true });
    cancelScroll.current = scrollWithMotion(scroller, target, () => { flow.style.minHeight = ""; });
  }, [tab, tabsId]);
  const openEditor = () => {
    selectPane("code");
    requestAnimationFrame(() => {
      practiceRef.current?.querySelector("textarea")?.focus({ preventScroll: true });
    });
  };
  const lessonIndex = lessons.findIndex(item => item.id === lesson.id);
  const saved = progress.bookmarks.includes(lesson.id);
  const answer = progress.quizzes[lesson.id];
  const quizCorrect = answer === lesson.quiz.correct;
  const solved = progress.solved.includes(lesson.id);
  const complete = progress.completed.includes(lesson.id);
  const canComplete = solved && quizCorrect;
  const previous = lessons[lessonIndex - 1];
  const next = lessons[lessonIndex + 1];

  return <section ref={workspaceRef} className="lv-lesson-view lv-learning-layout grid min-w-0" data-mobile-pane={mobilePane}>
    <WorkspaceSwitch pane={mobilePane} onChange={selectPane} />
    <div ref={readingRef} className="lv-reading-column">
      <div className="lv-panel-toolbar flex items-center">
        <ViewTabs id={tabsId} label="Nội dung bài học" value={tab} onChange={openTab} items={[
          { id: "theory", title: "Lý thuyết" },
          { id: "exercise", title: "Bài tập" },
          { id: "quiz", title: "Câu hỏi" },
        ]} />
        <button type="button" className={`icon-button lv-save-button ${saved ? "lv-is-saved" : ""}`}
          title={saved ? "Bỏ lưu bài học" : "Lưu bài học"}
          aria-label={saved ? "Bỏ lưu bài học" : "Lưu bài học"}
          aria-pressed={saved} onClick={onBookmark}>
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div ref={flowRef} className="lv-reading-flow"><div ref={bodyRef} className="lv-reading-body">
      <header className="lv-lesson-heading">
        <div className="lv-lesson-meta"><span>Bài {lessonIndex + 1}</span><span>{lesson.duration} phút</span>
          {complete && <span className="lv-status"><CheckCircle2 size={14} />Đã hoàn thành</span>}
        </div>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
      </header>

      <article id={`${tabsId}-theory-panel`} role="tabpanel" aria-labelledby={`${tabsId}-theory-tab`} tabIndex={0} hidden={tab !== "theory"} className="lv-article">
          <AnimatedDisclosure className="lv-objectives" title={<><span>Mục tiêu bài học</span><ChevronDown size={15} /></>}>
            <ul>{lesson.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul>
          </AnimatedDisclosure>
          {lesson.sections.map((section, sectionIndex) => <section className="lv-theory-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.text.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {section.code && <SampleCode code={section.code} />}
            {sectionIndex === 0 && <LessonVisual lesson={lesson} />}
          </section>)}
          <div className="lv-note"><Lightbulb size={17} /><p>{lesson.tip}</p></div>
          <a className="lv-reference" href={lesson.reference.url} target="_blank" rel="noreferrer">
            {lesson.reference.label}<ExternalLink size={14} />
          </a>
          {lesson.localLab && <LocalLab lab={lesson.localLab} lessonId={lesson.id} />}
          <button className="button button-primary transition-colors duration-150 motion-reduce:transition-none" onClick={() => openTab("exercise", true)}>Làm bài tập<ArrowRight size={16} /></button>
      </article>

      <article id={`${tabsId}-exercise-panel`} role="tabpanel" aria-labelledby={`${tabsId}-exercise-tab`} tabIndex={0} hidden={tab !== "exercise"} className="lv-article">
          <h2>{lesson.exercise.title}</h2>
          <p>{lesson.exercise.instructions}</p>
          <h3>Yêu cầu</h3>
          <ol className="lv-requirements">{lesson.exercise.requirements.map(requirement => <li key={requirement}>{requirement}</li>)}</ol>
          <ExpectedOutput output={lesson.expectedOutput} />
          <div className="lv-exercise-actions">
            <button className="button button-primary lv-mobile-editor-action" onClick={openEditor}><Code2 size={16} />Viết mã</button>
            <button className="button button-secondary transition-colors duration-150 motion-reduce:transition-none" onClick={() => openTab("quiz", true)}>Trả lời câu hỏi<ArrowRight size={16} /></button>
          </div>
      </article>

      <article id={`${tabsId}-quiz-panel`} role="tabpanel" aria-labelledby={`${tabsId}-quiz-tab`} tabIndex={0} hidden={tab !== "quiz"} className="lv-article">
          <h2 className="lv-question-title">{lesson.quiz.question}</h2>
          <div className="lv-quiz-options" role="group" aria-label="Chọn câu trả lời">
            {lesson.quiz.options.map((option, index) => <button type="button" key={option}
              className={`lv-quiz-option transition-colors duration-150 motion-reduce:transition-none ${answer === index ? (quizCorrect ? "lv-answer-correct" : "lv-answer-wrong") : ""}`}
              aria-pressed={answer === index} onClick={() => onQuiz(index)}>
              <span className="lv-option-letter">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
              {answer === index && (quizCorrect ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />)}
            </button>)}
          </div>
          {answer !== undefined && <div className={`lv-quiz-feedback ${quizCorrect ? "lv-feedback-correct" : ""}`} role="status">
            <strong>{quizCorrect ? "Chính xác." : "Chưa đúng. Bạn có thể chọn lại."}</strong>
            <p>{lesson.quiz.explanation}</p>
          </div>}
      </article>

      <section className="lv-completion" aria-label="Hoàn thành bài học">
        <div className="lv-completion-checks">
          <button type="button" className={solved ? "lv-status" : ""} onClick={() => openTab("exercise", true)} aria-label={`Bài tập ${solved ? "đã hoàn thành" : "chưa hoàn thành"}`}>{solved ? <CheckCircle2 size={15} /> : <Circle size={15} />}Bài tập</button>
          <button type="button" className={quizCorrect ? "lv-status" : ""} onClick={() => openTab("quiz", true)} aria-label={`Câu hỏi ${quizCorrect ? "đã hoàn thành" : "chưa hoàn thành"}`}>{quizCorrect ? <CheckCircle2 size={15} /> : <Circle size={15} />}Câu hỏi</button>
        </div>
        <button className={`button ${complete ? "button-secondary" : "button-primary"}`}
          disabled={!canComplete || complete} onClick={onComplete}>
          {complete ? <Check size={16} /> : <CheckCircle2 size={16} />}
          {complete ? "Đã hoàn thành" : "Hoàn thành bài học"}
        </button>
      </section>

      <nav className="lv-lesson-pagination" aria-label="Bài học trước và sau">
        {previous ? <button onClick={() => onNavigate(previous.id)} title={previous.title}>
          <ArrowLeft size={16} /><span>Bài trước</span>
        </button> : <button onClick={onBack}><ArrowLeft size={16} /><span>Lộ trình</span></button>}
        {next ? <button onClick={() => onNavigate(next.id)} title={next.title}>
          <span>Bài tiếp theo</span><ArrowRight size={16} />
        </button> : <button onClick={onBack}><span>Lộ trình</span><ArrowRight size={16} /></button>}
      </nav>
      </div></div>
    </div>

    <aside ref={practiceRef} className="lv-practice-column" aria-label="Trình soạn thảo Rust">
      <CodeLab key={lesson.id} initialCode={lesson.starterCode}
        storageKey={`rustviet-code-lesson-${lesson.id}`} expectedOutput={lesson.expectedOutput}
        onPass={onPass} solutionCode={lesson.solutionCode} hints={lesson.hints} />
    </aside>
  </section>;
}

const playgroundTemplates = [
  { id: "hello", title: "Lời chào đầu tiên", code: 'fn main() {\n    let language = "Rust";\n    println!("Xin chào, {language}!");\n    println!("Hôm nay mình sẽ học được điều mới.");\n}' },
  { id: "vector", title: "Khám phá Vector", code: 'fn main() {\n    let scores = vec![7, 9, 8, 10, 6];\n    let total: i32 = scores.iter().sum();\n    let excellent: Vec<_> = scores.iter().filter(|&&score| score >= 8).collect();\n\n    println!("Các điểm số: {scores:?}");\n    println!("Tổng điểm: {total}");\n    println!("Điểm từ 8 trở lên: {excellent:?}");\n}' },
  { id: "borrowing", title: "Thử một tham chiếu", code: 'fn greet(name: &str) {\n    println!("Chào {name}, cùng học Rust nhé!");\n}\n\nfn main() {\n    let name = String::from("bạn");\n    greet(&name);\n    // greet chỉ mượn dữ liệu. name vẫn dùng được.\n    println!("Tên vẫn ở đây: {name}");\n}' },
];

export function Playground({ go }: { go: (route: string) => void }) {
  const [templateId, setTemplateId] = useState(playgroundTemplates[0].id);
  const template = playgroundTemplates.find(item => item.id === templateId)!;
  return <section className="lv-playground-view">
    <ViewHeading title="Thực hành Rust">
      <button className="text-link lv-inline-link" onClick={() => go("lo-trinh")}>Lộ trình học<ArrowRight size={15} /></button>
    </ViewHeading>
    <div className="lv-playground-toolbar">
      <label htmlFor="rust-playground-template">Ví dụ</label>
      <select className="transition-colors duration-150 motion-reduce:transition-none" id="rust-playground-template" value={templateId} onChange={event => setTemplateId(event.target.value)}>
        {playgroundTemplates.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
    </div>
    <CodeLab key={template.id} initialCode={template.code} storageKey={`rustviet-playground-${template.id}`} />
  </section>;
}

const projectIcons = [Wallet, FileText, ListTodo];

export function ProjectsView({ progress, go }: { progress: Progress; go: (route: string) => void }) {
  return <section className="lv-projects-view">
    <ViewHeading title="Dự án">
      <button className="text-link lv-inline-link" onClick={() => go("phong-van")}>Phỏng vấn<ArrowRight size={15} /></button>
    </ViewHeading>
    <div className="lv-project-list">{projects.map((project, index) => {
      const Icon = projectIcons[index] || FolderCode;
      const finished = progress.finishedProjects.includes(project.id);
      return <article className="lv-project-row" key={project.id}>
        <Icon className="lv-project-icon" size={23} />
        <div className="lv-project-copy">
          <Link href={`/du-an/${project.id}`} prefetch={false} className="lv-item-title">{project.title}</Link>
          <div className="lv-item-meta"><span>{project.level}</span><span>{project.estimate}</span>
            {finished && <span className="lv-status"><CheckCircle2 size={14} />Đã hoàn thành</span>}
          </div>
          <p>{project.description}</p>
          <div className="lv-topic-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </div>
        <Link href={`/du-an/${project.id}`} prefetch={false} className="button button-secondary transition-colors duration-150 motion-reduce:transition-none">Mở dự án<ArrowRight size={15} /></Link>
      </article>;
    })}</div>
  </section>;
}

export function ProjectWorkspace({ project, progress, go, onPass }: {
  project: RustProject; progress: Progress; go: (route: string) => void; onPass: () => void;
}) {
  const finished = progress.finishedProjects.includes(project.id);
  const { pane: mobilePane, select: selectPane, root: workspaceRef } = useWorkspacePane();
  return <section ref={workspaceRef} className="lv-project-workspace lv-learning-layout grid min-w-0" data-mobile-pane={mobilePane}>
    <WorkspaceSwitch pane={mobilePane} onChange={selectPane} />
    <div className="lv-reading-column">
      <div className="lv-panel-toolbar lv-project-toolbar flex items-center">
        <button className="lv-back-link" onClick={() => go("du-an")}><ArrowLeft size={16} />Dự án</button>
        {finished && <span className="lv-status"><CheckCircle2 size={14} />Đã hoàn thành</span>}
      </div>
      <header className="lv-lesson-heading">
        <div className="lv-lesson-meta"><span>{project.level}</span><span>{project.estimate}</span></div>
        <h1>{project.title}</h1><p>{project.description}</p>
      </header>
      <article className="lv-article">
        <AnimatedDisclosure className="lv-objectives" title={<><span>Kiến thức thực hành</span><ChevronDown size={15} /></>}>
          <ul>{project.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul>
        </AnimatedDisclosure>
        <h2>Yêu cầu</h2>
        <ol className="lv-requirements">{project.instructions.map(instruction => <li key={instruction}>{instruction}</li>)}</ol>
        <ExpectedOutput output={project.expectedOutput} />
        <div className="lv-note"><Lightbulb size={17} /><p>Giữ các assertion trong mã mẫu để kiểm tra cả những trường hợp ngoài đầu ra minh họa.</p></div>
      </article>
    </div>
    <aside className="lv-practice-column" aria-label="Trình soạn thảo dự án">
      <CodeLab key={project.id} initialCode={project.starterCode} storageKey={`rustviet-code-project-${project.id}`}
        expectedOutput={project.expectedOutput} solutionCode={project.solutionCode} onPass={onPass} checkLabel="Kiểm tra dự án"
        hints={["Đọc từng assertion trong main để biết hàm cần trả về gì với mỗi đầu vào.", "Hoàn thiện lần lượt từng TODO. Khi assertion thất bại, so sánh giá trị left và right trong thông báo lỗi."]} />
    </aside>
  </section>;
}

const cheatSheets = [
  { title: "Biến & tính bất biến", text: "Chỉ dùng mut khi giá trị cần được gán lại.", code: 'let language = "Rust";\nlet mut count = 0;\ncount += 1;' },
  { title: "Hàm & giá trị trả về", text: "Biểu thức cuối không có dấu chấm phẩy sẽ được trả về.", code: 'fn square(value: i32) -> i32 {\n    value * value\n}' },
  { title: "Mượn dữ liệu", text: "&T để đọc; &mut T để sửa thông qua tham chiếu.", code: 'fn length(name: &str) -> usize {\n    name.chars().count()\n}' },
  { title: "Một giá trị có thể vắng mặt", text: "Option buộc bạn nghĩ đến cả Some và None.", code: 'let first = [10, 20].first().copied();\nmatch first {\n    Some(value) => println!("{value}"),\n    None => println!("Không có dữ liệu"),\n}' },
  { title: "Lỗi có thể phục hồi", text: "Result chứa Ok khi thành công, Err khi có lỗi.", code: 'match "42".parse::<u32>() {\n    Ok(number) => println!("{number}"),\n    Err(error) => println!("Lỗi: {error}"),\n}' },
  { title: "Xử lý một dãy dữ liệu", text: "Iterator mô tả việc lọc và biến đổi từng phần tử.", code: 'let doubled: Vec<_> = [1, 2, 3]\n    .iter()\n    .map(|n| n * 2)\n    .collect();' },
];

export function Notebook({ progress, onLesson, onBookmark, onNotes }: {
  progress: Progress; onLesson: (id: string) => void; onBookmark: (id: string) => void; onNotes: (notes: string) => void;
}) {
  const { lessons, modules } = useCourse();
  const [tab, setTab] = useState("bookmarks");
  const tabsId = useId();
  const saved = lessons.filter(lesson => progress.bookmarks.includes(lesson.id));
  const downloadNotes = () => {
    const blob = new Blob([`LEARN RUST — GHI CHÚ\n\n${progress.notes}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "learn-rust-notes.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section className="lv-notebook-view">
    <ViewHeading title="Sổ tay" />
    <ViewTabs id={tabsId} label="Các phần của sổ tay" value={tab} onChange={setTab} items={[
      { id: "bookmarks", title: "Bài đã lưu" },
      { id: "notes", title: "Ghi chú" },
      { id: "cheatsheet", title: "Tra cứu nhanh" },
    ]} />
    <section id={`${tabsId}-bookmarks-panel`} role="tabpanel" aria-labelledby={`${tabsId}-bookmarks-tab`} tabIndex={0} hidden={tab !== "bookmarks"} className="lv-bookmarks">
      {saved.length ? saved.map(lesson => <article className="lv-bookmark-row" key={lesson.id}>
        <BookOpen size={20} className="lv-bookmark-icon" />
        <div>
          <button className="lv-item-title" onClick={() => onLesson(lesson.id)}>{lesson.title}</button>
          <p>{modules.find(module => module.id === lesson.moduleId)?.title}</p>
          {progress.completed.includes(lesson.id) && <span className="lv-status"><CheckCircle2 size={14} />Đã hoàn thành</span>}
        </div>
        <button className="icon-button lv-is-saved" aria-label={`Bỏ lưu ${lesson.title}`} title="Bỏ lưu" onClick={() => onBookmark(lesson.id)}><Bookmark size={17} fill="currentColor" /></button>
        <button className="button button-secondary transition-colors duration-150 motion-reduce:transition-none" onClick={() => onLesson(lesson.id)}>Mở bài<ArrowRight size={15} /></button>
      </article>) : <div className="lv-empty-state">
        <p>Chưa có bài đã lưu. Dùng nút lưu ở đầu bài học để thêm vào đây.</p>
        <button className="button button-secondary transition-colors duration-150 motion-reduce:transition-none" onClick={() => onLesson(lessons[0].id)}>Mở bài học đầu tiên<ArrowRight size={16} /></button>
      </div>}
    </section>
    <section id={`${tabsId}-notes-panel`} role="tabpanel" aria-labelledby={`${tabsId}-notes-tab`} tabIndex={0} hidden={tab !== "notes"} className="lv-notes-editor">
      <div className="lv-notes-toolbar"><label htmlFor="learn-rust-notes">Ghi chú của bạn</label>
        <button className="button button-secondary transition-colors duration-150 motion-reduce:transition-none" disabled={!progress.notes.trim()} onClick={downloadNotes}><Download size={15} />Tải ghi chú</button>
      </div>
      <textarea id="learn-rust-notes" value={progress.notes} onChange={event => onNotes(event.target.value)}
        placeholder="Ghi lại điều bạn muốn nhớ…" spellCheck={false} />
    </section>
    <section id={`${tabsId}-cheatsheet-panel`} role="tabpanel" aria-labelledby={`${tabsId}-cheatsheet-tab`} tabIndex={0} hidden={tab !== "cheatsheet"}>
      <div className="lv-cheatsheet-grid">{cheatSheets.map(sheet => <article className="lv-cheatsheet-card" key={sheet.title}>
        <h2>{sheet.title}</h2><p>{sheet.text}</p><SampleCode code={sheet.code} />
      </article>)}</div>
      <a className="lv-reference" href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noreferrer">Rust by Example<ExternalLink size={14} /></a>
    </section>
  </section>;
}
