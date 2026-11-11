"use client";

import { useId, useState, type ReactNode } from "react";
import "./animated-disclosure.css";

/** Optional heavy content mounts on first open and stays mounted for close transitions. */
export function AnimatedDisclosure({ title, children, className = "", defaultOpen = false, lazy = false }: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  lazy?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [hasOpened, setHasOpened] = useState(defaultOpen);

  return <div className={`disclosure ${className}`} data-open={open}>
    <button className="disclosure-trigger" type="button" id={`${id}-trigger`}
      aria-expanded={open} aria-controls={`${id}-content`} onClick={() => { setHasOpened(true); setOpen(value => !value); }}>
      {title}
    </button>
    <div className="disclosure-panel" id={`${id}-content`} aria-labelledby={`${id}-trigger`}
      aria-hidden={!open} inert={!open}>
      <div className="disclosure-content">{(!lazy || hasOpened) && children}</div>
    </div>
  </div>;
}
