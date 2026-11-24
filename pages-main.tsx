// Static entry for the GitHub Pages build (`npm run build:pages` -> docs/).
// Same landing components as src/routes/index.tsx, without the server.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./src/styles.css";
import { SiteProvider } from "@/components/landing/site-provider";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Advantages, Gallery, Offers, Services } from "@/components/landing/work";
import { Faq, Reviews } from "@/components/landing/trust";
import { Footer, Visit } from "@/components/landing/visit";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
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
  </StrictMode>,
);
