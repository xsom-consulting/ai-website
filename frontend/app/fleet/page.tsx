import type { Metadata } from "next";

import { FleetPage } from "@/components/fleet/FleetPage";
import { FLEET_COPY, FLEET_ORIGIN, fleetOgImage } from "@/components/fleet/fleet-copy";
import { getLang } from "@/lib/lang";
import "../guard-landing.css";
import "../guard-home.css";
import "../home.css";
import "../fleet.css";

/**
 * Titre absolu : le gabarit du site (« · xSOM Fleet ») ne s'applique pas à
 * la page d'accueil de fleet.xsom.fr. Une capture du haut de page sert d'image Open Graph.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = FLEET_COPY[lang].meta;
  const poster = `${FLEET_ORIGIN}${fleetOgImage(lang)}`;
  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: { canonical: `${FLEET_ORIGIN}/` },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${FLEET_ORIGIN}/`,
      siteName: "xSOM Fleet",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      type: "website",
      images: [{ url: poster, width: 1920, height: 992, alt: copy.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [poster] },
  };
}

/** Données structurées : le logiciel et son éditeur. Aucun prix, aucune note. */
function structuredData(lang: "fr" | "en") {
  const copy = FLEET_COPY[lang].meta;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "xSOM Fleet",
    url: `${FLEET_ORIGIN}/`,
    description: copy.description,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "SecurityApplication",
    operatingSystem: "Windows, macOS, Linux",
    inLanguage: lang,
    image: `${FLEET_ORIGIN}${fleetOgImage(lang)}`,
    publisher: {
      "@type": "Organization",
      name: "xSOM Consulting",
      url: "https://www.xsom.fr",
      email: "julian.talou@xsom.fr",
      address: { "@type": "PostalAddress", addressCountry: "FR" },
    },
  };
}

export default async function FleetRoute() {
  const lang = await getLang();
  // `<` échappé : une chaîne du texte ne peut pas refermer la balise de script.
  const json = JSON.stringify(structuredData(lang)).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      <FleetPage />
    </>
  );
}
