// 3D "open book" photo carousel. Adapted from the Journal Spread Carousel:
// demo-only chrome (view/search/menu chips, share/delete actions, the Latin
// handwriting font) is dropped; prev/next arrows and a counter are added; the
// palette follows the site's dark theme. Page-turn maths is unchanged.
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** A photo pinned to a spread. x / y / w are percentages of the whole spread. */
export type JournalPrint = {
  src: string;
  x: number;
  y: number;
  w: number;
  rotate?: number;
  /** A strip of tape across the top instead of a polaroid border. */
  tape?: boolean;
};

/** One open double page. The image runs across both pages and folds at the spine. */
export type JournalSpread = {
  id?: string;
  label?: string;
  image?: string;
  alt?: string;
  imagePosition?: string;
  /** Paper colour when there is no image, or under it while it loads. */
  paper?: string;
  prints?: JournalPrint[];
};

export interface JournalSpreadCarouselProps {
  spreads: JournalSpread[];
  /** Accessible name of the carousel. */
  label?: string;
  height?: string;
  initialIndex?: number;
  /** Milliseconds between automatic page turns; false turns it off. Stops on the first touch. */
  autoPlay?: number | false;
  className?: string;
}

// #region pose
const OPEN = 5; // the centre spread's slight V at the spine, degrees
const SIDE = 80; // how far a stacked page turns towards the middle
const FOLD = 174; // a page folding shut over its partner

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Spread shape for a stage: 5:4 on wide stages, taller pages on a portrait phone. */
export function spreadAspect(stageW: number, stageH: number): number {
  return stageW < 640 && stageH > stageW ? 0.86 : 1.25;
}

/** Spread width for a stage, keeping room for the side stacks. */
export function spreadWidth(stageW: number, stageH: number): number {
  if (stageW <= 0 || stageH <= 0) return 0;
  const narrow = stageW < 640;
  return Math.round(Math.min(stageW * (narrow ? 0.84 : 0.54), stageH * 0.9 * spreadAspect(stageW, stageH), 980));
}

/** Where spread `p` steps from the centre sits. 0 is open in the middle; ±1 starts each stack. */
export function poseFor(p: number, w: number) {
  const d = Math.abs(p);
  const a = d < 1 ? d : 1;
  const s = p < 0 ? -1 : 1;
  const out = d > 1 ? d - 1 : 0;
  const x = s * (a * (w * 0.5 + w * 0.03) + out * w * 0.055);
  const z = -(a * w * 0.42 + out * w * 0.06);
  const fold = a * a;
  const left = p > 0 ? OPEN + (FOLD - OPEN) * fold : OPEN + (SIDE - OPEN) * a;
  const right = p < 0 ? -(OPEN + (FOLD - OPEN) * fold) : -(OPEN + (SIDE - OPEN) * a);
  const shade = (deg: number) => clamp((Math.abs(deg) - OPEN) / 95, 0, 0.62);
  return {
    x,
    z,
    left,
    right,
    shadeLeft: shade(left),
    shadeRight: shade(right),
    opacity: clamp(7.2 - d, 0, 1),
    hidden: d > 7.2,
  };
}

/** Where a drag lets go: the nearest spread, nudged by the flick. */
export function settle(pos: number, velocity: number, n: number): number {
  return clamp(Math.round(pos + clamp(velocity * 0.18, -1.5, 1.5)), 0, Math.max(0, n - 1));
}

