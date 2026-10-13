"use client";

import { createContext, useContext } from "react";

import { crossSiteHref, type Site } from "@/lib/sites";

const HostSiteContext = createContext<Site | null>(null);

/**
 * Dit aux composants clients sur quelle adresse publique ils sont rendus. Le serveur
 * la lit dans l'en-tête `Host` (voir `lib/site-host.ts`) ; `null` veut dire
 * « ni l'une des trois adresses » (localhost, prévisualisation).
 */
export function SiteProvider({ hostSite, children }: { hostSite: Site | null; children: React.ReactNode }) {
  return <HostSiteContext.Provider value={hostSite}>{children}</HostSiteContext.Provider>;
}

export function useHostSite(): Site | null {
  return useContext(HostSiteContext);
}

/**
 * Le lien vers une page d'un site. Absolu entre deux adresses de production,
 * relatif au déploiement courant partout ailleurs (voir `crossSiteHref`).
 */
export function useSiteHref(): (target: Site, path?: string) => string {
  const host = useHostSite();
  return (target, path = "/") => crossSiteHref(host, target, path);
}
