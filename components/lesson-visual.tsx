"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import type { Lesson } from "@/src/data/curriculum";
import "./lesson-visual.css";

function OwnershipVisual() {
  const [moved, setMoved] = useState(false);
  return <figure className="lesson-visual"><figcaption>Quan sát một lần move</figcaption><div className="ownership-scene" aria-live="polite"><div className={`memory-variable ${moved ? "memory-inactive" : "memory-active"}`}><code>s1</code><span>{moved ? "Không còn dùng được" : "Sở hữu String"}</span></div><div className="memory-data"><span>Vùng dữ liệu</span><code>R u s t</code><small>Chủ sở hữu: {moved ? "s2" : "s1"}</small></div><div className={`memory-variable ${moved ? "memory-active" : "memory-inactive"}`}><code>s2</code><span>{moved ? "Sở hữu String" : "Chưa được gán"}</span></div></div><div className="visual-action"><code>{moved ? 'let s2 = s1;' : 'let s1 = String::from("Rust");'}</code><button type="button" onClick={() => setMoved(!moved)}>{moved ? <RotateCcw size={14} /> : <ArrowRight size={14} />}{moved ? "Thử lại" : "Chuyển sang s2"}</button></div><p>Dữ liệu trên heap không được clone. Sau phép gán, chỉ s2 chịu trách nhiệm giải phóng String.</p></figure>;
}

function BorrowingVisual() {
  const [writing, setWriting] = useState(false);
  return <figure className="lesson-visual"><figcaption>Hai cách mượn dữ liệu</figcaption><div className="visual-segmented" role="group" aria-label="Chế độ mượn"><button type="button" aria-pressed={!writing} onClick={() => setWriting(false)}>Mượn để đọc</button><button type="button" aria-pressed={writing} onClick={() => setWriting(true)}>Mượn để sửa</button></div><div className="borrow-scene" aria-live="polite"><div className="memory-data"><code>String</code><small>Chủ sở hữu vẫn giữ dữ liệu</small></div><ArrowDown size={22} /><div className="borrow-readers">{writing ? <code className="memory-active">&amp;mut String</code> : <><code>&amp;String</code><code>&amp;String</code></>}</div><p>{writing ? "Một tham chiếu mutable đang được dùng: không dùng đồng thời tham chiếu khác đến cùng dữ liệu." : "Nhiều tham chiếu shared có thể cùng đọc; không thay đổi dữ liệu qua các tham chiếu này."}</p></div></figure>;
}

function ResultVisual() {
  const [sample, setSample] = useState("42");
  const value = Number(sample);
  const valid = /^\+?\d+$/.test(sample) && Number.isSafeInteger(value) && value >= 0 && value <= 4294967295;
  return <figure className="lesson-visual"><figcaption>Result giữ cả hai khả năng</figcaption><div className="result-samples" role="group" aria-label="Dữ liệu để parse">{["42", "abc", "-3"].map(item => <button type="button" key={item} aria-pressed={sample === item} onClick={() => setSample(item)}><code>&quot;{item}&quot;</code></button>)}</div><div className="result-flow" aria-live="polite"><code>parse::&lt;u32&gt;()</code><ArrowDown size={20} /><div className={`result-branch ${valid ? "result-ok" : "result-error"}`}><code>{valid ? `Ok(${value})` : "Err(ParseIntError)"}</code><span>{valid ? "Tiếp tục với giá trị" : "Xử lý dữ liệu không hợp lệ"}</span></div></div><p>match buộc bạn xét kết quả thành công và thất bại. Dữ liệu sai không nhất thiết làm chương trình dừng.</p></figure>;
}

function AsyncVisual() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Executor gọi poll", detail: "Future được hỏi đã có kết quả chưa. Một future chưa được poll chưa tiến triển chỉ vì đã được tạo." },
    { title: "Future trả Pending", detail: "I/O chưa sẵn sàng. Future đăng ký Waker; executor có thể chạy task khác thay vì chặn thread để chờ." },
    { title: "Sự kiện đánh thức task", detail: "Khi có khả năng tiến triển, Waker báo executor nên poll lại. Wake chưa có nghĩa là kết quả đã sẵn sàng." },
    { title: "Poll lại → Ready", detail: "Trong ví dụ này I/O đã xong. Future trả giá trị và task tiếp tục sau .await; không poll future đã hoàn thành nữa." },
  ];
  return <figure className="lesson-visual"><figcaption>Một vòng đời Future</figcaption><ol className="async-steps">{steps.map((item, index) => <li key={item.title} aria-current={step === index ? "step" : undefined}><span>{index + 1}</span>{item.title}</li>)}</ol><p aria-live="polite">{steps[step].detail}</p><div className="visual-action"><span>{step + 1} / {steps.length}</span><button type="button" onClick={() => setStep((step + 1) % steps.length)}>{step === steps.length - 1 ? "Xem lại" : "Bước tiếp"}<ArrowRight size={14} /></button></div></figure>;
}

export function LessonVisual({ lesson }: { lesson: Lesson }) {
  if (lesson.illustration) return <figure className="lesson-illustration">
    {/* Content may refer to a published Supabase Storage asset as well as local images. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={lesson.illustration.src} alt={lesson.illustration.alt} width={lesson.illustration.src.endsWith("backend-service.webp") ? 1752 : 1672} height={lesson.illustration.src.endsWith("backend-service.webp") ? 897 : 941} loading="lazy" decoding="async" />
    <figcaption>{lesson.illustration.caption}</figcaption>
  </figure>;
  if (lesson.id === "ownership") return <OwnershipVisual />;
  if (lesson.id === "borrowing") return <BorrowingVisual />;
  if (lesson.id === "result") return <ResultVisual />;
  if (["async-await", "futures-poll", "async-runtime"].includes(lesson.id)) return <AsyncVisual />;
  return null;
}