/** Tween length for a jump of `steps` spreads; longer jumps riffle faster per page. */
export function durationFor(steps: number): number {
  return steps <= 0 ? 0 : Math.round(560 * Math.sqrt(Math.min(steps, 12)));
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
// #endregion

const CSS =
  ".jsc-root{position:relative;width:100%;display:grid;grid-template-rows:minmax(0,1fr) auto;overflow:hidden;color:var(--color-fg,#f4f1ec);outline:none;user-select:none;-webkit-user-select:none;" +
  "border-radius:1.5rem;background:radial-gradient(90% 70% at 50% 45%,color-mix(in oklab,var(--color-copper,#e37a45) 14%,#16161a) 0%,#111114 60%,#0c0c0e 100%)}" +
  ".jsc-root:focus-visible{box-shadow:inset 0 0 0 2px color-mix(in oklab,var(--color-copper,#e37a45) 70%,transparent)}" +
  ".jsc-stage{position:relative;touch-action:pan-y;cursor:grab}" +
  ".jsc-stage[data-drag]{cursor:grabbing}" +
  ".jsc-floor{position:absolute;left:50%;top:50%;width:calc(var(--jsc-w) * 1.55);height:calc(var(--jsc-h) * .62);transform:translate(-50%,calc(var(--jsc-h) * .2));" +
  "background:#000;opacity:.55;filter:blur(calc(var(--jsc-w) * .035));border-radius:calc(var(--jsc-w) * .04);pointer-events:none}" +
  ".jsc-view{position:absolute;inset:0;perspective:calc(var(--jsc-w) * 2.3);perspective-origin:50% 46%}" +
  ".jsc-scene{position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d}" +
  ".jsc-item{position:absolute;left:0;top:0;transform-style:preserve-3d;visibility:hidden}" +
  ".jsc-page{position:absolute;top:calc(var(--jsc-h) * -.5);width:calc(var(--jsc-w) * .5);height:var(--jsc-h);overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;" +
  "background:#1c1c20;box-shadow:0 1px 0 rgba(255,255,255,.12) inset}" +
  ".jsc-page[data-side=l]{left:calc(var(--jsc-w) * -.5);transform-origin:100% 50%;border-radius:calc(var(--jsc-w) * .03) 0 0 calc(var(--jsc-w) * .03)}" +
  ".jsc-page[data-side=r]{left:0;transform-origin:0 50%;border-radius:0 calc(var(--jsc-w) * .03) calc(var(--jsc-w) * .03) 0}" +
  ".jsc-sheet{position:absolute;top:0;width:var(--jsc-w);height:var(--jsc-h);pointer-events:none}" +
  ".jsc-page[data-side=l]>.jsc-sheet{left:0}" +
  ".jsc-page[data-side=r]>.jsc-sheet{left:calc(var(--jsc-w) * -.5)}" +
  ".jsc-bg{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block}" +
  ".jsc-gutter{position:absolute;inset:0}" +
  ".jsc-page[data-side=l] .jsc-gutter{background:linear-gradient(90deg,rgba(0,0,0,0) 82%,rgba(0,0,0,.12) 93%,rgba(0,0,0,.38))}" +
  ".jsc-page[data-side=r] .jsc-gutter{background:linear-gradient(270deg,rgba(0,0,0,0) 82%,rgba(0,0,0,.12) 93%,rgba(0,0,0,.38))}" +
  ".jsc-shade{position:absolute;inset:0;background:#08080a;opacity:var(--jsc-s,0)}" +
  ".jsc-print{position:absolute;margin:0;background:#f6f3ee;padding:3% 3% 9%;box-shadow:0 .5em 1.2em rgba(0,0,0,.45),0 .1em .25em rgba(0,0,0,.3);font-size:calc(var(--jsc-w) * .01)}" +
  ".jsc-print img{display:block;width:100%;height:auto;max-width:none;aspect-ratio:2/3;object-fit:cover}" +
  ".jsc-print[data-tape]{padding:0;background:none}" +
  ".jsc-print[data-tape]::before{content:'';position:absolute;z-index:1;left:50%;top:-5%;width:46%;height:9%;transform:translateX(-50%) rotate(-3deg);" +
  "background:color-mix(in oklab,var(--color-copper,#e37a45) 55%,rgba(240,228,210,.75));opacity:.85;box-shadow:0 1px 2px rgba(0,0,0,.25)}" +
  ".jsc-bar{display:flex;justify-content:center;align-items:center;gap:clamp(12px,2vw,20px);padding:clamp(10px,2vw,20px) 0 clamp(18px,3vw,32px);position:relative;z-index:2}" +
  ".jsc-btn{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;padding:0;cursor:pointer;color:var(--color-fg,#f4f1ec);" +
  "border:1px solid var(--color-line,#2c2b30);background:rgba(12,12,14,.6);transition:border-color .2s,transform .2s}" +
  ".jsc-btn:hover:not(:disabled){border-color:color-mix(in oklab,var(--color-copper,#e37a45) 60%,var(--color-line,#2c2b30));transform:translateY(-1px)}" +
  ".jsc-btn:disabled{opacity:.3;cursor:default}" +
  ".jsc-btn svg{width:20px;height:20px}" +
  ".jsc-count{min-width:4.5em;text-align:center;font-size:.875rem;font-variant-numeric:tabular-nums;color:var(--color-muted,#a39e96)}" +
  ".jsc-count b{color:var(--color-fg,#f4f1ec);font-weight:600}" +
  ".jsc-btn:focus-visible{outline:2px solid var(--color-copper,#e37a45);outline-offset:3px}" +
  ".jsc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}" +
  "@media (prefers-reduced-motion:reduce){.jsc-btn{transition:none}}";

function Sheet({ spread }: { spread: JournalSpread }) {
  return (
    <div className="jsc-sheet" style={{ background: spread.paper }}>
      {spread.image ? (
        <img
          className="jsc-bg"
          src={spread.image}
          alt=""
          draggable={false}
          decoding="async"
          style={{ maxWidth: "none", objectPosition: spread.imagePosition }}
        />
      ) : null}
      {spread.prints?.map((p, k) => (
        <figure
          key={k}
          className="jsc-print"
          data-tape={p.tape ? "" : undefined}
          style={{ left: p.x + "%", top: p.y + "%", width: p.w + "%", transform: "rotate(" + (p.rotate ?? 0) + "deg)" }}
        >
          <img src={p.src} alt="" draggable={false} decoding="async" style={{ maxWidth: "none" }} />
        </figure>
      ))}
    </div>
  );
}

export default function JournalSpreadCarousel({
  spreads,
  label = "Фотографии",
  height = "clamp(420px, 72vh, 720px)",
  initialIndex = 0,
  autoPlay = 3500,
  className,
}: JournalSpreadCarouselProps) {
  const n = spreads.length;
  const start = clamp(Math.round(initialIndex), 0, Math.max(0, n - 1));
  const [index, setIndex] = React.useState(start);
  const [reduced, setReduced] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const items = React.useRef<(HTMLDivElement | null)[]>([]);
  const pages = React.useRef<(HTMLDivElement | null)[]>([]);
  const width = React.useRef(0); // cached on resize; the frame loop never measures
  const pos = React.useRef(start);
  const target = React.useRef(start);
  const tween = React.useRef<null | { from: number; to: number; t0: number; dur: number; ease: (t: number) => number }>(null);
  const raf = React.useRef(0);
  const drag = React.useRef<null | { id: number; x: number; from: number; lastX: number; lastT: number; v: number; moved: boolean }>(null);
  const touched = React.useRef(false);
  const reducedRef = React.useRef(false);

  const paint = React.useCallback(() => {
    const w = width.current;
    if (!w) return;
    for (let i = 0; i < items.current.length; i++) {
      const el = items.current[i];
      if (!el) continue;
      const q = poseFor(i - pos.current, w);
      if (q.hidden) {
        el.style.visibility = "hidden";
        continue;
      }
      el.style.visibility = "visible";
      el.style.opacity = String(q.opacity);
      el.style.transform = "translate3d(" + q.x.toFixed(2) + "px,0," + q.z.toFixed(2) + "px)";
      const l = pages.current[i * 2];
      const r = pages.current[i * 2 + 1];
      if (l) {
        l.style.transform = "rotateY(" + q.left.toFixed(2) + "deg)";
        l.style.setProperty("--jsc-s", q.shadeLeft.toFixed(3));
      }
      if (r) {
        r.style.transform = "rotateY(" + q.right.toFixed(2) + "deg)";
        r.style.setProperty("--jsc-s", q.shadeRight.toFixed(3));
      }
    }
  }, []);

  const frame = React.useCallback(
    (t: number) => {
      raf.current = 0;
      const tw = tween.current;
      if (tw) {
        const k = tw.dur > 0 ? clamp((t - tw.t0) / tw.dur, 0, 1) : 1;
        pos.current = tw.from + (tw.to - tw.from) * tw.ease(k);
        if (k >= 1) tween.current = null;
      }
      paint();
      if (tween.current) raf.current = requestAnimationFrame(frame);
    },
    [paint],
  );

  const kick = React.useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(frame);
  }, [frame]);

  const go = React.useCallback(
    (to: number, ease = easeInOut) => {
      const next = clamp(to, 0, Math.max(0, n - 1));
      if (next !== target.current) {
        target.current = next;
        setIndex(next);
      }
      const dur = reducedRef.current ? 0 : durationFor(Math.abs(next - pos.current));
      tween.current = { from: pos.current, to: next, t0: performance.now(), dur, ease };
      kick();
    },
    [n, kick],
  );

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
    };
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Measure once per resize and cache it; the per-frame paint reads only the cache.
  React.useEffect(() => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: sw, height: sh } = entry.contentRect;
      const w = spreadWidth(sw, sh);
      width.current = w;
      root.style.setProperty("--jsc-w", w + "px");
      root.style.setProperty("--jsc-h", Math.round(w / spreadAspect(sw, sh)) + "px");
      paint();
    });
    ro.observe(stage);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [paint]);

  React.useEffect(() => {
    if (pos.current > n - 1) go(n - 1);
    else paint();
  }, [n, go, paint]);

  // Turns pages on its own until someone touches it; pauses off-screen and in a hidden tab.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!autoPlay || reduced || n < 2 || !root) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(root);
    const id = window.setInterval(() => {
      if (touched.current || !visible || document.hidden || drag.current) return;
      go(target.current >= n - 1 ? 0 : target.current + 1);
    }, autoPlay);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [autoPlay, reduced, n, go]);

  const stop = () => {
    touched.current = true;
  };

  const step = (dir: 1 | -1) => {
    stop();
    go(target.current + dir);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || n < 1) return;
    stop();
    tween.current = null;
    drag.current = { id: e.pointerId, x: e.clientX, from: pos.current, lastX: e.clientX, lastT: e.timeStamp, v: 0, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const w = width.current;
    if (!d || d.id !== e.pointerId || !w) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = d.v * 0.6 + (-(e.clientX - d.lastX) / (w * 0.42) / (dt / 1000)) * 0.4;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    pos.current = clamp(d.from - dx / (w * 0.42), -0.3, n - 0.7);
    kick();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (d.moved) {
      go(settle(pos.current, d.v, n), easeOut);
      return;
    }
    // A tap on a side page brings that spread to the middle.
    const hit = (e.target as HTMLElement).closest("[data-i]");
    const i = hit ? Number(hit.getAttribute("data-i")) : target.current;
    go(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, PageDown: 1, ArrowLeft: -1, ArrowUp: -1, PageUp: -1 };
    if (e.target !== e.currentTarget) return;
    if (e.key in map) go(target.current + map[e.key]);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(n - 1);
    else return;
    e.preventDefault();
    stop();
  };

  // Trackpads swipe sideways; a vertical wheel is left to scroll the page.
  const wheel = React.useRef({ acc: 0, at: 0 });
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const w = wheel.current;
      w.acc += e.deltaX;
      if (Math.abs(w.acc) < 40 || e.timeStamp - w.at < 320) return;
      touched.current = true;
      w.at = e.timeStamp;
      go(target.current + (w.acc > 0 ? 1 : -1));
      w.acc = 0;
    };
    stage.addEventListener("wheel", onWheel, { passive: true });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [go]);

  const current = spreads[index];

  return (
    <div
      ref={rootRef}
      className={"jsc-root" + (className ? " " + className : "")}
      style={{ height }}
      tabIndex={0}
      role="region"
      aria-roledescription="карусель"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <style>{CSS}</style>

      <div
        ref={stageRef}
        className="jsc-stage"
        data-drag={dragging ? "" : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="jsc-floor" aria-hidden="true" />
        <div className="jsc-view">
          <div className="jsc-scene">
            {spreads.map((s, i) => (
              <div
                key={s.id ?? i}
                ref={(el) => {
                  items.current[i] = el;
                }}
                className="jsc-item"
                data-i={i}
                role="group"
                aria-roledescription="разворот"
                aria-label={(s.label ?? "Фото " + (i + 1)) + ", " + (i + 1) + " из " + n}
                aria-hidden={i !== index}
              >
                {s.alt ? <span className="jsc-sr">{s.alt}</span> : null}
                {(["l", "r"] as const).map((side, k) => (
                  <div
                    key={side}
                    ref={(el) => {
                      pages.current[i * 2 + k] = el;
                    }}
                    className="jsc-page"
                    data-side={side}
                  >
                    <Sheet spread={s} />
                    <div className="jsc-gutter" />
                    <div className="jsc-shade" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="jsc-bar">
        <button type="button" className="jsc-btn" aria-label="Предыдущее фото" disabled={index === 0} onClick={() => step(-1)}>
          <ChevronLeft />
        </button>
        <span className="jsc-count" aria-hidden="true">
          <b>{index + 1}</b> / {n}
        </span>
        <button type="button" className="jsc-btn" aria-label="Следующее фото" disabled={index === n - 1} onClick={() => step(1)}>
          <ChevronRight />
        </button>
      </div>

      <p className="jsc-sr" aria-live="polite">
        {current ? (current.label ?? "Фото " + (index + 1)) + ", " + (index + 1) + " из " + n : ""}
      </p>
    </div>
  );
}
