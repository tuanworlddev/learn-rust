"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useCourse } from "./course-context";
import { useLearningState } from "./learning-state";
import { EmptyState, navItems } from "./learning-shared";
import type { LessonSummary } from "@/lib/course-types";

const CoursesView = dynamic(() => import("./specialization-views").then(module => module.CoursesView));
const SpecializationView = dynamic(() => import("./specialization-views").then(module => module.SpecializationView));
const Roadmap = dynamic(() => import("./learning-dashboard").then(module => module.Roadmap));
const LessonView = dynamic(() => import("./learning-views").then(module => module.LessonView));
const Notebook = dynamic(() => import("./learning-views").then(module => module.Notebook));
const Playground = dynamic(() => import("./learning-views").then(module => module.Playground));
const ProjectWorkspace = dynamic(() => import("./learning-views").then(module => module.ProjectWorkspace));
const CourseProjectView = dynamic(() => import("./course-project").then(module => module.CourseProjectView));
const CourseAssessmentView = dynamic(() => import("./course-assessment").then(module => module.CourseAssessmentView));
const CourseProjectsIndex = dynamic(() => import("./course-projects-index").then(module => module.CourseProjectsIndex));
const CareerHub = dynamic(() => import("./career-hub"));

/** Only the route's content changes; learner state and navigation live in the layout. */
export default function LearningContent({ route }: { route: string }) {
  const { lessons, specializations, currentLesson, currentTrack, currentProject, foundationProject } = useCourse();
  const { progress, setProgress, setToast, go, visitLesson, openLesson, bookmark } = useLearningState();
  const lessonsById = useMemo(() => new Map(lessons.map(lesson => [lesson.id, lesson])), [lessons]);
  const foundationLessons = useMemo(() => lessons.filter(lesson => !lesson.moduleId.startsWith("track-")), [lessons]);
  const lastLesson = lessonsById.get(progress.lastLesson ?? "");
  const lastTrack = specializations.find(track => track.lessonIds.includes(lastLesson?.id ?? ""));
  const resumePath = lastTrack ? lastTrack.lessonIds.flatMap(id => {
    const lesson = lessonsById.get(id);
    return lesson ? [lesson] : [];
  }) : foundationLessons;
  const lastIndex = resumePath.findIndex(lesson => lesson.id === lastLesson?.id);
  const unfinished = (lesson: LessonSummary) => !progress.completed.includes(lesson.id);
  const resume = lastLesson && unfinished(lastLesson) ? lastLesson :
    resumePath.slice(lastIndex + 1).find(unfinished) || resumePath.find(unfinished) || resumePath[0] || lessons[0];
  const foundationResume = foundationLessons.find(lesson => lesson.id === progress.lastLesson && unfinished(lesson)) ||
    foundationLessons.find(unfinished) || foundationLessons[0];
  const lessonTrack = currentLesson ? specializations.find(track => track.lessonIds.includes(currentLesson.id)) : undefined;
  const isFoundation = route === "khoa-hoc/nen-tang";
  const updateAnswer = (id: string, answer: number | null) => setProgress(previous => {
    const quizzes = { ...previous.quizzes };
    if (answer === null) delete quizzes[id];
    else quizzes[id] = answer;
    return { ...previous, quizzes };
  });
  const updateProject = (id: string, complete: boolean) => setProgress(previous => ({
    ...previous,
    finishedProjects: complete ? [...new Set([...previous.finishedProjects, id])] :
      previous.finishedProjects.filter(item => item !== id),
  }));

  return <>
    {route === "lo-trinh" && <CoursesView progress={progress} resume={resume} />}
    {isFoundation && <Roadmap progress={progress} resume={foundationResume} initialModule={null} onLesson={openLesson} onVisit={visitLesson} onBookmark={bookmark} />}
    {currentLesson && <LessonView key={currentLesson.id} lesson={currentLesson} progress={progress}
      onBookmark={() => bookmark(currentLesson.id)}
      onQuiz={answer => setProgress(previous => ({ ...previous, quizzes: { ...previous.quizzes, [currentLesson.id]: answer } }))}
      onPass={() => setProgress(previous => ({ ...previous, solved: [...new Set([...previous.solved, currentLesson.id])] }))}
      onComplete={() => {
        setProgress(previous => ({ ...previous, completed: [...new Set([...previous.completed, currentLesson.id])] }));
        setToast("Đã hoàn thành bài học.");
      }}
      onNavigate={openLesson} onBack={() => go(lessonTrack ? "khoa-hoc/" + lessonTrack.id : "khoa-hoc/nen-tang")} />}
    {currentTrack && route === "khoa-hoc/" + currentTrack.id && <SpecializationView track={currentTrack} progress={progress} />}
    {currentTrack && route === "khoa-hoc/" + currentTrack.id + "/danh-gia" && <CourseAssessmentView track={currentTrack} progress={progress} onAnswer={updateAnswer} />}
    {currentTrack && currentProject && <CourseProjectView track={currentTrack} project={currentProject} progress={progress} onAnswer={updateAnswer} onComplete={updateProject} />}
    {route === "thuc-hanh" && <Playground go={go} />}
    {route === "phong-van" && <CareerHub />}
    {route === "du-an" && <CourseProjectsIndex progress={progress} />}
    {foundationProject && <ProjectWorkspace project={foundationProject} progress={progress} go={go}
      onPass={() => setProgress(previous => ({ ...previous, finishedProjects: [...new Set([...previous.finishedProjects, foundationProject.id])] }))} />}
    {route === "so-tay" && <Notebook progress={progress} onLesson={openLesson} onBookmark={bookmark} onNotes={notes => setProgress(previous => ({ ...previous, notes }))} />}
    {!navItems.some(item => item.id === route) && !currentLesson && !foundationProject && !currentTrack && !isFoundation &&
      <EmptyState title="Không tìm thấy bài học"><button className="text-link" onClick={() => go("lo-trinh")}>Mở bài học</button></EmptyState>}
  </>;
}
