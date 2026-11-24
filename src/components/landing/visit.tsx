import { asset } from "@/lib/asset";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { MapPin, Phone } from "lucide-react";
import {
  ADDRESS,
  EMAIL,
  MAP_LAT,
  MAP_LON,
  PHONE_BUREAU,
  PHONE_BUREAU_TEL,
  PHONE_MAIN,
  PHONE_MAIN_TEL,
  nav,
  services,
} from "@/data/site";
import { ArrowFillButton } from "@/components/ui/arrow-fill-button";
import { useSite } from "./site-provider";

type Draft = {
  name: string;
  phone: string;
  consent: boolean;
};

const empty: Draft = { name: "", phone: "", consent: false };

const bbox = `${MAP_LON - 0.012},${MAP_LAT - 0.008},${MAP_LON + 0.012},${MAP_LAT + 0.008}`;
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${MAP_LAT}%2C${MAP_LON}`;
const yandexHref = `https://yandex.ru/maps/?ll=${MAP_LON}%2C${MAP_LAT}&z=16&pt=${MAP_LON},${MAP_LAT}&text=${encodeURIComponent("Авилон Genesis, Волгоградский проспект 41")}`;

export function Visit() {
  const { service } = useSite();
  const [draft, setDraft] = useState<Draft>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mailto, setMailto] = useState<string | null>(null);

  const summary = useMemo(() => {
    if (!mailto) return "";
    return mailto;
  }, [mailto]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (draft.name.trim().length < 2) next.name = "Как к вам обращаться?";
    const digits = draft.phone.replace(/\D/g, "");
    if (digits.length < 10) next.phone = "Нужен телефон, чтобы перезвонить";
    if (!draft.consent) next.consent = "Нужно согласие, чтобы отправить заявку";
    setErrors(next);
    if (Object.keys(next).length) return;

    // The service comes from whichever offer / service tile the visitor clicked.
    const lines = [
      `Имя: ${draft.name.trim()}`,
      `Телефон: ${draft.phone.trim()}`,
      `Интересует: ${service}`,
    ];
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent("Запись на сервис Genesis")}&body=${encodeURIComponent(lines.join("\n"))}`;
    setMailto(href);
    try {
      localStorage.setItem("avilon-genesis-request", JSON.stringify({ ...draft, service }));
    } catch {
      /* ignore quota */
    }
  }

  return (
    <section id="zapis" className="border-t border-line bg-bg text-fg">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="panel overflow-hidden lg:min-h-[24rem]">
            <iframe
              title="Карта: АВИЛОН Genesis, Волгоградский проспект, 41"
              src={mapSrc}
              className="map-frame h-72 w-full md:h-96 lg:h-full"
              loading="lazy"
            />
          </div>
          <div className="panel p-6">
            <p className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-copper" aria-hidden="true" />
              <span>
                <span className="block font-semibold">{ADDRESS}</span>
                <span className="mt-1 block text-sm text-muted">
                  Метро «Текстильщики» или «Новохохловская». Остановка «Волгоградский проспект, 40» — автобусы 74,
                  м79, т27, т38.
                </span>
              </span>
            </p>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-t border-line pt-3">
                <dt className="text-muted">Приёмка сервиса</dt>
                <dd>ежедневно 8:00–21:40</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-3">
                <dt className="text-muted">Салон</dt>
                <dd>ежедневно 9:00–21:40</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-3">
                <dt className="text-muted">Цех</dt>
                <dd>круглосуточно</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-col gap-2">
              <a href={`tel:${PHONE_MAIN_TEL}`} className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-copper" aria-hidden="true" />
                Клиентская поддержка {PHONE_MAIN}
              </a>
              <a href={`tel:${PHONE_BUREAU_TEL}`} className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-copper" aria-hidden="true" />
                Сервис-бюро {PHONE_BUREAU}
              </a>
            </div>
            <a
              href={yandexHref}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex text-sm font-semibold text-copper"
            >
              Открыть в Яндекс Картах
            </a>
          </div>
        </div>

        <div className="mt-14 max-w-2xl md:mt-20">
          <h2 className="font-display text-3xl leading-tight md:text-5xl">Оставить заявку</h2>

          {summary ? (
            <div className="panel mt-8 p-6">
              <p className="font-display text-2xl">Заявка собрана</p>
              <p className="mt-3 text-sm text-muted">
                {service}. Откройте письмо и нажмите «Отправить» — или позвоните, если удобнее
                голосом.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ArrowFillButton href={summary} className="w-full sm:w-auto">
                  Открыть письмо
                </ArrowFillButton>
                <a
                  href={`tel:${PHONE_BUREAU_TEL}`}
                  className="btn-ghost rounded-full px-5 py-3 text-center text-sm font-semibold"
                >
                  Позвонить в сервис-бюро
                </a>
              </div>
              <button
                type="button"
                className="mt-4 text-sm text-muted underline"
                onClick={() => setMailto(null)}
              >
                Изменить заявку
              </button>
            </div>
          ) : (
            <form className="mt-8 grid gap-4" onSubmit={onSubmit} noValidate>
              <Field label="Имя" error={errors.name}>
                <input
                  className="field"
                  name="name"
                  autoComplete="name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Иван"
                />
              </Field>
              <Field label="Телефон" error={errors.phone}>
                <input
                  className="field"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  placeholder="+7 900 000-00-00"
                />
              </Field>
              <label className="flex items-start gap-3 text-sm text-muted">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-copper"
                  checked={draft.consent}
                  onChange={(e) => setDraft({ ...draft, consent: e.target.checked })}
                />
                <span>
                  Соглашаюсь на обработку имени и телефона, чтобы АВИЛОН связался по этой заявке.
                  {errors.consent ? <span className="mt-1 block text-copper">{errors.consent}</span> : null}
                </span>
              </label>
              <ArrowFillButton type="submit" full>
                Оставить заявку
              </ArrowFillButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted">{label}</span>
      {children}
      {error ? <span className="text-copper">{error}</span> : null}
    </label>
  );
}

export function Footer() {
  const { goBook } = useSite();
  const serviceLinks = services.slice(0, 5);
  return (
    <>
      <footer className="overflow-hidden bg-copper text-ink">
        <div className="mx-auto max-w-7xl px-5 pt-10 md:pt-20">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <p className="font-display text-[1.3rem] leading-tight whitespace-nowrap min-[400px]:text-2xl md:text-4xl md:whitespace-normal">
                Запишитесь <br className="hidden md:inline" />
                на сервис
              </p>
              <button
                type="button"
                className="mt-4 rounded-full bg-ink px-6 py-3 text-sm md:mt-6 md:px-7 md:py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5"
                onClick={() => goBook()}
              >
                Оставить заявку
              </button>
            </div>

            <FooterCol title="Разделы">
              {nav.map((item) => (
                <a key={item.href} href={item.href} className="footer-link">
                  {item.label}
                </a>
              ))}
            </FooterCol>

            <FooterCol title="Услуги">
              {serviceLinks.map((item) => (
                <button key={item.title} type="button" className="footer-link text-left" onClick={() => goBook({ service: item.title })}>
                  {item.title}
                </button>
              ))}
            </FooterCol>

            <FooterCol title="Контакты" className="col-span-2 md:col-span-1">
              <a href={`tel:${PHONE_MAIN_TEL}`} className="footer-link">
                {PHONE_MAIN}
              </a>
              <a href={`tel:${PHONE_BUREAU_TEL}`} className="footer-link">
                Сервис-бюро {PHONE_BUREAU}
              </a>
              <a href={`mailto:${EMAIL}`} className="footer-link normal-case">
                {EMAIL}
              </a>
              <span className="footer-link normal-case">Волгоградский пр-т, 41, стр. 1</span>
              <span className="footer-link normal-case">Приёмка ежедневно 8:00–21:40</span>
            </FooterCol>
          </div>

          <p className="mt-8 max-w-3xl text-[0.7rem] leading-relaxed text-ink/70 md:mt-12 md:text-xs">
            © 2026 Официальный дилер Genesis в Москве. АО «Авилон АГ», ОГРН 1027700000151, ИНН 7705133757.
            Информация о сервисе справочная и не является публичной офертой (ст. 437 ГК РФ). Цены и состав акций
            подтверждает мастер-консультант.
          </p>
        </div>

        <div className="mt-5 px-3 md:mt-6 md:px-5" aria-hidden="true">
          <img
            src={asset("images/avilon-logo.webp")}
            alt=""
            className="footer-wordmark mx-auto block w-full max-w-[110rem] brightness-0"
          />
        </div>
        <div className="h-20 md:hidden" aria-hidden="true" />
      </footer>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 p-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <a href={`tel:${PHONE_MAIN_TEL}`} className="btn-ghost rounded-full py-3 text-center text-sm font-semibold">
            Позвонить
          </a>
          <ArrowFillButton full showArrow={false} onClick={() => goBook()}>
            Запись
          </ArrowFillButton>
        </div>
      </div>
    </>
  );
}

function FooterCol({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold tracking-[0.18em] uppercase md:text-sm">{title}</p>
      <div className="mt-3 flex flex-col items-start gap-2 md:mt-5 md:gap-3">{children}</div>
    </div>
  );
}