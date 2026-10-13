/**
 * La langue, résolue **côté serveur**.
 *
 * Un cookie, lu avant le rendu : le serveur rend déjà la bonne langue, sans bascule
 * après hydratation, et `<html lang>` dit la vérité.
 *
 * **Le français est la valeur par défaut**, et ce n'est pas un réglage : xSOM est un
 * cabinet français, le marché visé l'est, et le site de conseil aussi. L'anglais est la
 * langue alternative, pas la langue de repli. Les deux versions partagent la même URL
 * (la langue tient au cookie) : seul le français est indexable, un robot n'ayant pas de
 * cookie.
 */

import { cookies } from "next/headers";

import type { Lang } from "@/lib/lang-types";

export type { Lang };

export const LANG_COOKIE = "xsom_lang";
export const DEFAULT_LANG: Lang = "fr";

/** La langue de cette requête. Une valeur inconnue retombe sur le défaut. */
export async function getLang(): Promise<Lang> {
  const brut = (await cookies()).get(LANG_COOKIE)?.value;
  return brut === "en" || brut === "fr" ? brut : DEFAULT_LANG;
}
