import { asset } from "@/lib/asset";
import { ArrowFillButton } from "@/components/ui/arrow-fill-button";
import { Aurora } from "./aurora";
import { useSite } from "./site-provider";

export function Hero() {
  const { goBook } = useSite();

  return (
    <section id="top" className="relative overflow-hidden hero-clip pt-28 pb-14 md:pt-36 md:pb-24 lg:pt-44 lg:pb-28">
      <Aurora />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[auto_1fr] lg:items-stretch lg:gap-10">
        <div className="flex flex-col text-center lg:justify-between lg:py-[4%] lg:text-left">
          <div>
            <h1 className="font-display text-[1.22rem] leading-tight font-semibold min-[400px]:text-[1.4rem] sm:text-3xl lg:text-[1.85rem] xl:text-[2.2rem] 2xl:text-[2.5rem]">
              <span className="whitespace-nowrap">Ремонт и ТО Genesis</span>
              <br />
              <span className="whitespace-nowrap">в официальном дилере</span>
            </h1>

            <p className="mt-4 font-display text-base leading-tight font-bold whitespace-nowrap text-copper min-[400px]:text-lg sm:text-xl xl:mt-6 xl:text-2xl">
              −50% при первом визите
            </p>
          </div>

          {/* Desktop: button sits under the text, level with the car's bottom */}
          <ArrowFillButton
            size="lg"
            className="mt-10 hidden self-start lg:inline-flex"
            onClick={() => goBook({ service: "Плановое ТО" })}
          >
            Записаться на сервис
          </ArrowFillButton>
        </div>

        <img
          src={asset("images/hero-gv70.png")}
          alt="Зелёный Genesis"
          className="mx-auto block h-auto w-full max-w-2xl self-center lg:-ml-[4%] lg:w-[114%] lg:max-w-none"
          fetchPriority="high"
        />

        {/* Mobile / tablet: compact button below the car */}
        <ArrowFillButton
          className="-mt-2 self-center justify-self-center lg:hidden"
          onClick={() => goBook({ service: "Плановое ТО" })}
        >
          Записаться на сервис
        </ArrowFillButton>
      </div>
    </section>
  );
}
