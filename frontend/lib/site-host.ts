/**
 * L'adresse publique qui répond, lue côté serveur.
 *
 * `next start` remplit `nextUrl` avec sa propre adresse d'écoute, pas avec celle que le
 * visiteur a demandée : l'adresse vient donc de l'en-tête `Host` (ou de
 * `X-Forwarded-Host` derrière un relais), comme dans `proxy.ts`.
 */

import { headers } from "next/headers";

import { siteForHost, type Site } from "@/lib/sites";

/** L'en-tête `Host` de la requête, tel que le visiteur l'a demandé. */
export async function requestHost(): Promise<string> {
  const list = await headers();
  return list.get("x-forwarded-host") ?? list.get("host") ?? "";
}

/** Le site de l'adresse demandée, ou `null` hors des trois adresses publiques. */
export async function getHostSite(): Promise<Site | null> {
  return siteForHost(await requestHost());
}
