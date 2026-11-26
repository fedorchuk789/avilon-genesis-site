import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  /** Reverse the animation direction. */
  reverse?: boolean;
  /** Pause the animation while the pointer is over it. */
  pauseOnHover?: boolean;
  children: ReactNode;
  /** Scroll vertically instead of horizontally. */
  vertical?: boolean;
  /** How many copies of the content to lay end to end (the loop needs at least 2). */
  repeat?: number;
  speed?: "slow" | "normal" | "fast";
}

const speedVariants = {
  slow: "[--duration:120s]",
  normal: "[--duration:60s]",
  fast: "[--duration:20s]",
};

/** Endless scrolling strip (adapted from designali-in/marquee, no `cn` helper). */
export function Marquee({
  className = "",
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  speed = "normal",
  ...props
}: MarqueeProps) {
  const track = [
    "marquee-track flex shrink-0 justify-around [gap:var(--gap)]",
    vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
    pauseOnHover ? "group-hover:[animation-play-state:paused]" : "",
    reverse ? "[animation-direction:reverse]" : "",
  ].join(" ");

  return (
    <div
      {...props}
      className={[
        "group flex overflow-hidden p-1 [--gap:1rem] [gap:var(--gap)]",
        speedVariants[speed],
        vertical ? "flex-col" : "flex-row",
        className,
      ].join(" ")}
    >
      {Array.from({ length: repeat }, (_, i) => (
        // Copies after the first exist only to close the loop: hide them from assistive tech.
        <div key={i} className={track} aria-hidden={i > 0 ? true : undefined}>
          {children}
        </div>
      ))}
    </div>
  );
}
