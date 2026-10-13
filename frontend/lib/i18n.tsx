"use client";

/**
 * La moitié cliente de la langue : le contexte, le hook, et le sélecteur.
 *
 * Les textes de chaque page vivent dans des fichiers `*-copy.ts` qui portent les deux
 * langues côte à côte, sans React : le serveur et le client les lisent. Une page n'est
 * donc pas forcée d'être un composant client, et peut exporter `metadata`.
 *
 * La langue **arrive du serveur** par `initial`, résolue depuis le cookie avant le
 * rendu (voir `lib/lang.ts`). Il n'y a donc plus de bascule après hydratation : ce que
 * le serveur a rendu est déjà dans la bonne langue.
 */

import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

import type { Lang } from "@/lib/lang-types";

export type { Lang };

const LANG_COOKIE = "xsom_lang";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "fr",
  setLang: () => {},
});

export function LanguageProvider({
  children,
  initial = "fr",
}: {
  children: React.ReactNode;
  initial?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initial);
  const router = useRouter();

  const set = (l: Lang) => {
    setLang(l);
    if (typeof document !== "undefined") {
      // `SameSite=Lax` et pas de `httpOnly` : ce cookie ne porte aucune autorité, il
      // dit une préférence d'affichage. Un an, parce qu'un visiteur qui revient veut
      // la même langue qu'à sa visite précédente.
      document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    }
    // Les composants serveur ont rendu dans l'autre langue : il faut les redemander.
    router.refresh();
  };

  return (
    <LangContext.Provider value={{ lang, setLang: set }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT() {
  const { lang, setLang } = useContext(LangContext);
  return { lang, setLang };
}

export function LanguageToggle() {
  const { lang, setLang } = useT();
  return (
    <div
      className="console-language"
      role="group"
      aria-label={lang === "fr" ? "Langue" : "Language"}
    >
      {(["fr", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-sm px-2.5 py-1 transition ${
            lang === l
              ? "bg-brand text-white"
              : "text-white/55 hover:text-white"
          }`}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
