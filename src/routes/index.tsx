import { createFileRoute } from "@tanstack/react-router";
import { SiteProvider } from "@/components/landing/site-provider";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Advantages, Gallery, Offers, Services } from "@/components/landing/work";
import { Faq, Reviews } from "@/components/landing/trust";
import { Footer, Visit } from "@/components/landing/visit";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteProvider>
      <Header />
      <main>
        <Hero />
        <Offers />
        <Services />
        <Gallery />
        <Advantages />
        <Reviews />
        <Faq />
        <Visit />
      </main>
      <Footer />
    </SiteProvider>
  );
}
