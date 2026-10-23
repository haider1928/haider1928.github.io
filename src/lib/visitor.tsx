import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type VisitorState = {
  purpose: string | null;
  purposeAsked: boolean;
  setPurpose: (key: string | null) => void;
  dismissPurpose: () => void;
  dialogOpen: boolean;
  openPurposeDialog: () => void;
  setDialogOpen: (v: boolean) => void;
  basket: string[];
  addToBasket: (slug: string) => void;
  removeFromBasket: (slug: string) => void;
  clearBasket: () => void;
  inBasket: (slug: string) => boolean;
};

const Ctx = createContext<VisitorState | null>(null);
const KEY = "hm.visitor.v1";

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [purpose, setPurposeState] = useState<string | null>(null);
  const [purposeAsked, setAsked] = useState(true);
  const [basket, setBasket] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const s = raw ? JSON.parse(raw) : {};
      setPurposeState(s.purpose ?? null);
      setAsked(Boolean(s.asked));
      setBasket(Array.isArray(s.basket) ? s.basket.filter((x: unknown) => typeof x === "string") : []);
      if (!s.asked) setTimeout(() => setDialogOpen(true), 1200);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(KEY, JSON.stringify({ purpose, asked: purposeAsked, basket }));
  }, [purpose, purposeAsked, basket, loaded]);

  const setPurpose = useCallback((k: string | null) => {
    setPurposeState(k);
    setAsked(true);
    setDialogOpen(false);
  }, []);

  const value: VisitorState = {
    purpose,
    purposeAsked,
    setPurpose,
    dismissPurpose: () => {
      setAsked(true);
      setDialogOpen(false);
    },
    dialogOpen,
    openPurposeDialog: () => setDialogOpen(true),
    setDialogOpen: (v) => {
      if (!v) setAsked(true);
      setDialogOpen(v);
    },
    basket,
    addToBasket: (slug) => setBasket((b) => (b.includes(slug) ? b : [...b, slug])),
    removeFromBasket: (slug) => setBasket((b) => b.filter((x) => x !== slug)),
    clearBasket: () => setBasket([]),
    inBasket: (slug) => basket.includes(slug),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVisitor() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useVisitor must be used inside VisitorProvider");
  return v;
}
