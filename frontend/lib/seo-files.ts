/**
 * `robots.txt`, `sitemap.xml` et `llms.txt` de chacun des trois sites, servis selon
 * l'adresse demandée (voir `app/robots.txt/route.ts` et ses voisins).
 *
 * Sur une adresse de production, chaque site déclare ses propres pages et son propre
 * plan. Ailleurs (localhost, prévisualisation Vercel), rien n'est à indexer :
 * `robots.txt` interdit tout et le plan est vide.
 */

import { MAIN_SITE_ORIGIN, SECRET_GUARD_REPOSITORY, SITE_ORIGINS, type Site } from "@/lib/sites";

/** Les pages de contenu de chaque site, dans l'ordre du plan. Les pages légales n'y figurent pas. */
export const SITE_PAGES: Record<Site, readonly string[]> = {
  ai: ["/", "/menaces"],
  fleet: ["/"],
  guard: ["/"],
};

export function robotsTxt(site: Site | null): string {
  if (site === null) return "User-agent: *\nDisallow: /\n";
  return `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_ORIGINS[site]}/sitemap.xml\n`;
}

export function sitemapXml(site: Site | null): string {
  const urls = site === null ? [] : SITE_PAGES[site].map((path) => `${SITE_ORIGINS[site]}${path}`);
  const entries = urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

const FLEET_SUMMARY =
  "xSOM Fleet : la plateforme de gouvernance des IA d’une entreprise. Claude Code et Codex sur chaque Poste (Windows, macOS, Linux), les applications API par une passerelle installée chez le client. Trois modules, disponibles pour pilote : Fleet Sièges (Sièges, coûts, couverture), Fleet Guard (Contrôle avant envoi sur le Poste, Journal des blocages, Dossier de preuves) et Fleet Gateway (passerelle LiteLLM installée chez le client, Budgets API par application). D’autres assistants suivront.";

/** Le texte `llms.txt` de chaque site : ce que c'est, et où lire le détail. */
export function llmsTxt(site: Site | null): string {
  const origin = (s: Site) => SITE_ORIGINS[s];
  if (site === "ai" || site === null) {
    const base = site === null ? "" : origin("ai");
    return `# xSOM · IA

> La division IA de xSOM Consulting : prestations de conseil IA et produits pour utiliser l’IA en entreprise. (EN: the AI division of xSOM Consulting, AI consulting services and products for using AI in the enterprise.)

## Pages

- [Accueil](${base}/) : les prestations IA (reprises du site de conseil), les produits IA et les équipes face à l’IA.
- [Glossaire des menaces IA](${base}/menaces) : attaque type, parade de référence, outils libres et état de l’art de chaque menace.

## Produits

- [xSOM Fleet](${origin("fleet")}/) : ${FLEET_SUMMARY}
- [Secret Guard](${origin("guard")}/) : le moteur de détection de secrets de xSOM, open source (Apache-2.0), analyse locale sans réseau ni modèle de langage.
- [Secret Guard, code source](${SECRET_GUARD_REPOSITORY})

## Cabinet

- [xSOM Consulting](${MAIN_SITE_ORIGIN}) : le site principal de conseil de xSOM Consulting.
`;
  }
  if (site === "fleet") {
    return `# xSOM Fleet

> ${FLEET_SUMMARY} (EN: the governance platform for a company’s AI: Claude Code and Codex on every workstation, API applications through a gateway installed on the customer’s side.)

## Pages

- [xSOM Fleet](${origin("fleet")}/) : la plateforme et ses trois modules, pourquoi la choisir (coût des Sièges, pilotage FinOps avec la Facture réelle face à l’Équivalent API estimé, sécurité), cinq films « Comment ça marche », les licences, sources et engagements (Secret Guard en Apache-2.0, LiteLLM en partie MIT, SBOM CycloneDX, ce que xSOM ne voit jamais, Dossier de preuves) et les questions fréquentes.

## Liens

- [xSOM · IA](${origin("ai")}/) : la division IA de xSOM Consulting.
- [Secret Guard](${origin("guard")}/) : le moteur open source de détection de secrets de Fleet Guard.
- [xSOM Consulting](${MAIN_SITE_ORIGIN}) : le site principal de conseil.
`;
  }
  return `# Secret Guard

> Le moteur de détection de secrets de xSOM, open source (Apache-2.0). Règles explicites et calcul d’entropie, analyse locale, sans réseau ni modèle de langage. (EN: xSOM’s open-source secret-detection engine.)

## Pages

- [Secret Guard](${origin("guard")}/) : ce que fait le moteur, comment il fonctionne, son code ouvert, son rôle dans xSOM Fleet. Une nouvelle version de l’extension VS Code, branchée sur ce moteur, est en préparation.

## Liens

- [Code source](${SECRET_GUARD_REPOSITORY}) : le dépôt public du moteur, sous licence Apache-2.0.
- [xSOM Fleet](${origin("fleet")}/) : la plateforme qui intègre le moteur dans son module Fleet Guard.
- [xSOM · IA](${origin("ai")}/) : la division IA de xSOM Consulting.
- [xSOM Consulting](${MAIN_SITE_ORIGIN}) : le site principal de conseil.
`;
}
