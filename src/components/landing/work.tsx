import { advantages, offers, services } from "@/data/site";
import { ArrowFillButton } from "@/components/ui/arrow-fill-button";
import { useSite } from "./site-provider";

const FLUENT = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets";
const serviceIcons: Record<string, string> = {
  "Плановое ТО": "/icons/air-filter.svg",
  "Компьютерная диагностика": "/icons/obd-cut.png",
  "Слесарный ремонт": `${FLUENT}/Hammer%20and%20wrench/3D/hammer_and_wrench_3d.png`,
  "Кузовной ремонт": "/icons/spray-gun.svg",
  "Шиномонтаж": "/icons/tire.svg",
  "Оригинальные запчасти": `${FLUENT}/Gear/3D/gear_3d.png`,
  "Корпоративный парк": `${FLUENT}/Office%20building/3D/office_building_3d.png`,
  "Connected Services": `${FLUENT}/Mobile%20phone/3D/mobile_phone_3d.png`,
};

function iconUrl(title: string) {
  return serviceIcons[title] ?? `${FLUENT}/Wrench/3D/wrench_3d.png`;
}
export function Offers() {
  const { goBook } = useSite();
  return (
    <section id="akcii" className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <h2 className="max-w-4xl font-display text-[1.65rem] leading-tight min-[400px]:text-3xl md:text-5xl">Спецпредложения сервиса</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-10">
        {offers.map((offer) => (
          <article key={offer.title} className="panel panel-hover flex h-full flex-col overflow-hidden">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
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
                className="relative h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-1 flex-col p-5 md:p-6">
              <h3 className="flex-1 font-display text-base leading-snug md:text-lg">{offer.title}</h3>
              <ArrowFillButton full className="mt-5" onClick={() => goBook({ service: offer.service })}>
                Записаться
              </ArrowFillButton>
            </div>
          </article>
        ))}
      </div>
    </section>
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
      </div>
    </section>
  );
}

const photos = [
  { src: "/images/service-1.webp", alt: "Балансировка колеса в сервисе АВИЛОН" },
  { src: "/images/service-2.webp", alt: "Мастер за работой с тормозным диском" },
  { src: "/images/service-3.webp", alt: "Клиентская зона сервиса" },
  { src: "/images/service-4.webp", alt: "Рабочий пост с подъёмником" },
  { src: "/images/service-5.webp", alt: "Цех сервиса Genesis" },
  { src: "/images/service-6.webp", alt: "Вывеска Genesis в цеху" },
];

export function Gallery() {
  return (
    <section id="foto" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <h2 className="font-display text-3xl leading-tight md:text-5xl">Фотографии сервиса</h2>
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 md:mt-10 [&>img]:mb-4">
          {photos.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="block h-auto w-full break-inside-avoid rounded-3xl"
            />
          ))}
        </div>
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
