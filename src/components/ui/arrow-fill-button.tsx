import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Size = "sm" | "md" | "lg";

interface ArrowFillButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  type?: "button" | "submit";
  size?: Size;
  /** Stretch to the parent's width (label stays centred). */
  full?: boolean;
  /** Show the circle with the arrow. Without it the fill grows from a point. */
  showArrow?: boolean;
  /** Extra classes (margins, responsive width, visibility). */
  className?: string;
}

/**
 * Orange pill with a light circle + arrow on the right. On hover (or tap on
 * touch screens) the circle expands to fill the whole button, the label turns
 * orange and the arrow slides out and back in. Adapted from Hyperiux
 * "Arrow Fill Button"; sizes are in rem rather than vw so it fits the layout.
 */
export function ArrowFillButton({
  children,
  onClick,
  href,
  type = "button",
  size = "md",
  full = false,
  showArrow = true,
  className = "",
}: ArrowFillButtonProps) {
  const cls = `afb afb-${size} ${showArrow ? "" : "afb-no-arrow"} ${full ? "afb-full" : ""} ${className}`;

  const inner = (
    <>
      <span className="afb-label">{children}</span>
      <span className="afb-fill" aria-hidden="true" />
      <span className="afb-label-fill" aria-hidden="true">
        <span>{children}</span>
      </span>
      {showArrow ? (
        <span className="afb-circle" aria-hidden="true">
          <ArrowRight className="afb-arrow afb-arrow-in" strokeWidth={2} />
          <ArrowRight className="afb-arrow afb-arrow-out" strokeWidth={2} />
        </span>
      ) : null}
    </>
  );

  return href ? (
    <a href={href} className={cls} onClick={onClick}>
      {inner}
    </a>
  ) : (
    <button type={type} className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}

export default ArrowFillButton;
