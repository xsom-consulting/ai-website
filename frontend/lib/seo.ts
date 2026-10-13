/**
 * Adresses canoniques et site d'une page commune, côté serveur.
 */

import type { Metadata } from "next";

import { getHostSite } from "@/lib/site-host";
import { siteUrl, type Site } from "@/lib/sites";

/** L'adresse absolue d'une page, sur le site qui la possède. */
export const canonicalUrl = (site: Site, path = "/") => siteUrl(site, path);

/**
 * Le site d'une page commune aux trois adresses (pages légales) : celui de l'adresse
 * demandée, ou la division IA ailleurs (localhost, prévisualisation).
 */
export async function commonPageSite(): Promise<Site> {
  return (await getHostSite()) ?? "ai";
}

/** Les métadonnées d'une page commune : son titre et son adresse canonique sur le site courant. */
export async function commonPageMetadata(title: string, path: string): Promise<Metadata> {
  const site = await commonPageSite();
  return { title, alternates: { canonical: canonicalUrl(site, path) } };
}
