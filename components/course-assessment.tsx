"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, RotateCcw } from "lucide-react";
import type { Specialization } from "@/src/data/specialization-types";
import type { Progress } from "./learning-shared";
import { assessmentSubmissionKey, projectCompletionKey, questionAnswerKey, scoreAssessment, reviewedProject } from "@/lib/course-assessment";
import { useCourse } from "./course-context";
import { AnimatedDisclosure } from "./animated-disclosure";

import "./specialization-views.css";
import "./course-learning.css";

export function CourseAssessmentView({ track, progress, onAnswer }: {
  track: Specialization;
  progress: Progress;
  onAnswer: (id: string, answer: number | null) => void;
}) {
  const { lessons } = useCourse();
  const firstQuestion = useRef<HTMLFieldSetElement>(null);
  const resultPanel = useRef<HTMLDivElement>(null);
  const focusResultOnSubmit = useRef(false);
  const assessment = track.assessment;
  const submissionId = assessment ? assessmentSubmissionKey(track.id, assessment) : "";
  const submitted = progress.quizzes[submissionId] === 1;
  useEffect(() => {
    if (submitted && focusResultOnSubmit.current) {
      focusResultOnSubmit.current = false;
      resultPanel.current?.focus({ preventScroll: true });
    }
  }, [submitted]);
  if (!assessment) return null;
  const score = scoreAssessment(assessment, progress.quizzes);
  const projects = track.projects ?? [];
  const projectDone = (id: string) => {
    const project = projects.find(item => item.id === id);
    return Boolean(project && progress.finishedProjects.includes(projectCompletionKey(project)) && reviewedProject(project, progress.quizzes));
  };
  const lessonCount = track.lessonIds.filter(id => progress.completed.includes(id)).length;
  const projectCount = projects.filter(project => projectDone(project.id)).length;
  const milestonesDone = submitted && score.passed && lessonCount === track.lessonIds.length && projectCount === projects.length;
  const answer = (id: string, value: number) => { if (submitted) onAnswer(submissionId, null); onAnswer(id, value); };
  const reset = () => {
    onAnswer(submissionId, null);
    for (const question of assessment.questions) onAnswer(questionAnswerKey(question), null);
    firstQuestion.current?.focus({ preventScroll: true });
    firstQuestion.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  };
  return <article className="course-assessment-page">
    <Link href={"/khoa-hoc/" + track.id} className="specialization-back"><ArrowLeft size={15} />{track.shortTitle}</Link>
    <header><h1>{assessment.title}</h1><p>{assessment.instructions}</p></header>
    <div className="course-assessment-result" role="status"><h2>{milestonesDone ? "Đã đạt các mốc tự đánh giá" : "Những mốc cần hoàn thành"}</h2><div className="course-skill-proof"><span>{lessonCount}/{track.lessonIds.length} bài học</span><span>{projectCount}/{projects.length} dự án tự nghiệm thu</span><span>{submitted ? "Bài kiểm tra: " + score.correct + "/" + score.total : "Bài kiểm tra: chưa nộp"}</span></div>{milestonesDone && <p>Dùng mã nguồn, kết quả kiểm thử và phần giải thích thiết kế để trao đổi kỹ thuật khi tham gia dự án tương tự.</p>}</div>
    <AnimatedDisclosure className="course-exam-part" defaultOpen title={<><span>Bài kiểm tra tình huống</span><ChevronDown size={18} /></>}>
      <p className="course-assessment-progress">{assessment.questions.length} câu · cần đạt {assessment.passPercent}% · đã trả lời {score.answered}/{score.total}</p>
      {assessment.questions.map((question, index) => {
        const answerId = questionAnswerKey(question);
        const selected = progress.quizzes[answerId];
        const correct = selected === question.correct;
        return <fieldset key={answerId} ref={index === 0 ? firstQuestion : undefined} className="course-exam-question" tabIndex={index === 0 ? -1 : undefined}>
          <legend>{index + 1}. {question.question}</legend>
          <div className="course-exam-options">{question.options.map((option, optionIndex) => <label key={optionIndex}><input type="radio" name={answerId} value={optionIndex} checked={selected === optionIndex} onChange={() => answer(answerId, optionIndex)} /><span>{option}</span></label>)}</div>
          {submitted && <div className="course-exam-explanation"><strong>{correct ? "Trả lời đúng" : "Cần ôn lại"}</strong><p>{question.explanation}</p>{question.lessonIds.map(id => <Link key={id} href={"/bai-hoc/" + id} prefetch={false}>{lessons.find(lesson => lesson.id === id)?.title ?? "Ôn bài học"}</Link>)}</div>}
        </fieldset>;
      })}
      <div className="course-assessment-actions"><button type="button" className="button button-primary" disabled={score.answered !== score.total || submitted} onClick={() => { focusResultOnSubmit.current = true; onAnswer(submissionId, 1); }}>{submitted ? "Đã xem kết quả" : "Kiểm tra kiến thức"}<ArrowRight size={16} /></button>{submitted && <button type="button" className="button button-secondary" onClick={reset}><RotateCcw size={15} />Làm lại</button>}</div>
      {submitted && <div ref={resultPanel} tabIndex={-1} className="course-assessment-result" role="status"><h2>{score.correct}/{score.total} câu đúng · {score.percent}%</h2><p>{score.passed ? "Đã đạt mốc kiến thức. Tiếp tục đối chiếu các sản phẩm thực hành bên dưới." : "Ôn những bài được gợi ý dưới câu trả lời, thử lại ví dụ và làm lại bài kiểm tra."}</p></div>}
    </AnimatedDisclosure>
    <section><h2>Đối chiếu năng lực thực hành</h2><div className="course-skill-grid">{assessment.skills.map(skill => {
      const completedLessons = skill.lessonIds.filter(id => progress.completed.includes(id)).length;
      const completedProjects = skill.projectIds.filter(projectDone).length;
      const complete = completedLessons === skill.lessonIds.length && completedProjects === skill.projectIds.length;
      return <article key={skill.id} className="course-skill"><h3>{complete && <Check size={15} aria-label="Đạt các mốc" />} {skill.title}</h3><p>{skill.description}</p><div className="course-skill-proof"><span>{completedLessons}/{skill.lessonIds.length} bài học</span><span>{completedProjects}/{skill.projectIds.length} dự án</span>{skill.required && <span>Năng lực cốt lõi</span>}</div><div className="course-skill-proof">{skill.lessonIds.filter(id => !progress.completed.includes(id)).slice(0, 2).map(id => <Link href={"/bai-hoc/" + id} prefetch={false} key={id}>{lessons.find(lesson => lesson.id === id)?.title ?? "Ôn bài"}</Link>)}{skill.projectIds.map(id => <Link key={id} href={"/du-an/" + id} prefetch={false}>{projects.find(project => project.id === id)?.title ?? "Mở dự án"}</Link>)}</div></article>;
    })}</div></section>
  </article>;
}
