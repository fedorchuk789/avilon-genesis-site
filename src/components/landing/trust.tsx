import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { faqs } from "@/data/site";

const reviewImages = [1, 2, 3, 4, 5, 6].map((n) => `/images/review-${n}.png`);

export function Reviews() {
  return (
    <section id="otzyvy" className="bg-ivory text-ink">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <h2 className="max-w-xl font-display text-3xl leading-tight md:text-5xl">Отзывы клиентов</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-10">
          {reviewImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Отзыв клиента ${i + 1}`}
              loading="lazy"
              className="block h-auto w-full rounded-2xl bg-paper shadow-sm ring-1 ring-ink/10"
            />
          ))}
        </div>
      </div>
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
