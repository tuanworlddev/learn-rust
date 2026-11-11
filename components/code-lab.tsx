"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Play, RotateCcw, Copy, Download, Check, CheckCircle2, CircleAlert, Terminal, Lightbulb, Eye, LoaderCircle, ChevronRight, ChevronDown, Code2 } from "lucide-react";
import { CodeHighlight } from "./code-highlight";
import { AnimatedDisclosure } from "./animated-disclosure";
import "./code-lab.css";

type ExecutionResult = {
  success: boolean;
  stdout: string;
  stderr: string;
  elapsedMs: number;
  error?: string;
};

export type CodeLabProps = {
  initialCode: string;
  storageKey: string;
  expectedOutput?: string;
  onPass?: () => void;
  title?: string;
  solutionCode?: string;
  hints?: string[];
  checkLabel?: string;
};

export function CodeLab({ initialCode, storageKey, expectedOutput, onPass, title = "main.rs", solutionCode, hints = [], checkLabel = "Kiểm tra bài làm" }: CodeLabProps) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [busy, setBusy] = useState<"run" | "check" | null>(null);
  const [verdict, setVerdict] = useState<"pass" | "fail" | null>(null);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [editorFocused, setEditorFocused] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const highlight = useRef<HTMLPreElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const latestCode = useRef(code);
  const requestId = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);
  const keyRef = useRef(storageKey);
  const releaseTab = useRef(false);
  const editorId = useId();
  const hasCheck = expectedOutput !== undefined;
  const dirty = lastCode !== null && lastCode !== code;
  const lineCount = code.split("\n").length;

  useEffect(() => {
    requestId.current += 1;
    activeRequest.current?.abort();
    keyRef.current = storageKey;
    let next = initialCode;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) next = stored;
      // Restore the selected exercise draft after SSR and reset its transient editor state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
    setCode(next);
    latestCode.current = next;
    setResult(null);
    setBusy(null);
    setVerdict(null);
    setLastCode(null);
    setHintCount(0);
    setShowSolution(false);
    setResetRequested(false);
    setFeedback("");
    if (textarea.current) {
      textarea.current.scrollTop = 0;
      textarea.current.scrollLeft = 0;
    }
    if (highlight.current) highlight.current.style.transform = "translate(0px, 0px)";
    if (gutter.current) gutter.current.style.transform = "translateY(0px)";
    return () => { requestId.current += 1; activeRequest.current?.abort(); };
  }, [storageKey, initialCode]);

  function changeCode(next: string) {
    setCode(next);
    latestCode.current = next;
    setVerdict(null);
    setFeedback("");
    try {
      localStorage.setItem(keyRef.current, next);
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }

  async function execute(check = false) {
    if (busy || !latestCode.current.trim()) return;
    const submittedCode = latestCode.current;
    const id = ++requestId.current;
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), 32_000);
    setBusy(check ? "check" : "run");
    setVerdict(null);
    setResult(null);
    setFeedback("");
    setLastCode(submittedCode);
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: submittedCode }),
        signal: controller.signal,
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) throw new Error("invalid-response");
      const data = await response.json() as ExecutionResult;
      if (typeof data.success !== "boolean") throw new Error("invalid-response");
      if (id !== requestId.current) return;
      const safeResult: ExecutionResult = {
        success: data.success,
        stdout: typeof data.stdout === "string" ? data.stdout : "",
        stderr: typeof data.stderr === "string" ? data.stderr : "",
        elapsedMs: typeof data.elapsedMs === "number" ? data.elapsedMs : 0,
        error: typeof data.error === "string" ? data.error : undefined,
      };
      setResult(safeResult);
      if (check && expectedOutput !== undefined && latestCode.current === submittedCode && !safeResult.error) {
        const passed = safeResult.success && safeResult.stdout.trim() === expectedOutput.trim();
        setVerdict(passed ? "pass" : "fail");
        if (passed) onPass?.();
      }
    } catch {
      if (id !== requestId.current) return;
      setResult({
        success: false, stdout: "", stderr: "", elapsedMs: 0,
        error: controller.signal.aborted
          ? "Quá thời gian chờ. Hãy chạy lại."
          : "Chưa kết nối được trình biên dịch. Hãy kiểm tra kết nối mạng rồi thử lại.",
      });
    } finally {
      clearTimeout(timeout);
      if (id === requestId.current) setBusy(null);
    }
  }

  function editorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape") {
      releaseTab.current = true;
      setFeedback("Nhấn Tab để rời trình soạn thảo.");
      return;
    }
    if (event.key === "Tab" && releaseTab.current) {
      releaseTab.current = false;
      return;
    }
    releaseTab.current = false;
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      void execute(false);
      return;
    }
    if (event.key !== "Tab") return;
    event.preventDefault();
    const target = event.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const value = latestCode.current;
    if (event.shiftKey) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = value.indexOf("\n", end);
      const selectionEnd = lineEnd === -1 ? value.length : lineEnd;
      const block = value.slice(lineStart, selectionEnd);
      const trimmed = block.split("\n").map(line => line.replace(/^( {1,4}|\t)/, "")).join("\n");
      const firstRemoved = block.split("\n")[0].length - trimmed.split("\n")[0].length;
      const totalRemoved = block.length - trimmed.length;
      changeCode(value.slice(0, lineStart) + trimmed + value.slice(selectionEnd));
      requestAnimationFrame(() => target.setSelectionRange(Math.max(lineStart, start - firstRemoved), Math.max(lineStart, end - totalRemoved)));
    } else if (start !== end && value.slice(start, end).includes("\n")) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const block = value.slice(lineStart, end);
      const indented = block.split("\n").map(line => "    " + line).join("\n");
      changeCode(value.slice(0, lineStart) + indented + value.slice(end));
      requestAnimationFrame(() => target.setSelectionRange(start + 4, end + (indented.length - block.length)));
    } else {
      changeCode(value.slice(0, start) + "    " + value.slice(end));
      requestAnimationFrame(() => target.setSelectionRange(start + 4, start + 4));
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      textarea.current?.focus();
      textarea.current?.select();
      setFeedback("Mã đã được chọn. Nhấn Ctrl+C hoặc ⌘C để sao chép.");
    }
  }

  function downloadCode() {
    const url = URL.createObjectURL(new Blob([code], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "main.rs";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback("Đã tải xuống main.rs.");
  }

  function resetCode() {
    changeCode(initialCode);
    setResult(null);
    setLastCode(null);
    setResetRequested(false);
    setFeedback("Đã khôi phục mã ban đầu.");
  }

  return (
    <section className="code-lab" aria-label="Khu vực thực hành Rust">
      <div className="cl-editor-shell">
        <div className="cl-toolbar">
          <div className="cl-file-tab"><Code2 size={15} /><span>{title}</span></div>
          <div className="cl-editor-tools">
            <span className="cl-edition">Rust 2024</span>
            <button type="button" onClick={copyCode} className="cl-icon-button transition-colors duration-150 motion-reduce:transition-none" aria-label={copied ? "Đã sao chép mã" : "Sao chép mã"} title="Sao chép mã">{copied ? <Check size={15} /> : <Copy size={15} />}</button>
            <button type="button" onClick={downloadCode} className="cl-icon-button transition-colors duration-150 motion-reduce:transition-none" aria-label="Tải xuống main.rs" title="Tải mã .rs"><Download size={15} /></button>
            <button type="button" onClick={() => setResetRequested(!resetRequested)} disabled={!!busy} className="cl-icon-button transition-colors duration-150 motion-reduce:transition-none" aria-label="Khôi phục mã ban đầu" title="Khôi phục mã"><RotateCcw size={15} /></button>
          </div>
        </div>
        {resetRequested && <div className="cl-confirm animate-[cl-reveal_150ms_ease-out] motion-reduce:animate-none"><span>Thay bản nháp bằng mã ban đầu?</span><button type="button" className="transition-colors duration-150 motion-reduce:transition-none" onClick={resetCode}>Khôi phục</button><button type="button" className="transition-colors duration-150 motion-reduce:transition-none" onClick={() => setResetRequested(false)}>Hủy</button></div>}
        <div className={`cl-editor ${editorFocused ? "cl-editor-focus" : ""}`}>
          <div className="cl-gutter-clip" aria-hidden="true"><div className="cl-gutter" ref={gutter}>{Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}</div></div>
          <div className="cl-code-clip" aria-hidden="true"><pre ref={highlight}><CodeHighlight code={code + "\n"} /></pre></div>
          <label className="cl-sr-only" htmlFor={editorId}>Mã Rust</label>
          <textarea id={editorId} ref={textarea} value={code} onChange={event => changeCode(event.target.value)} onKeyDown={editorKeyDown} onFocus={() => setEditorFocused(true)} onBlur={() => setEditorFocused(false)} onScroll={event => {
            const { scrollTop, scrollLeft } = event.currentTarget;
            if (highlight.current) highlight.current.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
            if (gutter.current) gutter.current.style.transform = `translateY(${-scrollTop}px)`;
          }} spellCheck={false} autoCapitalize="off" autoCorrect="off" aria-describedby={`${editorId}-keyboard`} wrap="off" className="cl-textarea" />
        </div>
        <p id={`${editorId}-keyboard`} className={editorFocused ? "cl-keyboard-help" : "cl-sr-only"}>Tab: thụt lề · Esc rồi Tab: rời trình soạn thảo · Ctrl/⌘ + Enter: chạy</p>
        <div className="cl-actions">
          <button type="button" onClick={() => void execute(false)} disabled={!!busy || !code.trim()} className="cl-run-button transition-[background-color,filter] duration-150 motion-reduce:transition-none" title="Chạy mã (Ctrl/⌘ + Enter)">{busy === "run" ? <LoaderCircle size={16} className="cl-spin" /> : <Play size={15} fill="currentColor" />}<span>{busy === "run" ? "Đang biên dịch…" : "Chạy mã"}</span></button>
          {hasCheck && <button type="button" onClick={() => void execute(true)} disabled={!!busy || !code.trim()} className="cl-check-button transition-colors duration-150 motion-reduce:transition-none">{busy === "check" ? <LoaderCircle size={16} className="cl-spin" /> : <CheckCircle2 size={16} />}{busy === "check" ? "Đang kiểm tra…" : checkLabel}</button>}
          {!storageAvailable && <span className="cl-save-state cl-save-unavailable" role="status"><CircleAlert size={13} />Không lưu được bản nháp</span>}
        </div>
        <div className="cl-terminal">
          <div className="cl-terminal-title"><span><Terminal size={14} /> Kết quả</span><span>{result && !result.error ? `${(result.elapsedMs / 1000).toFixed(2)} giây` : ""}</span></div>
          <div className="cl-output" aria-live="polite" aria-atomic="true">
            {!result && !busy && <p className="cl-output-empty">Chạy mã để xem kết quả.</p>}
            {busy && <p className="cl-output-empty"><LoaderCircle size={16} className="cl-spin" /> Đang biên dịch…</p>}
            {result?.error && <div className="cl-service-error"><p><CircleAlert size={16} /> {result.error}</p><button type="button" onClick={() => execute()} disabled={busy !== null}>Thử lại</button></div>}
            {result && !result.error && <>
              {result.stdout && <pre className="cl-stdout">{result.stdout}</pre>}
              {!result.success && <><p className="cl-compile-error"><CircleAlert size={15} /> Chương trình còn lỗi.</p><pre className="cl-stderr">{result.stderr || "Chương trình kết thúc với lỗi nhưng không có thông báo chi tiết."}</pre></>}
              {result.success && !result.stdout && <p className="cl-no-output">Chương trình chạy thành công, không có đầu ra.</p>}
              {result.success && result.stderr && <AnimatedDisclosure className="cl-diagnostics" title={<><span>Thông tin biên dịch</span><ChevronDown size={13} /></>}><pre>{result.stderr}</pre></AnimatedDisclosure>}
              {result.success && !hasCheck && <div className="cl-run-ok"><CheckCircle2 size={14} /> Chạy thành công</div>}
            </>}
            {dirty && !busy && <p className="cl-dirty">Mã đã thay đổi. Cần chạy lại.</p>}
          </div>
        </div>
      </div>
      {verdict === "pass" && !dirty && <div className="cl-verdict cl-pass animate-[cl-reveal_150ms_ease-out] motion-reduce:animate-none" role="status"><CheckCircle2 size={17} /><strong>Đã vượt qua kiểm tra mẫu.</strong></div>}
      {verdict === "fail" && !dirty && <div className="cl-verdict cl-fail animate-[cl-reveal_150ms_ease-out] motion-reduce:animate-none" role="status"><CircleAlert size={17} /><div><strong>{result?.success ? "Đầu ra chưa khớp." : "Hãy sửa lỗi chương trình."}</strong><p>Đầu ra mong đợi:</p><pre>{expectedOutput || "(Không có đầu ra)"}</pre></div></div>}
      {(hints.length > 0 || solutionCode) && <div className="cl-learning-tools">
        {hints.length > 0 && <button type="button" className="transition-colors duration-150 motion-reduce:transition-none" onClick={() => setHintCount(Math.min(hintCount + 1, hints.length))} disabled={hintCount >= hints.length}><Lightbulb size={15} />{`Gợi ý (${hintCount}/${hints.length})`}</button>}
        {solutionCode && <button type="button" aria-expanded={showSolution} aria-controls={`${editorId}-solution`} className="transition-colors duration-150 motion-reduce:transition-none" onClick={() => setShowSolution(!showSolution)}><Eye size={15} />{showSolution ? "Ẩn lời giải" : "Xem lời giải"}</button>}
      </div>}
      {hintCount > 0 && <div className="cl-hints animate-[cl-reveal_150ms_ease-out] motion-reduce:animate-none">{hints.slice(0, hintCount).map((hint, i) => <p key={i}><strong>Gợi ý {i + 1}.</strong> {hint}</p>)}</div>}
      {solutionCode && <div className="disclosure cl-solution-disclosure" data-open={showSolution}><div id={`${editorId}-solution`} className="disclosure-panel" aria-hidden={!showSolution} inert={!showSolution}><div className="disclosure-content"><div className="cl-solution"><div><strong>Lời giải tham khảo</strong><button type="button" className="transition-colors duration-150 motion-reduce:transition-none" disabled={!!busy} onClick={() => { changeCode(solutionCode); setShowSolution(false); textarea.current?.focus({ preventScroll: true }); setFeedback("Đã chèn lời giải."); }}>Dùng lời giải <ChevronRight size={14} /></button></div><pre><CodeHighlight code={solutionCode} /></pre></div></div></div></div>}
      {feedback && <p className="cl-feedback" role="status">{feedback}</p>}
    </section>
  );
}

export default CodeLab;
