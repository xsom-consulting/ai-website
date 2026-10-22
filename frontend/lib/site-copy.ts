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

/** La page LinkedIn de xSOM Consulting, et son logo « in » (tracé repris de www.xsom.fr). */
export const LINKEDIN_URL = "https://www.linkedin.com/company/xsom-consulting";
export const LINKEDIN_PATH = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452z";

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
      { label: "Produits", to: { site: "ai", path: "/#produits" } },
      { label: "Prestations", to: { site: "ai", path: "/#prestations" } },
      { label: "Menaces IA", to: { site: "ai", path: "/menaces" } },
      WWW.fr,
    ],
    en: [
      { label: "Products", to: { site: "ai", path: "/#produits" } },
      { label: "Services", to: { site: "ai", path: "/#prestations" } },
      { label: "AI threats", to: { site: "ai", path: "/menaces" } },
      WWW.en,
    ],
  },
  fleet: {
    fr: [
      { label: "Plateforme", to: { site: "fleet", path: "/#promesse" } },
      { label: "Sécurité", to: { site: "fleet", path: "/#securite" } },
      { label: "FinOps", to: { site: "fleet", path: "/#finops" } },
      { label: "Stratégie", to: { site: "fleet", path: "/#strategie" } },
      { label: "Options", to: { site: "fleet", path: "/#options" } },
      { label: "Démo vidéo", to: { site: "fleet", path: "/#film" } },
      { label: "Questions", to: { site: "fleet", path: "/#questions" } },
    ],
    en: [
      { label: "Platform", to: { site: "fleet", path: "/#promesse" } },
      { label: "Security", to: { site: "fleet", path: "/#securite" } },
      { label: "FinOps", to: { site: "fleet", path: "/#finops" } },
      { label: "Strategy", to: { site: "fleet", path: "/#strategie" } },
      { label: "Options", to: { site: "fleet", path: "/#options" } },
      { label: "Video demo", to: { site: "fleet", path: "/#film" } },
      { label: "Questions", to: { site: "fleet", path: "/#questions" } },
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
    fr: "La gestion de l’IA d’entreprise : sécurité sur chaque Poste, pilotage FinOps, stratégie IA.",
    en: "Enterprise AI management: security on every workstation, FinOps steering, AI strategy.",
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
  readonly reach: string;
  readonly write: string;
  readonly linkedin: string;
  readonly rights: string;
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
    reach: "Nous joindre",
    write: "Nous écrire",
    linkedin: "xSOM Consulting sur LinkedIn",
    rights: "Tous droits réservés",
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
    reach: "Get in touch",
    write: "Write to us",
    linkedin: "xSOM Consulting on LinkedIn",
    rights: "All rights reserved",
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
    fr: { title: "xSOM Fleet", description: "xSOM Fleet : la gestion de l’IA d’entreprise. Sécurité sur chaque Poste, pilotage FinOps, stratégie IA." },
    en: { title: "xSOM Fleet", description: "xSOM Fleet: enterprise AI management. Security on every workstation, FinOps steering, AI strategy." },
  },
  guard: {
    fr: { title: "Secret Guard", description: "Secret Guard : le moteur open source (Apache-2.0) de détection de secrets de xSOM. Analyse locale, sans réseau ni modèle de langage." },
    en: { title: "Secret Guard", description: "Secret Guard: xSOM’s open-source (Apache-2.0) secret-detection engine. Local analysis, no network and no language model." },
  },
};
