import type { Metadata } from "next";

import { AiHome } from "@/components/ai/AiHome";
import { AI_COPY, AI_ORIGIN, aiOgImage } from "@/components/ai/ai-copy";
import { getLang } from "@/lib/lang";
import { MAIN_SITE_ORIGIN } from "@/lib/sites";
import "./guard-landing.css";
import "./home.css";
import "./pitch.css";

/**
 * Titre absolu : le gabarit du site (« · xSOM · IA ») ne s'applique pas à la page
 * d'accueil. Une capture de la couverture sert d'image Open Graph.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = AI_COPY[lang].meta;
  const poster = `${AI_ORIGIN}${aiOgImage(lang)}`;
  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: { canonical: `${AI_ORIGIN}/` },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${AI_ORIGIN}/`,
      siteName: lang === "fr" ? "xSOM · IA" : "xSOM · AI",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      type: "website",
      images: [{ url: poster, width: 1200, height: 630, alt: copy.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [poster] },
  };
}

/** Données structurées : la division et son éditeur. Aucun prix, aucune note. */
function structuredData(lang: "fr" | "en") {
  const copy = AI_COPY[lang].meta;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: lang === "fr" ? "xSOM · IA" : "xSOM · AI",
    url: `${AI_ORIGIN}/`,
    description: copy.description,
    inLanguage: lang,
    publisher: {
      "@type": "Organization",
      name: "xSOM Consulting",
      url: MAIN_SITE_ORIGIN,
      email: "julian.talou@xsom.fr",
      address: { "@type": "PostalAddress", addressCountry: "FR" },
    },
  };
}

export default async function LandingPage() {
  const lang = await getLang();
  // `<` échappé : une chaîne du texte ne peut pas refermer la balise de script.
  const json = JSON.stringify(structuredData(lang)).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      <AiHome />
    </>
  );
}
