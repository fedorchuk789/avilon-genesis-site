import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type BookingPatch = {
  service?: string;
  model?: string;
};

type SiteCtx = {
  service: string;
  model: string;
  setService: (v: string) => void;
  setModel: (v: string) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  goBook: (patch?: BookingPatch) => void;
};

const Ctx = createContext<SiteCtx | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState("Плановое ТО");
  const [model, setModel] = useState("G80");
  const [menuOpen, setMenuOpen] = useState(false);

  const api = useMemo<SiteCtx>(
    () => ({
      service,
      model,
      setService,
      setModel,
      menuOpen,
      setMenuOpen,
      goBook: (patch) => {
        if (patch?.service) setService(patch.service);
        if (patch?.model) setModel(patch.model);
        setMenuOpen(false);
        requestAnimationFrame(() => {
          document.getElementById("zapis")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      },
    }),
    [service, model, menuOpen],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useSite() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useSite outside provider");
  return value;
}
