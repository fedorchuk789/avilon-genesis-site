import type { ComponentProps } from "react";

/**
 * Frosted "liquid glass" card (adapted from designali-in/liquid-glass-card).
 * Tuned for a light background; the SVG distortion filter is rendered once by
 * <GlassFilter /> rather than once per card, so duplicate ids never collide.
 */
export function LiquidCard({ className = "", style, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      style={{ backdropFilter: 'url("#container-glass") blur(2px)', ...style }}
      className={[
        "flex flex-col gap-6 rounded-xl border border-white/60 bg-white/35 py-6 text-ink transition-all",
        "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={["px-6", className].join(" ")} {...props} />;
}

/** The SVG filter the cards' backdrop-filter points at. Render once per page. */
export function GlassFilter() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.02" numOctaves={1} seed={1} result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="120"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export default LiquidCard;
