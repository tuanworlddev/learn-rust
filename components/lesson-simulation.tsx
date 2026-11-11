"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import type { LessonSimulation as SimulationData } from "@/src/data/specialization-types";
import "./lesson-simulation.css";

export function LessonSimulation({ simulation }: { simulation: SimulationData }) {
  const uid = useId();
  const root = useRef<HTMLElement>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scenario = simulation.scenarios[scenarioIndex];
  const step = scenario.steps[stepIndex];

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) setPlaying(false);
    });
    if (root.current) observer.observe(root.current);
    return () => { document.removeEventListener("visibilitychange", pauseWhenHidden); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!playing || stepIndex >= scenario.steps.length - 1) return;
    const timer = setTimeout(() => {
      setStepIndex(stepIndex + 1);
      if (stepIndex >= scenario.steps.length - 2) setPlaying(false);
    }, 2600);
    return () => clearTimeout(timer);
  }, [playing, stepIndex, scenario.steps.length]);

  function selectStep(index: number) { setPlaying(false); setStepIndex(index); }
  function togglePlay() {
    if (playing) { setPlaying(false); return; }
    if (stepIndex === scenario.steps.length - 1) setStepIndex(0);
    setPlaying(true);
  }

  return <figure ref={root} className={"lesson-simulation simulation-" + simulation.kind} aria-labelledby={uid + "-title"}>
    <figcaption><strong id={uid + "-title"}>{simulation.title}</strong><p>{simulation.description}</p></figcaption>
    <div className="simulation-scenarios" role="group" aria-label="Chọn tình huống">
      {simulation.scenarios.map((item, index) => <button key={item.id} type="button"
        aria-pressed={index === scenarioIndex} onClick={() => { setPlaying(false); setScenarioIndex(index); setStepIndex(0); }}>
        {item.label}
      </button>)}
    </div>
    <div className="simulation-nodes" aria-label="Các thành phần">
      {simulation.nodes.map((node, index) => <div key={node.id}
        className={"simulation-node " + (step.activeNodeIds.includes(node.id) ? "is-active" : "")}>
        <span className="simulation-node-index" aria-hidden="true">{index + 1}</span>
        <strong>{node.label}</strong><small>{node.detail}</small>
        {step.activeNodeIds.includes(node.id) && <span className="sr-only">Đang xử lý</span>}
      </div>)}
    </div>
    <div className="simulation-trace" aria-live={playing ? "off" : "polite"} aria-atomic="true">
      <span className="simulation-step-label">Bước {stepIndex + 1}/{scenario.steps.length}</span>
      <h3>{step.title}</h3><p>{step.description}</p>
      <dl>{step.values.map((value, index) => <div key={value.label + index}><dt>{value.label}</dt><dd>{value.value}</dd></div>)}</dl>
    </div>
    <div className="simulation-controls">
      <button type="button" className="simulation-play" onClick={togglePlay} aria-label={playing ? "Tạm dừng mô phỏng" : "Chạy mô phỏng"}>
        {playing ? <Pause size={15} /> : <Play size={15} />}{playing ? "Tạm dừng" : "Chạy"}
      </button>
      <div className="simulation-step-controls">
        <button type="button" disabled={stepIndex === 0} onClick={() => selectStep(stepIndex - 1)} aria-label="Bước trước"><ChevronLeft size={17} /></button>
        <span>{stepIndex + 1} / {scenario.steps.length}</span>
        <button type="button" disabled={stepIndex === scenario.steps.length - 1} onClick={() => selectStep(stepIndex + 1)} aria-label="Bước tiếp"><ChevronRight size={17} /></button>
      </div>
      <button type="button" onClick={() => selectStep(0)} aria-label="Đặt lại mô phỏng"><RotateCcw size={15} /></button>
    </div>
  </figure>;
}
