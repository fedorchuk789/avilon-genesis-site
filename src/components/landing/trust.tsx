import { useState } from "react";
import { Minus, Plus, Star } from "lucide-react";
import { faqs, reviews } from "@/data/site";
import { Marquee } from "@/components/ui/marquee";
import { CardContent, GlassFilter, LiquidCard } from "@/components/ui/liquid-glass-card";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Reviews() {
  return (
    <section id="otzyvy" className="relative overflow-hidden bg-ivory text-ink">
      {/* Warm blobs behind the strip so the glass cards have something to refract */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/4">
        <div className="absolute left-[8%] h-64 w-64 rounded-full bg-copper/35 blur-3xl" />
        <div className="absolute left-[45%] top-10 h-56 w-72 rounded-full bg-copper-deep/25 blur-3xl" />
        <div className="absolute right-[6%] h-60 w-60 rounded-full bg-[#f0b48a]/45 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-16 md:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2 className="max-w-xl font-display text-3xl leading-tight md:text-5xl">Отзывы клиентов</h2>
          <a
            href="https://yandex.ru/maps/org/avilon_genesis/21736267381/reviews/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-ink-soft underline decoration-copper/50 underline-offset-4 transition-colors hover:text-copper-deep hover:decoration-copper"
          >
            <Star className="size-4 fill-copper text-copper" aria-hidden="true" />
            Отзывы с Яндекс Карт
          </a>
        </div>
      </div>

      <GlassFilter />
      <Marquee
        pauseOnHover
        speed="normal"
        className="reviews-marquee relative mt-8 py-4 md:mt-10"
        aria-label="Отзывы клиентов"
      >
        {reviews.map((r) => (
          <LiquidCard key={r.name} className="h-full w-[18rem] rounded-3xl sm:w-80">
            <CardContent className="flex h-full flex-col">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-xs text-ivory">
                  {initials(r.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="text-sm text-ink-soft">{r.date}</p>
                </div>
              </div>
              <p className="mb-4 flex-1 text-sm leading-relaxed">{r.text}</p>
              <div className="flex gap-1" aria-label="Оценка 5 из 5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-copper text-copper" aria-hidden="true" />
                ))}
              </div>
            </CardContent>
          </LiquidCard>
        ))}
      </Marquee>
      <div className="h-16 md:h-24" aria-hidden="true" />
    </section>
  );
}
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-ivory text-ink">
      <div className="mx-auto max-w-7xl px-5 pb-16 md:pb-24">
        <h2 className="font-display text-3xl leading-tight md:text-5xl">FAQ</h2>
        <div className="mt-8 flex max-w-4xl flex-col gap-3 md:mt-10">
          {faqs.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.q} className="rounded-3xl bg-paper">
                <button
                  type="button"
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? -1 : i)}
                >
                  <span className="w-8 shrink-0 font-display text-sm text-copper">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-sm leading-snug md:text-base">{item.q}</span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-ivory">
                    {expanded ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                {expanded ? <p className="px-5 pb-5 text-sm text-ink-soft sm:pl-16">{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
