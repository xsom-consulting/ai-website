/**
 * La marque, la navigation et le pied de page de chacun des trois sites.
 *
 * Un site, une marque : « xSOM · IA », « xSOM Fleet », « Secret Guard ». Chaque site
 * renvoie au site de conseil `www.xsom.fr`. Les liens d'un site à l'autre passent par
 * `crossSiteHref` : absolus sur les adresses de production, relatifs ailleurs.
 */

import { MAIN_SITE_ORIGIN, SECRET_GUARD_REPOSITORY, type Site } from "@/lib/sites";
import type { Lang } from "@/lib/lang-types";

export const CONTACT_EMAIL = "julian.talou@xsom.fr";

/** Où mène un lien : une page d'un des trois sites, ou une adresse externe. */
export type NavTarget =
  | { readonly site: Site; readonly path?: string }
  | { readonly href: string };

export interface NavItem {
  readonly label: string;
  readonly to: NavTarget;
}

/** Le nom de la marque, en deux parties : le second mot porte la couleur d'accent. */
export const BRAND: Record<Site, Record<Lang, { readonly lead: string; readonly product: string }>> = {
  ai: { fr: { lead: "xSOM", product: "· IA" }, en: { lead: "xSOM", product: "· AI" } },
  fleet: { fr: { lead: "xSOM", product: "Fleet" }, en: { lead: "xSOM", product: "Fleet" } },
  guard: { fr: { lead: "Secret", product: "Guard" }, en: { lead: "Secret", product: "Guard" } },
};

/** Le nom d'une marque en une seule chaîne, pour un titre ou un nom accessible. */
export const brandName = (site: Site, lang: Lang = "fr") => `${BRAND[site][lang].lead} ${BRAND[site][lang].product}`;

const WWW: Record<Lang, NavItem> = {
  fr: { label: "xSOM Consulting", to: { href: MAIN_SITE_ORIGIN } },
  en: { label: "xSOM Consulting", to: { href: MAIN_SITE_ORIGIN } },
};

/** Le menu de l'en-tête de chaque site. */
export const NAV: Record<Site, Record<Lang, readonly NavItem[]>> = {
  ai: {
    fr: [
      { label: "Prestations", to: { site: "ai", path: "/#prestations" } },
      { label: "Produits", to: { site: "ai", path: "/#produits" } },
      { label: "Menaces IA", to: { site: "ai", path: "/menaces" } },
      WWW.fr,
    ],
    en: [
      { label: "Services", to: { site: "ai", path: "/#prestations" } },
      { label: "Products", to: { site: "ai", path: "/#produits" } },
      { label: "AI threats", to: { site: "ai", path: "/menaces" } },
      WWW.en,
    ],
  },
  fleet: {
    fr: [
      { label: "Pourquoi Fleet", to: { site: "fleet", path: "/#pourquoi" } },
      { label: "Comment ça marche", to: { site: "fleet", path: "/#fonctionnement" } },
      { label: "Engagements", to: { site: "fleet", path: "/#engagements" } },
      { label: "Questions", to: { site: "fleet", path: "/#questions" } },
      { label: "Division IA", to: { site: "ai" } },
      WWW.fr,
    ],
    en: [
      { label: "Why Fleet", to: { site: "fleet", path: "/#pourquoi" } },
      { label: "How it works", to: { site: "fleet", path: "/#fonctionnement" } },
      { label: "Commitments", to: { site: "fleet", path: "/#engagements" } },
      { label: "Questions", to: { site: "fleet", path: "/#questions" } },
      { label: "AI division", to: { site: "ai" } },
      WWW.en,
    ],
  },
  guard: {
    fr: [
      { label: "Comment ça marche", to: { site: "guard", path: "/#fonctionnement" } },
      { label: "Open source", to: { site: "guard", path: "/#open-source" } },
      { label: "Dans xSOM Fleet", to: { site: "guard", path: "/#fleet" } },
      { label: "Division IA", to: { site: "ai" } },
      WWW.fr,
    ],
    en: [
      { label: "How it works", to: { site: "guard", path: "/#fonctionnement" } },
      { label: "Open source", to: { site: "guard", path: "/#open-source" } },
      { label: "In xSOM Fleet", to: { site: "guard", path: "/#fleet" } },
      { label: "AI division", to: { site: "ai" } },
      WWW.en,
    ],
  },
};

