import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { asset } from "@/lib/asset";
import JournalSpreadCarousel, { type JournalSpread } from "@/components/ui/journal-spread-carousel";
import { advantages, offers, services } from "@/data/site";
import { ArrowFillButton } from "@/components/ui/arrow-fill-button";
import { useSite } from "./site-provider";

const FLUENT = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets";
const serviceIcons: Record<string, string> = {
  "Плановое ТО": asset("icons/air-filter.svg"),
  "Компьютерная диагностика": asset("icons/obd-cut.png"),
  "Слесарный ремонт": `${FLUENT}/Hammer%20and%20wrench/3D/hammer_and_wrench_3d.png`,
  "Кузовной ремонт": asset("icons/spray-gun.svg"),
  "Шиномонтаж": asset("icons/tire.svg"),
  "Оригинальные запчасти": `${FLUENT}/Gear/3D/gear_3d.png`,
  "Корпоративный парк": `${FLUENT}/Office%20building/3D/office_building_3d.png`,
  "Connected Services": `${FLUENT}/Mobile%20phone/3D/mobile_phone_3d.png`,
};

function iconUrl(title: string) {
  return serviceIcons[title] ?? `${FLUENT}/Wrench/3D/wrench_3d.png`;
}
export function Offers() {
  const { goBook } = useSite();
  const { trackRef, edges, updateEdges, scrollByPage } = useCarousel();

  return (
    <section id="akcii" className="mx-auto max-w-7xl px-5 py-14 md:py-20">
      <div className="flex items-end justify-between gap-4">
        <h2 className="max-w-4xl font-display text-[1.65rem] leading-tight min-[400px]:text-3xl md:text-5xl">
          Спецпредложения сервиса
        </h2>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <CarouselArrow dir={-1} disabled={edges.start} onClick={() => scrollByPage(-1)} />
          <CarouselArrow dir={1} disabled={edges.end} onClick={() => scrollByPage(1)} />
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="offers-track mt-6 -mx-5 grid snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 md:mt-8 md:gap-4"
      >
        {offers.map((offer) => (
          <button
            key={offer.title}
            type="button"
            onClick={() => goBook({ service: offer.service })}
            className="offer-card panel panel-hover group flex snap-start flex-col overflow-hidden text-left"
          >
            <span className="relative block aspect-[16/10] w-full overflow-hidden bg-surface">
              <img
                src={offer.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
              />
              <img
                src={offer.image}
                alt={offer.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="relative h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </span>
            <span className="block p-4 font-display text-sm leading-snug md:text-[0.95rem]">{offer.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Horizontal scroll-snap carousel: tracks edges and pages by whole columns. */
function useCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    // Distinct left edges = columns (works for one- or two-row tracks).
    const lefts = [...new Set(items.map((c) => c.offsetLeft))].sort((a, b) => a - b);
    if (lefts.length < 2) return;
    const origin = lefts[0];
    const view = el.clientWidth;
    let target: number;
    if (dir === 1) {
      // First column that isn't fully visible yet.
      const next = lefts.find((l) => l - origin + 1 > el.scrollLeft + view - (lefts[1] - lefts[0]) / 2);
      target = next !== undefined ? next - origin : el.scrollWidth;
    } else {
      // Go back roughly one screen, landing on a column edge.
      const goal = el.scrollLeft - view;
      const prev = lefts.filter((l) => l - origin <= Math.max(0, goal) + 1).pop();
      target = prev !== undefined ? prev - origin : 0;
    }
    el.scrollTo({ left: target, behavior: "smooth" });
  }

  return { trackRef, edges, updateEdges, scrollByPage };
}
function CarouselArrow({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  const Icon = dir === 1 ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      aria-label={dir === 1 ? "Следующие предложения" : "Предыдущие предложения"}
      disabled={disabled}
      onClick={onClick}
      className="btn-ghost grid size-11 place-items-center rounded-full disabled:cursor-default disabled:opacity-30"
    >
      <Icon className="size-5" />
    </button>
  );
}
export function Services() {
  const { goBook } = useSite();
  return (
    <section id="uslugi" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <h2 className="font-display text-3xl leading-tight md:text-5xl">Список услуг</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10 md:gap-4 lg:grid-cols-4">
          {services.map((item) => (
            <button
              key={item.title}
              type="button"
              className="panel panel-hover flex min-h-32 items-center justify-between gap-3 p-5 text-left sm:min-h-48 sm:flex-col sm:items-stretch"
              onClick={() => goBook({ service: item.title })}
            >
              <span className="font-display text-base leading-snug md:text-lg">{item.title}</span>
              <span className="service-icon-orb grid size-20 shrink-0 place-items-center rounded-full sm:self-end md:size-24">
                <img
                  src={iconUrl(item.title)}
                  alt=""
                  loading="lazy"
                  className="size-[4.5rem] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)] md:size-20"
                />
              </span>
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-start md:mt-10">
          <ArrowFillButton size="lg" onClick={() => goBook()}>
            Записаться на сервис
          </ArrowFillButton>
        </div>
      </div>
    </section>
  );
}

// Each spread is one landscape photo across both pages; the two portrait
// shots ride along as taped prints so nothing gets cropped to a sliver.
const photoSpreads: JournalSpread[] = [
  { label: "Genesis GV80 на подъёмнике", image: asset("images/service-7.webp"), imagePosition: "50% 45%" },
  {
    label: "Шиномонтаж и балансировка",
    image: asset("images/service-1.webp"),
    prints: [{ src: asset("images/service-4.webp"), x: 70, y: 9, w: 20, rotate: 5, tape: true }],
  },
  { label: "Genesis G90 в цехе", image: asset("images/service-8.webp") },
  { label: "Клиентская зона", image: asset("images/service-3.webp") },
  {
    label: "Genesis GV80 на посту",
    image: asset("images/service-9.webp"),
    prints: [{ src: asset("images/service-5.webp"), x: 6, y: 10, w: 20, rotate: -5, tape: true }],
  },
  { label: "Подкапотное пространство Genesis", image: asset("images/service-10.webp") },
  { label: "Вывеска Genesis в цехе", image: asset("images/service-6.webp") },
];

export function Gallery() {
  return (
    <section id="foto" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <h2 className="text-center font-display text-3xl leading-tight md:text-5xl">Фотографии сервиса</h2>
        <JournalSpreadCarousel
          spreads={photoSpreads}
          label="Фотографии сервиса"
          className="mt-8 md:mt-10"
          height="clamp(380px, 68vh, 680px)"
          initialIndex={1}
        />
      </div>
    </section>
  );
}
export function Advantages() {
  return (
    <section id="pochemu" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <h2 className="max-w-3xl font-display text-3xl leading-tight md:text-5xl">
          Преимущества
        </h2>
        <div className="mt-8 md:mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item, i) => (
            <article key={item.title} className="panel panel-hover p-6">
              <span className="icon-orb text-sm font-semibold">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 font-display text-xl leading-snug">{item.title}</h3>
              <p className="mt-3 text-sm text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
