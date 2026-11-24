import { useEffect, useRef } from "react";

/**
 * Slow dark-orange "smoke" drifting in from the edges, like a muted aurora.
 * Pure CSS animation; the layer leans gently toward the pointer and the
 * animation pauses while the hero is off screen or the tab is hidden.
 */
export function Aurora() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    const io = new IntersectionObserver(([entry]) => {
      el.dataset.paused = entry.isIntersecting ? "false" : "true";
    });
    io.observe(host);

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = host.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--lean-x", `${(x * 40).toFixed(1)}px`);
        el.style.setProperty("--lean-y", `${(y * 30).toFixed(1)}px`);
      });
    };
    if (fine && !reduce) host.addEventListener("pointermove", onMove);

    return () => {
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="aurora" aria-hidden="true">
      <span className="aurora-blob aurora-a" />
      <span className="aurora-blob aurora-b" />
      <span className="aurora-blob aurora-c" />
      <span className="aurora-blob aurora-d" />
      <span className="aurora-blob aurora-e" />
    </div>
  );
}
