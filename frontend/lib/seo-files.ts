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
  "xSOM Fleet : la gestion de l’IA d’entreprise. Abonnements Claude et ChatGPT (Claude Code et Codex sur chaque Poste, Windows, macOS, Linux), clés API et modèles hébergés chez le client, gouvernés depuis une seule console. Trois piliers : sécurité (Fleet Guard : Contrôle avant envoi sur le Poste avec le moteur open source Secret Guard, Politique signée, Événements sans contenu, Dossier de preuves), pilotage FinOps (Fleet Sièges : Sièges, Facture réelle, Équivalent API estimé) et stratégie IA (Fleet Gateway, disponible pour pilote : passerelle LiteLLM installée chez le client, Politique de sélection des modèles, Budgets API, déploiement progressif). Programme pilote 2026, tarif sur devis.";

/** Le texte `llms.txt` de chaque site : ce que c'est, et où lire le détail. */
export function llmsTxt(site: Site | null): string {
  const origin = (s: Site) => SITE_ORIGINS[s];
  if (site === "ai" || site === null) {
    const base = site === null ? "" : origin("ai");
    return `# xSOM · IA

> La division IA de xSOM Consulting : prestations de conseil IA et produits pour utiliser l’IA en entreprise. (EN: the AI division of xSOM Consulting, AI consulting services and products for using AI in the enterprise.)

## Pages

- [Accueil](${base}/) : qui nous sommes (la division IA de xSOM Consulting, cabinet indépendant depuis 2007), nos produits (xSOM Fleet, Secret Guard), nos prestations de conseil IA (infrastructures IA et cloud souverain, données et MLOps, sécurité des pipelines IA) et le contact.
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

> ${FLEET_SUMMARY} (EN: enterprise AI management: Claude Code and Codex on every workstation, API models and models hosted on the customer’s side through a gateway; security, FinOps steering and AI strategy.)

## Pages

- [xSOM Fleet](${origin("fleet")}/) : une lecture en chapitres. Couverture : la gestion de l’IA d’entreprise et son schéma (vos IA, xSOM Fleet, vos équipes). 01 Sécurité : les meilleures IA, accessibles en toute sécurité (analyse locale sur le Poste, blocage avant envoi avec le message réel de l’Agent xSOM, Événement sans contenu, Politique signée). 02 FinOps : réduire fortement le budget IA (mesure réelle chez xSOM en septembre 2026 avec ccusage : forfait Claude de 200 $ par mois pour 7 815 $ d’usage au tarif API, soit 39 fois son prix ; Codex : forfait de 103 € TTC pour 1 173 $ ; une simulation Sankey aux hypothèses affichées ; la console, Coûts et Sièges, sur données de démonstration). 03 Stratégie : le bon modèle pour chaque cas métier, par une passerelle installée chez le client (Fleet Gateway, disponible pour pilote). 04 Démo vidéo : le film de présentation avec voix off et chapitres. 05 Licences, sources et engagements (Secret Guard en Apache-2.0, LiteLLM en partie MIT, SBOM CycloneDX, hébergement UE ou chez le client, 0 prompt chez xSOM, Dossier de preuves). 06 Questions fréquentes, puis la demande de démonstration ou de tarif.
- [Console xSOM Fleet](https://plateforme.xsom.fr) : la connexion des Administrateurs.

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
