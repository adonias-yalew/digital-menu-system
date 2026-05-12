import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { translate, type Lang } from "@/lib/i18n";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("smash-lang") as Lang | null;
    return saved && ["en", "am", "om"].includes(saved) ? saved : "en";
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("smash-lang", l);
  }, []);

  const t = useCallback((path: string) => translate(lang, path), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
