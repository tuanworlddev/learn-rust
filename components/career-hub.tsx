"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Check, ChevronDown, Download, Search } from "lucide-react";
import { careerProjects, careerStages, interviewQuestions, readinessGates, type CareerSource } from "@/src/data/career";
import { AnimatedDisclosure } from "./animated-disclosure";
import "./career-hub.css";

const STORE = "learn-rust-career-evidence-v1";
const tabs = [
  { id: "interview", label: "Phỏng vấn" },
  { id: "roadmap", label: "Lộ trình" },
  { id: "projects", label: "Dự án thực tế" },
  { id: "evidence", label: "Tự đánh giá" },
] as const;
type TabId = typeof tabs[number]["id"];
type Evidence = Record<string, { note: string; confirmed: boolean }>;
const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
function readEvidence(value: unknown): Evidence {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Evidence = {};
  for (const gate of readinessGates) {
    const raw = (value as Record<string, unknown>)[gate.id];
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const item = raw as Record<string, unknown>;
    if (typeof item.note !== "string") continue;
    const note = item.note.slice(0, 6000);
    result[gate.id] = { note, confirmed: item.confirmed === true && note.trim().length >= 40 };
  }
  return result;
}
function Sources({ sources }: { sources: CareerSource[] }) {
  return <div className="career-sources">{sources.map(source => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={13} aria-hidden="true" /></a>)}</div>;
}

