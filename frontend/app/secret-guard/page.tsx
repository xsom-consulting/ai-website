import type { Metadata } from "next";

import { SecretGuardPage } from "@/components/secret-guard/SecretGuardPage";
import { SECRET_GUARD_COPY, SECRET_GUARD_HERO_MEDIA, SECRET_GUARD_ORIGIN } from "@/components/secret-guard/secret-guard-copy";
import { getLang } from "@/lib/lang";
import { MAIN_SITE_ORIGIN, SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import "../guard-landing.css";
import "../guard-home.css";
import "../home.css";
import "../secret-guard.css";

/**
 * Titre absolu : le gabarit du site (« · Secret Guard ») ne s'applique pas à la page
 * d'accueil de guard.xsom.fr. L'affiche de la vidéo d'ambiance sert d'image Open Graph.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = SECRET_GUARD_COPY[lang].meta;
  const poster = `${SECRET_GUARD_ORIGIN}${SECRET_GUARD_HERO_MEDIA.poster}`;
  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: { canonical: `${SECRET_GUARD_ORIGIN}/` },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SECRET_GUARD_ORIGIN}/`,
      siteName: "Secret Guard",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      type: "website",
      images: [{ url: poster, width: 1920, height: 1080, alt: copy.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [poster] },
  };
}

/** Données structurées : le logiciel open source et son éditeur. Aucun prix, aucune note. */
function structuredData(lang: "fr" | "en") {
  const copy = SECRET_GUARD_COPY[lang].meta;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Secret Guard",
    url: `${SECRET_GUARD_ORIGIN}/`,
    description: copy.description,
    codeRepository: SECRET_GUARD_REPOSITORY,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    programmingLanguage: "Go",
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

export default async function SecretGuardRoute() {
  const lang = await getLang();
  // `<` échappé : une chaîne du texte ne peut pas refermer la balise de script.
  const json = JSON.stringify(structuredData(lang)).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      <SecretGuardPage />
    </>
  );
}
