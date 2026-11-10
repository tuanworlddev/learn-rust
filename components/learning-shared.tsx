"use client";
import type { ReactNode } from "react";
import { BookOpen, Braces, Briefcase, Code2, Compass, FolderCode, BookMarked, Rocket, ShieldCheck, Terminal, Zap } from "lucide-react";
export type Progress = { completed: string[]; solved: string[]; bookmarks: string[]; quizzes: Record<string, number>; lastLesson: string | null; goal: number; minutes: Record<string, number>; notes: string; finishedProjects: string[] };
export const initialProgress: Progress = { completed: [], solved: [], bookmarks: [], quizzes: {}, lastLesson: null, goal: 30, minutes: {}, notes: "", finishedProjects: [] };
export const moduleIcons = [Terminal, ShieldCheck, Braces, FolderCode, Zap, Rocket];
export const navItems = [{ id: "lo-trinh", label: "Bài học", icon: BookOpen }, { id: "thuc-hanh", label: "Thực hành", icon: Code2 }, { id: "du-an", label: "Dự án", icon: FolderCode }, { id: "di-lam", label: "Đi làm", icon: Briefcase }, { id: "so-tay", label: "Sổ tay", icon: BookMarked }];
export const todayKey = () => new Intl.DateTimeFormat("sv-SE").format(new Date());
export function Brand() { return <span className="brand"><span className="brand-mark" aria-hidden="true">R</span><span>Learn Rust</span></span>; }
export function Tag({children,tone="neutral"}:{children:ReactNode;tone?:string}) { return <span className={`tag tag-${tone}`}>{children}</span>; }
export function EmptyState({title,children}:{title:string;children:ReactNode}) { return <div className="empty-state"><BookOpen size={30}/><h3>{title}</h3><p>{children}</p></div>; }
export function PageHeading({title,description,children}:{eyebrow?:string;title:string;description?:string;children?:ReactNode}) { return <div className="page-heading"><div><h1>{title}</h1>{description&&<p>{description}</p>}</div>{children}</div>; }