export default function CareerHub() {
  const uid = useId();
  const [tab, setTab] = useState<TabId>("interview");
  const [category, setCategory] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [evidence, setEvidence] = useState<Evidence>({});
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [saveState, setSaveState] = useState<"ready" | "saved" | "failed">("ready");
  const [notice, setNotice] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasChanges = useRef(false);
  const categories = useMemo(() => ["Tất cả", ...new Set(interviewQuestions.map(question => question.category))], []);
  const questions = useMemo(() => interviewQuestions.filter(question => (category === "Tất cả" || question.category === category) && normalize(`${question.question} ${question.category} ${question.answer.join(" ")}`).includes(normalize(query.trim()))), [category, query]);
  const confirmed = readinessGates.filter(gate => evidence[gate.id]?.confirmed).length;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid evidence data");
        // Client-only evidence is restored after SSR; this effect never writes storage.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEvidence(readEvidence(parsed));
      }
    } catch {
      setSaveState("failed");
      setStorageError("Không đọc được bằng chứng đã lưu. Bạn có thể ghi tiếp và tải bản sao.");
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded || !hasChanges.current) return;
    try {
      localStorage.setItem(STORE, JSON.stringify(evidence));
      // Reflect the result of this external storage write in the save indicator.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaveState("saved");
      setStorageError("");
    } catch {
      setSaveState("failed");
      setStorageError("Chưa lưu được thay đổi. Hãy tải bằng chứng trước khi đóng trang.");
    }
  }, [evidence, loaded]);

  function switchTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setTab(tabs[next].id);
    tabRefs.current[next]?.focus({ preventScroll: true });
  }
  function exportEvidence() {
    const exported = {
      title: "Learn Rust — Tự đánh giá có bằng chứng",
      exportedAt: new Date().toISOString(),
      assessment: "Tự đánh giá của người học; chưa được hệ thống hay người hướng dẫn xác minh.",
      criteria: readinessGates.map(gate => ({ id: gate.id, title: gate.title, criteria: gate.criteria, ...evidence[gate.id], confirmed: evidence[gate.id]?.confirmed ?? false, note: evidence[gate.id]?.note ?? "" })),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "learn-rust-career-evidence.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Đã tạo bản tải xuống.");
  }
  function confirmEvidence(id: string) {
    const note = evidence[id]?.note.trim() ?? "";
    if (note.length < 40) {
      setNotice("Bằng chứng cần ít nhất 40 ký tự để xác nhận.");
      document.getElementById(`${uid}-evidence-${id}`)?.focus();
      return;
    }
    hasChanges.current = true;
    setEvidence(previous => ({ ...previous, [id]: { note, confirmed: true } }));
    setNotice("Đã xác nhận bằng chứng.");
  }

  return <section className="career-page" aria-labelledby={`${uid}-title`}>
    <header className="career-heading">
      <h1 id={`${uid}-title`}>Phỏng vấn Rust</h1>
    </header>
    <div className="career-tabs" role="tablist" aria-label="Nội dung phỏng vấn">{tabs.map((item, index) => <button
      key={item.id} ref={node => { tabRefs.current[index] = node; }}
      type="button" role="tab" id={`${uid}-tab-${item.id}`} aria-controls={`${uid}-panel-${item.id}`}
      aria-selected={tab === item.id} tabIndex={tab === item.id ? 0 : -1}
      onClick={() => setTab(item.id)} onKeyDown={event => switchTab(event, index)}
    >{item.label}</button>)}</div>

    <section id={`${uid}-panel-roadmap`} role="tabpanel" aria-labelledby={`${uid}-tab-roadmap`} hidden={tab !== "roadmap"} tabIndex={0} className="career-panel">
      <div className="career-section-heading"><h2>Lộ trình Rust backend</h2></div>
      <div className="career-stages">{careerStages.map(stage => <article key={stage.id} className="career-stage">
        <div className="career-stage-heading"><h2>{stage.title}</h2><span>{stage.scope}</span></div>
        <p className="career-outcome">{stage.outcome}</p>
        <ul>{stage.tasks.map(task => <li key={task}>{task}</li>)}</ul>
        <div className="career-gate"><strong>Điều kiện chuyển bước</strong><p>{stage.gate}</p></div>
        <div className="career-stage-footer"><a className="text-link" href={`/bai-hoc/${stage.lesson}`}>Ôn bài nền tảng<ArrowUpRight size={14} aria-hidden="true" /></a><Sources sources={stage.sources} /></div>
      </article>)}</div>
    </section>

    <section id={`${uid}-panel-interview`} role="tabpanel" aria-labelledby={`${uid}-tab-interview`} hidden={tab !== "interview"} tabIndex={0} className="career-panel">
      <div className="career-filters">
        <label className="career-query"><Search size={16} aria-hidden="true" /><input aria-label="Tìm câu hỏi phỏng vấn" placeholder="Tìm ownership, timeout, SQL…" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <label className="career-category"><span className="sr-only">Nhóm câu hỏi</span><select aria-label="Nhóm câu hỏi" value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
      </div>
      <p className="career-result-count" role="status">{questions.length} câu hỏi{category !== "Tất cả" ? ` · ${category}` : ""}</p>
      <div className="career-question-list">{questions.map(question => <AnimatedDisclosure className="career-question" key={question.id}
        title={<><span className="career-question-number">{String(interviewQuestions.indexOf(question) + 1).padStart(2, "0")}</span><span>{question.question}<small>{question.category}</small></span><ChevronDown size={17} aria-hidden="true" /></>}>
        <div className="career-answer">
          <h3>Những ý cần giải thích</h3><ul>{question.answer.map(item => <li key={item}>{item}</li>)}</ul>
          <h3>Câu hỏi tiếp</h3><p>{question.followUp}</p>
          <h3>Điểm dễ nhầm</h3><p>{question.pitfall}</p>
          <Sources sources={[question.source]} />
        </div>
      </AnimatedDisclosure>)}</div>
      {!questions.length && <p className="career-empty">Không có câu phù hợp. Thử từ khóa ngắn hơn hoặc chọn tất cả nhóm.</p>}
      <AnimatedDisclosure className="career-rubric" title={<><span>Tự chấm câu trả lời</span><ChevronDown size={16} aria-hidden="true" /></>}><dl><div><dt>0 · Chưa giải thích được</dt><dd>Quay lại bài nền tảng, viết ví dụ nhỏ rồi thử trả lời lại.</dd></div><div><dt>1 · Hiểu khái niệm</dt><dd>Nêu đúng định nghĩa nhưng chưa đưa được ví dụ hoặc ca lỗi.</dd></div><div><dt>2 · Áp dụng được</dt><dd>Viết ví dụ đúng, giải thích lựa chọn và kiểm tra một trường hợp biên.</dd></div><div><dt>3 · Bảo vệ được thiết kế</dt><dd>So sánh phương án, nhận ra giới hạn và trả lời được câu hỏi tiếp.</dd></div></dl></AnimatedDisclosure>
    </section>

    <section id={`${uid}-panel-projects`} role="tabpanel" aria-labelledby={`${uid}-tab-projects`} hidden={tab !== "projects"} tabIndex={0} className="career-panel">
      <div className="career-section-heading"><h2>Dự án với Cargo</h2></div>
      <div className="career-project-list">{careerProjects.map((project, index) => <AnimatedDisclosure className="career-project" key={project.id}
        title={<><span className="career-question-number">{String(index + 1).padStart(2, "0")}</span><span>{project.title}<small>{project.description}</small></span><ChevronDown size={17} aria-hidden="true" /></>}>
        <div className="career-project-body"><p className="career-prerequisites"><strong>Kiến thức cần có:</strong> {project.prerequisites}</p>
          {project.starter && <a className="button button-secondary career-lab-link" href={project.starter} target="_blank" rel="noreferrer">Mở lab Task API và hướng dẫn<ArrowUpRight size={15} aria-hidden="true" /></a>}
          <h3>Cấu trúc gợi ý</h3><ul className="career-file-list">{project.files.map(file => <li key={file}>{file}</li>)}</ul>
          <h3>Các mốc thực hiện</h3><div className="career-milestones">{project.milestones.map(milestone => <section key={milestone.title}><h4>{milestone.title}</h4><ul>{milestone.tasks.map(task => <li key={task}>{task}</li>)}</ul></section>)}</div>
          <h3>Tiêu chí nghiệm thu</h3><ul>{project.acceptance.map(item => <li key={item}>{item}</li>)}</ul>
          <h3>Ca kiểm thử cần có</h3><ul>{project.tests.map(item => <li key={item}>{item}</li>)}</ul>
          <h3>Câu hỏi khi code review</h3><ul>{project.review.map(item => <li key={item}>{item}</li>)}</ul>
          <Sources sources={project.sources} />
        </div>
      </AnimatedDisclosure>)}</div>
    </section>

    <section id={`${uid}-panel-evidence`} role="tabpanel" aria-labelledby={`${uid}-tab-evidence`} hidden={tab !== "evidence"} tabIndex={0} className="career-panel">
      <div className="career-section-heading"><h2>Tự đánh giá</h2><p>Ghi kết quả và liên kết đến bài làm.</p></div>
      <div className="career-evidence-toolbar"><p><strong>{confirmed}/{readinessGates.length}</strong> tiêu chí đã xác nhận</p><button type="button" className="button button-secondary" onClick={exportEvidence}><Download size={15} aria-hidden="true" />Tải bằng chứng</button></div>
      {storageError && <p className="career-storage-error" role="alert">{storageError}</p>}
      {(!loaded || saveState === "saved") && <p className="career-save-state" role="status">{loaded ? "Đã lưu" : "Đang tải…"}</p>}
      <div className="career-evidence-list">{readinessGates.map((gate, index) => {
        const entry = evidence[gate.id] ?? { note: "", confirmed: false };
        return <section className="career-evidence-item" key={gate.id} aria-labelledby={`${uid}-gate-${gate.id}`}>
          <h3 id={`${uid}-gate-${gate.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{gate.title}{entry.confirmed && <Check size={17} aria-label="Đã xác nhận" />}</h3>
          <ul>{gate.criteria.map(criterion => <li key={criterion}>{criterion}</li>)}</ul>
          <label htmlFor={`${uid}-evidence-${gate.id}`}>Bằng chứng của bạn</label>
          <textarea id={`${uid}-evidence-${gate.id}`} value={entry.note} maxLength={6000} rows={3} placeholder={gate.example}
            aria-describedby={entry.confirmed ? undefined : `${uid}-hint-${gate.id}`} disabled={!loaded}
            onChange={event => { const note = event.target.value; hasChanges.current = true; setEvidence(previous => ({ ...previous, [gate.id]: { note, confirmed: false } })); setNotice(""); }} />
          <div className="career-evidence-actions">{!entry.confirmed && <p id={`${uid}-hint-${gate.id}`}>Tối thiểu 40 ký tự.</p>}
            <button type="button" className={`button ${entry.confirmed ? "button-secondary" : "button-primary"}`} disabled={!loaded || entry.confirmed} onClick={() => confirmEvidence(gate.id)}>{entry.confirmed ? <><Check size={14} aria-hidden="true" />Đã xác nhận</> : "Xác nhận bằng chứng"}</button>
          </div>
        </section>;
      })}</div>
      <p className="career-notice" role="status" aria-live="polite">{notice}</p>
    </section>
  </section>;
}
