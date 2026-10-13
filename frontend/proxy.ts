import { type NextRequest, NextResponse } from "next/server";

import { routeForSite, siteForHost } from "@/lib/sites";

/**
 * Chaque adresse publique montre son site (voir `lib/sites.ts`), avant tout le reste.
 * L'adresse vient de l'en-tête `Host` : `next start` remplit `nextUrl` avec sa propre
 * adresse d'écoute, pas avec celle que le visiteur a demandée.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const route = routeForSite(siteForHost(host), request.nextUrl.pathname, request.nextUrl.search);
  // `route.url` est relatif hors des trois adresses : il reste dans le déploiement courant.
  if (route.kind === "redirect") return NextResponse.redirect(new URL(route.url, request.url), 308);
  if (route.kind === "rewrite") {
    const target = request.nextUrl.clone();
    target.pathname = route.path;
    return NextResponse.rewrite(target);
  }
  return NextResponse.next();
}

export const config = {
  // Les fichiers statiques (icône, logo, médias, polices, images) ne passent pas par
  // le proxy : le logo est demandé sur chaque page.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|xsom-mark.svg|xsom-mark-light.svg|signal-media/|threats/).*)",
  ],
};
