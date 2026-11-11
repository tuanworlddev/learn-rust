"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Download } from "lucide-react";
import type { Specialization, TrackProject } from "@/src/data/specialization-types";
import type { Progress } from "./learning-shared";
import { projectCompletionKey, projectCriterionKey, reviewedProject } from "@/lib/course-assessment";
import { AnimatedDisclosure } from "./animated-disclosure";

export function CourseProjectView({ track, project, progress, onAnswer, onComplete }: {
  track: Specialization;
  project: TrackProject;
  progress: Progress;
  onAnswer: (id: string, answer: number | null) => void;
  onComplete: (id: string, complete: boolean) => void;
}) {
  const completionId = projectCompletionKey(project);
  const reviewed = reviewedProject(project, progress.quizzes);
  const done = progress.finishedProjects.includes(completionId) && reviewed;
  const reviewedCount = project.rubric.filter(item => progress.quizzes[projectCriterionKey(project, item.id)] === 1).length;
  return <article className="course-project-page">
    <Link href={"/khoa-hoc/" + track.id} className="specialization-back"><ArrowLeft size={15} />{track.shortTitle}</Link>
    <header><p className="specialization-kicker">{project.level === "guided" ? "Dự án có hướng dẫn" : project.level === "independent" ? "Dự án tự triển khai" : "Dự án cuối khóa"} · {project.estimatedHours} giờ thực hành</p><h1>{project.title}</h1><p>{project.description}</p></header>
    <div className="course-project-actions"><a className="button button-primary" href={"/api/lessons/" + project.labLessonId + "/lab"} download={project.labLessonId + ".zip"}><Download size={16} />Tải dự án</a><Link className="text-link" href={"/bai-hoc/" + project.labLessonId} prefetch={false}>Mở bài hướng dẫn<ArrowRight size={15} /></Link></div>
    <nav className="course-section-nav" aria-label="Các phần của dự án"><a href="#project-requirements">Yêu cầu</a><a href="#project-milestones">Thực hiện</a><a href="#project-review">Nghiệm thu</a></nav>
    <section id="project-requirements" className="course-projects-section"><h2>Yêu cầu sản phẩm</h2><ul>{project.requirements.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section id="project-milestones" className="course-projects-section"><h2>Các bước thực hiện</h2>{project.milestones.map((milestone, index) => <AnimatedDisclosure key={milestone.title} className="course-chapter" defaultOpen={index === 0} title={<><span className="course-chapter-index">{index + 1}</span><span>{milestone.title}</span><ChevronDown size={16} /></>}><div className="course-project-milestone-body"><ul>{milestone.tasks.map(task => <li key={task}>{task}</li>)}</ul><p><strong>Hoàn thành khi: </strong>{milestone.acceptance}</p></div></AnimatedDisclosure>)}</section>
    <section className="course-projects-section"><h2>Tình huống phải kiểm thử</h2><div className="course-test-cases">{project.testCases.map(test => <article className="course-test-case" key={test.name}><h3>{test.name}</h3><p>{test.setup}</p><p><strong>Kết quả cần đạt: </strong>{test.expected}</p></article>)}</div></section>
    <section className="course-projects-section"><h2>Sản phẩm bàn giao</h2><ul>{project.deliverables.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section id="project-review" className="course-projects-section"><h2>Tự nghiệm thu dự án</h2><p className="course-evidence-intro">Chỉ đánh dấu khi bạn đã chạy kiểm thử và có sản phẩm đáp ứng tiêu chí.</p>
      <div className="course-rubric">{project.rubric.map(item => {
        const answerId = projectCriterionKey(project, item.id);
        return <div key={item.id} className="course-rubric-item"><label><input type="checkbox" checked={progress.quizzes[answerId] === 1} onChange={event => { onAnswer(answerId, event.target.checked ? 1 : null); if (!event.target.checked) onComplete(completionId, false); }} /><span>{item.title}</span></label><ul>{item.criteria.map(criterion => <li key={criterion}>{criterion}</li>)}</ul></div>;
      })}</div>
      <div className="course-project-review-action"><button type="button" className={"button " + (done ? "button-secondary" : "button-primary")} disabled={!reviewed} aria-pressed={done} onClick={() => onComplete(completionId, !done)}><CheckCircle2 size={16} />{done ? "Đã tự nghiệm thu" : "Hoàn thành nghiệm thu"}</button><span role="status">{reviewedCount}/{project.rubric.length} tiêu chí</span></div>
    </section>
    <div className="course-assessment-callout"><Link href={"/khoa-hoc/" + track.id} className="text-link"><ArrowLeft size={15} />Trở về khóa học</Link>{track.assessment && <Link href={"/khoa-hoc/" + track.id + "/danh-gia"} className="text-link">Đánh giá năng lực<ArrowRight size={15} /></Link>}</div>
  </article>;
}
