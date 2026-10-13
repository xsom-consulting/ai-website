import type { Metadata } from "next";
import localFont from "next/font/local";
import type { CSSProperties } from "react";

import { Motion } from "@/components/Motion";
import { SiteProvider } from "@/components/site/SiteProvider";
import { LanguageProvider } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getHostSite } from "@/lib/site-host";
import { SITE_DEFAULT_META, brandName } from "@/lib/site-copy";
import { SITE_ORIGINS } from "@/lib/sites";
import "./globals.css";
import "@/design-system/tokens.css";
import "@/design-system/components.css";
import { SignalBootstrap } from "@/design-system/react";
import { SIGNAL_BOOTSTRAP_SCRIPT } from "@/design-system/bootstrap";

// Softer shared typography. Files and redistribution licences live in the
// canonical package; no visitor request is sent to a font CDN.
const manrope = localFont({
  src: "../design-system/assets/manrope-latin-variable.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-display",
  display: "swap",
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

const sourceSans = localFont({
  src: "../design-system/assets/source-sans-3-latin-variable.woff2",
  weight: "200 900",
  style: "normal",
  variable: "--font-body",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

const mono = localFont({
  src: "../design-system/assets/jetbrains-mono-500.woff2",
  weight: "500",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

// Résolue par requête, depuis l'adresse demandée et la langue du visiteur : chaque
// site a sa marque, son titre et sa description, et un moteur de recherche indexe
// exactement ce qu'un lecteur français voit.
//
// Pas d'`alternates.languages` : la langue tient à un cookie, les deux versions
// partagent donc la même URL. Déclarer un `hreflang` `en` pointant sur `/` serait
// faux, et un robot, qui n'a pas de cookie, verrait de toute façon le français aux
// deux adresses. Conséquence assumée et notée : **seul le français est indexable**.
// Rendre l'anglais indexable demande des routes de langue, pas une balise de plus.
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const site = (await getHostSite()) ?? "ai";
  const name = brandName(site, lang);
  const meta = SITE_DEFAULT_META[site][lang];
  return {
    metadataBase: new URL(SITE_ORIGINS[site]),
    title: { default: meta.title, template: `%s · ${name}` },
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: lang === "fr" ? "fr_FR" : "en_US",
      type: "website",
      siteName: name,
    },
  };
}

// Décide, AVANT peinture, si le mouvement a lieu. Un `useEffect` s'exécute après le
// premier rendu : on verrait les blocs apparaître, disparaître, puis se révéler.
// C'est le SEUL endroit où la condition est écrite, `Motion.tsx` ne fait que lire le
// marqueur. Littéral constant, aucune interpolation.
const MOTION_BOOTSTRAP =
  "if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window)" +
  "document.documentElement.setAttribute('data-motion','on')";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `<html lang>` dit la langue réellement rendue : ni un lecteur d'écran qui lit de
  // l'anglais avec une voix française, ni l'inverse.
  const lang = await getLang();
  const hostSite = await getHostSite();
  return (
    <html
      lang={lang}
      className={`${manrope.variable} ${sourceSans.variable} ${mono.variable}`}
      style={
        {
          "--signal-font-display": manrope.style.fontFamily,
          "--signal-font-body": sourceSans.style.fontFamily,
          "--signal-font-mono": mono.style.fontFamily,
        } as CSSProperties
      }
      // `data-motion` est posé sur `<html>` par le script ci-dessous, avant
      // hydratation : React lit alors un attribut qu'il n'a pas rendu et avertit.
      // L'attribut ne fait pas partie de l'arbre React, il ne sera jamais réconcilié,
      // seul l'avertissement est à taire. Un marqueur en CLASSE aurait été détruit,
      // lui, car `className` de `<html>` est rendu ici et donc géré par React.
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }} />
        <script dangerouslySetInnerHTML={{ __html: SIGNAL_BOOTSTRAP_SCRIPT }} />
        <Motion />
        <SignalBootstrap />
        <LanguageProvider initial={lang}>
          <SiteProvider hostSite={hostSite}>{children}</SiteProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
