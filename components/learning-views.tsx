"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, CheckCircle2,
  CircleAlert, Download, ExternalLink, FileText, FolderCode, Lightbulb,
  ListTodo, Terminal, Wallet,
} from "lucide-react";
import { lessons, modules, type Lesson } from "@/src/data/curriculum";
import { projects, type RustProject } from "@/src/data/projects";
import { CodeLab } from "./code-lab";
import { CodeHighlight } from "./code-highlight";
import type { Progress } from "./learning-shared";
import "./learning-views.css";

function ViewTabs({ items, value, onChange, label }: {
  items: { id: string; title: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return <nav className="lv-tabs" aria-label={label}>
    {items.map(item => <button type="button" key={item.id}
      className={`lv-tab transition-colors duration-150 motion-reduce:transition-none ${value === item.id ? "lv-tab-active" : ""}`}
      aria-pressed={value === item.id} onClick={() => onChange(item.id)}>
      {item.title}
    </button>)}
  </nav>;
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
  const [tab, setTab] = useState("theory");
  const lessonIndex = lessons.findIndex(item => item.id === lesson.id);
  const saved = progress.bookmarks.includes(lesson.id);
  const answer = progress.quizzes[lesson.id];
  const quizCorrect = answer === lesson.quiz.correct;
  const solved = progress.solved.includes(lesson.id);
  const complete = progress.completed.includes(lesson.id);
  const canComplete = solved && quizCorrect;
  const previous = lessons[lessonIndex - 1];
  const next = lessons[lessonIndex + 1];

  return <section className="lv-lesson-view lv-learning-layout grid min-w-0">
    <div className="lv-reading-column">
      <div className="lv-panel-toolbar flex items-center">
        <ViewTabs label="Nội dung bài học" value={tab} onChange={setTab} items={[
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

      <header className="lv-lesson-heading">
        <div className="lv-lesson-meta"><span>Bài {lessonIndex + 1}</span><span>{lesson.duration} phút</span>
          {complete && <span className="lv-status"><CheckCircle2 size={14} />Đã hoàn thành</span>}
        </div>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
      </header>

      <article key={tab} className="lv-article">
        {tab === "theory" && <>
          <details className="lv-objectives">
            <summary>Mục tiêu bài học</summary>
            <ul>{lesson.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul>
          </details>
          {lesson.sections.map(section => <section className="lv-theory-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.text.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {section.code && <SampleCode code={section.code} />}
          </section>)}
          <div className="lv-note"><Lightbulb size={17} /><p>{lesson.tip}</p></div>
          <a className="lv-reference" href={lesson.reference.url} target="_blank" rel="noreferrer">
            {lesson.reference.label}<ExternalLink size={14} />
          </a>
          <button className="button button-primary transition-colors duration-150 motion-reduce:transition-none" onClick={() => setTab("exercise")}>Làm bài tập<ArrowRight size={16} /></button>
        </>}

        {tab === "exercise" && <>
          <h2>{lesson.exercise.title}</h2>
          <p>{lesson.exercise.instructions}</p>
          <h3>Yêu cầu</h3>
          <ol className="lv-requirements">{lesson.exercise.requirements.map(requirement => <li key={requirement}>{requirement}</li>)}</ol>
          <ExpectedOutput output={lesson.expectedOutput} />
          <p className="lv-help-text">Giữ các phép kiểm tra trong mã mẫu. Chọn “Kiểm tra bài làm” sau khi hoàn thiện.</p>
          {solved && <p className="lv-inline-status"><CheckCircle2 size={17} />Bài tập đã đạt yêu cầu.</p>}
          <button className="button button-secondary transition-colors duration-150 motion-reduce:transition-none" onClick={() => setTab("quiz")}>Trả lời câu hỏi<ArrowRight size={16} /></button>
        </>}

        {tab === "quiz" && <>
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
        </>}
      </article>

      <section className="lv-completion" aria-label="Hoàn thành bài học">
        <div className="lv-completion-checks">
          <span className={solved ? "lv-status" : ""}><CheckCircle2 size={15} />Bài tập</span>
          <span className={quizCorrect ? "lv-status" : ""}><CheckCircle2 size={15} />Câu hỏi</span>
        </div>
        {!canComplete && !complete && <p>Hoàn thành bài tập và trả lời đúng câu hỏi để ghi nhận tiến độ.</p>}
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
    </div>

    <aside className="lv-practice-column" aria-label="Trình soạn thảo Rust">
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
    <p className="lv-help-text">Mỗi ví dụ có bản nháp riêng. Dùng dữ liệu mẫu trong mã; chưa hỗ trợ stdin tương tác.</p>
  </section>;
}

const projectIcons = [Wallet, FileText, ListTodo];

export function ProjectsView({ progress, go }: { progress: Progress; go: (route: string) => void }) {
  return <section className="lv-projects-view">
    <ViewHeading title="Dự án" description="Thực hành tổng hợp với ba chương trình Rust.">
      <button className="text-link lv-inline-link" onClick={() => go("lo-trinh")}>Lộ trình học<ArrowRight size={15} /></button>
    </ViewHeading>
    <div className="lv-project-list">{projects.map((project, index) => {
      const Icon = projectIcons[index] || FolderCode;
      const finished = progress.finishedProjects.includes(project.id);
      return <article className="lv-project-row" key={project.id}>
        <Icon className="lv-project-icon" size={23} />
        <div className="lv-project-copy">
          <button className="lv-item-title" onClick={() => go(`du-an/${project.id}`)}>{project.title}</button>
          <div className="lv-item-meta"><span>{project.level}</span><span>{project.estimate}</span>
            {finished && <span className="lv-status"><CheckCircle2 size={14} />Đã hoàn thành</span>}
          </div>
          <p>{project.description}</p>
          <div className="lv-topic-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </div>
        <button className="button button-secondary transition-colors duration-150 motion-reduce:transition-none" onClick={() => go(`du-an/${project.id}`)}>Mở dự án<ArrowRight size={15} /></button>
      </article>;
    })}</div>
  </section>;
}

export function ProjectWorkspace({ project, progress, go, onPass }: {
  project: RustProject; progress: Progress; go: (route: string) => void; onPass: () => void;
}) {
  const finished = progress.finishedProjects.includes(project.id);
  return <section className="lv-project-workspace lv-learning-layout grid min-w-0">
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
        <details className="lv-objectives"><summary>Kiến thức thực hành</summary>
          <ul>{project.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul>
        </details>
        <h2>Yêu cầu</h2>
        <ol className="lv-requirements">{project.instructions.map(instruction => <li key={instruction}>{instruction}</li>)}</ol>
        <ExpectedOutput output={project.expectedOutput} />
        <div className="lv-note"><Lightbulb size={17} /><p>Giữ các assertion trong mã mẫu để kiểm tra cả những trường hợp ngoài đầu ra minh họa.</p></div>
        {finished && <p className="lv-inline-status"><CheckCircle2 size={17} />Dự án đã đạt yêu cầu.</p>}
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
  const [tab, setTab] = useState("bookmarks");
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
    <ViewTabs label="Các phần của sổ tay" value={tab} onChange={setTab} items={[
      { id: "bookmarks", title: "Bài đã lưu" },
      { id: "notes", title: "Ghi chú" },
      { id: "cheatsheet", title: "Tra cứu nhanh" },
    ]} />
    {tab === "bookmarks" && <div className="lv-bookmarks">
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
    </div>}
    {tab === "notes" && <div className="lv-notes-editor">
      <div className="lv-notes-toolbar"><label htmlFor="learn-rust-notes">Ghi chú của bạn</label>
        <button className="button button-secondary transition-colors duration-150 motion-reduce:transition-none" disabled={!progress.notes.trim()} onClick={downloadNotes}><Download size={15} />Tải ghi chú</button>
      </div>
      <textarea id="learn-rust-notes" value={progress.notes} onChange={event => onNotes(event.target.value)}
        placeholder="Ghi lại điều bạn muốn nhớ…" spellCheck={false} />
      <p className="lv-help-text">Tự động lưu trên trình duyệt này. Tải ghi chú để giữ một bản sao.</p>
    </div>}
    {tab === "cheatsheet" && <>
      <div className="lv-cheatsheet-grid">{cheatSheets.map(sheet => <article className="lv-cheatsheet-card" key={sheet.title}>
        <h2>{sheet.title}</h2><p>{sheet.text}</p><SampleCode code={sheet.code} />
      </article>)}</div>
      <a className="lv-reference" href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noreferrer">Rust by Example<ExternalLink size={14} /></a>
    </>}
  </section>;
}