/** La phrase d'identité du pied de page de chaque site. */
export const FOOTER_TAGLINE: Record<Site, Record<Lang, string>> = {
  ai: {
    fr: "La division IA de xSOM Consulting : des prestations et des produits pour utiliser l’IA en entreprise.",
    en: "The AI division of xSOM Consulting: services and products for using AI in the enterprise.",
  },
  fleet: {
    fr: "La plateforme de gouvernance de vos IA : Sièges, coûts, sécurité sur le Poste, preuves.",
    en: "The governance platform for your AI: seats, costs, security on the workstation, evidence.",
  },
  guard: {
    fr: "Le moteur de détection de secrets de xSOM, open source (Apache-2.0).",
    en: "xSOM’s secret-detection engine, open source (Apache-2.0).",
  },
};

/** Les quatre sites, dans la colonne « Les sites xSOM » du pied de page. */
export const SITE_LINKS: Record<Lang, readonly NavItem[]> = {
  fr: [
    { label: "xSOM · IA", to: { site: "ai" } },
    { label: "xSOM Fleet", to: { site: "fleet" } },
    { label: "Secret Guard", to: { site: "guard" } },
    { label: "Code de Secret Guard", to: { href: SECRET_GUARD_REPOSITORY } },
    { label: "xSOM Consulting (www.xsom.fr)", to: { href: MAIN_SITE_ORIGIN } },
  ],
  en: [
    { label: "xSOM · AI", to: { site: "ai" } },
    { label: "xSOM Fleet", to: { site: "fleet" } },
    { label: "Secret Guard", to: { site: "guard" } },
    { label: "Secret Guard source code", to: { href: SECRET_GUARD_REPOSITORY } },
    { label: "xSOM Consulting (www.xsom.fr)", to: { href: MAIN_SITE_ORIGIN } },
  ],
};

export const LEGAL_LINKS: Record<Lang, readonly { readonly label: string; readonly path: string }[]> = {
  fr: [
    { label: "Mentions légales", path: "/mentions-legales" },
    { label: "Politique de confidentialité", path: "/confidentialite" },
    { label: "Cookies et préférences", path: "/cookies" },
    { label: "Conditions d’utilisation", path: "/conditions-utilisation" },
  ],
  en: [
    { label: "Legal notice", path: "/mentions-legales" },
    { label: "Privacy policy", path: "/confidentialite" },
    { label: "Cookies and preferences", path: "/cookies" },
    { label: "Terms of use", path: "/conditions-utilisation" },
  ],
};

export const SITE_UI: Record<Lang, {
  readonly mainNav: string;
  readonly explore: string;
  readonly sites: string;
  readonly legal: string;
  readonly display: string;
  readonly home: string;
  readonly menu: string;
  readonly closeMenu: string;
}> = {
  fr: {
    mainNav: "Navigation principale",
    explore: "Explorer",
    sites: "Les sites xSOM",
    legal: "Informations légales",
    display: "Préférences d’affichage",
    home: "Accueil",
    menu: "Menu",
    closeMenu: "Fermer",
  },
  en: {
    mainNav: "Main navigation",
    explore: "Explore",
    sites: "xSOM sites",
    legal: "Legal information",
    display: "Display preferences",
    home: "Home",
    menu: "Menu",
    closeMenu: "Close",
  },
};

/** Le titre et la description par défaut de chaque site, pour une page qui n'a pas les siens. */
export const SITE_DEFAULT_META: Record<Site, Record<Lang, { readonly title: string; readonly description: string }>> = {
  ai: {
    fr: { title: "xSOM · IA", description: "La division IA de xSOM Consulting : prestations de conseil IA et produits pour utiliser l’IA en entreprise." },
    en: { title: "xSOM · AI", description: "The AI division of xSOM Consulting: AI consulting services and products for using AI in the enterprise." },
  },
  fleet: {
    fr: { title: "xSOM Fleet", description: "xSOM Fleet : les meilleurs modèles d’IA, aux standards de sécurité de l’entreprise. Coûts, sécurité sur le Poste, preuves." },
    en: { title: "xSOM Fleet", description: "xSOM Fleet: the best AI models, at enterprise security standards. Costs, security on the workstation, evidence." },
  },
  guard: {
    fr: { title: "Secret Guard", description: "Secret Guard : le moteur open source (Apache-2.0) de détection de secrets de xSOM. Analyse locale, sans réseau ni modèle de langage." },
    en: { title: "Secret Guard", description: "Secret Guard: xSOM’s open-source (Apache-2.0) secret-detection engine. Local analysis, no network and no language model." },
  },
};
