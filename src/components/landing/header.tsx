import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { nav, PHONE_MAIN, PHONE_MAIN_TEL } from "@/data/site";
import { ArrowFillButton } from "@/components/ui/arrow-fill-button";
import { useSite } from "./site-provider";

export function Header() {
  const { menuOpen, setMenuOpen, goBook } = useSite();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-200 " +
        (scrolled || menuOpen ? "border-line bg-bg/90 backdrop-blur-md" : "border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 min-[400px]:gap-3 min-[400px]:px-5 md:h-20 md:gap-4">
        <a href="#top" className="shrink-0" aria-label="AVILON" onClick={() => setMenuOpen(false)}>
          <img
            src="/images/avilon-logo.webp"
            alt="AVILON"
            className="h-4 w-auto brightness-0 invert min-[400px]:h-5 md:h-6"
          />
        </a>
        <img
          src="/images/genesis-logo-light.png"
          alt="Genesis"
          className="h-8 w-auto shrink-0 md:h-10"
        />

        <nav className="ml-4 hidden items-center gap-4 xl:flex xl:gap-5" aria-label="Разделы">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm whitespace-nowrap text-muted transition-colors hover:text-fg">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={`tel:${PHONE_MAIN_TEL}`}
          className="ml-auto hidden items-center gap-2 text-sm whitespace-nowrap text-fg 2xl:flex"
        >
          <Phone className="size-4 text-copper" aria-hidden="true" />
          {PHONE_MAIN}
        </a>

        <ArrowFillButton size="sm" showArrow={false} className="ml-auto !hidden md:!inline-flex 2xl:ml-0" onClick={() => goBook()}>
          Запись
        </ArrowFillButton>

        <button
          type="button"
          className="btn-ghost ml-auto grid size-11 shrink-0 place-items-center rounded-full xl:hidden md:ml-0"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 top-16 z-50 bg-bg px-6 py-6 xl:hidden">
          <nav className="flex flex-col gap-1" aria-label="Мобильные разделы">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="border-b border-line py-4 font-display text-lg"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a href={`tel:${PHONE_MAIN_TEL}`} className="mt-6 flex items-center gap-2 text-lg">
            <Phone className="size-5 text-copper" />
            {PHONE_MAIN}
          </a>
          <ArrowFillButton full className="mt-6" onClick={() => goBook()}>
            Записаться на сервис
          </ArrowFillButton>
        </div>
      ) : null}
    </header>
  );
}
