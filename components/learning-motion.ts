/** A short, cancellable scroll that respects the user's motion preference. */
export function scrollWithMotion(scroller: Window | HTMLElement, top: number, finish: () => void) {
  const start = scroller instanceof Window ? scroller.scrollY : scroller.scrollTop;
  const distance = top - start;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reduced || Math.abs(distance) < 2 ? 0 : Math.min(340, Math.max(200, Math.abs(distance) * .18));
  const started = performance.now();
  let frame = 0;
  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    scroller.removeEventListener("wheel", done);
    scroller.removeEventListener("touchstart", done);
    finish();
  };
  const tick = (time: number) => {
    const progress = duration ? Math.min(1, (time - started) / duration) : 1;
    const ease = 1 - Math.pow(1 - progress, 3);
    scroller.scrollTo({ top: start + distance * ease, behavior: "instant" });
    if (progress < 1) frame = requestAnimationFrame(tick);
    else done();
  };
  scroller.addEventListener("wheel", done, { passive: true, once: true });
  scroller.addEventListener("touchstart", done, { passive: true, once: true });
  frame = requestAnimationFrame(tick);
  return done;
}
