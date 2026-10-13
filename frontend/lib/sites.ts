/**
 * Un seul déploiement, trois adresses publiques. Chaque adresse montre son site :
 * - `ai.xsom.fr` : la division IA de xSOM (prestations, produits, menaces) ;
 * - `fleet.xsom.fr` : xSOM Fleet, la plateforme et ses trois modules ;
 * - `guard.xsom.fr` : Secret Guard, le moteur de détection open source.
 *
 * Le site de conseil de xSOM Consulting reste `www.xsom.fr` (autre dépôt, autre
 * hébergement) : chaque site y renvoie.
 *
 * Toute autre adresse (localhost, prévisualisations Vercel) sert toutes les pages
 * telles quelles, pour le développement et les tests.
 */

export type Site = "ai" | "fleet" | "guard";

export const SITES: readonly Site[] = ["ai", "fleet", "guard"];

export const SITE_ORIGINS: Record<Site, string> = {
  ai: "https://ai.xsom.fr",
  fleet: "https://fleet.xsom.fr",
  guard: "https://guard.xsom.fr",
};

/** Le site de conseil de xSOM Consulting. */
export const MAIN_SITE_ORIGIN = "https://www.xsom.fr";

/** Le dépôt public du moteur de détection de Secret Guard. */
export const SECRET_GUARD_REPOSITORY = "https://github.com/xsom-consulting/secret-guard";

/** Le chemin de la page de chaque site quand une seule adresse les sert toutes. */
export const SITE_HOME_PATH: Record<Site, string> = { ai: "/", fleet: "/fleet", guard: "/secret-guard" };

const LEGAL = ["/mentions-legales", "/confidentialite", "/cookies", "/conditions-utilisation"];

/** Pages publiques propres au site de la division IA. */
const AI_PAGES = ["/menaces"];

/** Anciennes adresses du site des offres IA : elles mènent à la section qui les remplace. */
const LEGACY_AI_ANCHORS: Record<string, string> = { "/produits": "/#produits" };

export type SiteRoute =
  | { kind: "next" }
  | { kind: "rewrite"; path: string }
  | { kind: "redirect"; url: string };

const under = (path: string, prefixes: readonly string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

/** Le site d'une adresse (en-tête `Host`, port éventuel compris), ou `null`. */
export function siteForHost(hostname: string): Site | null {
  const host = hostname.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
  return SITES.find((s) => host === `${s}.xsom.fr`) ?? null;
}

/** Le site qui possède une page publique, ou `null` si la page est commune. */
function ownerOf(path: string): Site | null {
  if (path === "/" || under(path, AI_PAGES)) return "ai";
  if (under(path, ["/fleet"])) return "fleet";
  if (under(path, ["/secret-guard"])) return "guard";
  return null;
}

/**
 * L'adresse absolue d'une page d'un site : `path` est relatif à la racine de ce site
 * (« / » pour sa page d'accueil, « /#produits » pour une ancre).
 */
export function siteUrl(site: Site, path = "/"): string {
  return `${SITE_ORIGINS[site]}${path}`;
}

/**
 * Le lien vers une page d'un site, depuis un site donné. Sur une adresse de production,
 * un lien d'un site à l'autre est absolu ; ailleurs (localhost, prévisualisation), il
 * reste dans le déploiement courant, où toutes les pages sont servies.
 */
export function crossSiteHref(from: Site | null, target: Site, path = "/"): string {
  if (from !== null) return from === target ? path : siteUrl(target, path);
  if (target === "ai") return path;
  // Hors production, la page d'un autre site vit sous son chemin propre ; une ancre
  // (« /#x ») s'y accroche (« /fleet#x »).
  const home = SITE_HOME_PATH[target];
  return path === "/" ? home : `${home}${path.replace(/^\//, "")}`;
}

/**
 * Décide du sort d'une requête selon l'adresse. Les pages légales sont communes. Une
 * page publique demandée sur la mauvaise adresse est redirigée vers la bonne, avec sa
 * requête. La racine de `fleet` et de `guard` affiche leur page sans changer d'URL.
 */
export function routeForSite(site: Site | null, path: string, search: string): SiteRoute {
  const legacy = LEGACY_AI_ANCHORS[path];
  // Une ancienne adresse mène à ce qui la remplace : sur une adresse de production, vers
  // le site IA ; ailleurs, dans le même déploiement, par un chemin relatif.
  if (legacy !== undefined) return { kind: "redirect", url: site === null ? legacy : `${SITE_ORIGINS.ai}${legacy}` };
  if (site === null || under(path, LEGAL)) return { kind: "next" };
  if (path === "/" && site !== "ai") return { kind: "rewrite", path: SITE_HOME_PATH[site] };
  if (site !== "ai" && path === SITE_HOME_PATH[site]) return { kind: "redirect", url: `${SITE_ORIGINS[site]}/${search}` };
  const owner = ownerOf(path);
  if (owner !== null && owner !== site) {
    const target = path === SITE_HOME_PATH[owner] ? "/" : path;
    return { kind: "redirect", url: `${SITE_ORIGINS[owner]}${target}${search}` };
  }
  return { kind: "next" };
}
