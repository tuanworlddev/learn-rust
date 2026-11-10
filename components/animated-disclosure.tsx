"use client";

import { useId, useState, type ReactNode } from "react";
import "./animated-disclosure.css";

/** Keeps the content mounted so both opening and closing can animate. */
export function AnimatedDisclosure({ title, children, className = "", defaultOpen = false }: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);

  return <div className={`disclosure ${className}`} data-open={open}>
    <button className="disclosure-trigger" type="button" id={`${id}-trigger`}
      aria-expanded={open} aria-controls={`${id}-content`} onClick={() => setOpen(value => !value)}>
      {title}
    </button>
    <div className="disclosure-panel" id={`${id}-content`} aria-labelledby={`${id}-trigger`}
      aria-hidden={!open} inert={!open}>
      <div className="disclosure-content">{children}</div>
    </div>
  </div>;
}
