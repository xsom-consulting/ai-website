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
  fleet: ["/", "/details"],
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
- [Secret Guard](${origin("guard")}/) : bloque ou masque les secrets avant l’envoi aux assistants d’IA, analyse locale sans réseau ni modèle de langage ; gratuit jusqu’à 3 Postes ; détection en Apache-2.0, expurgation sous PolyForm Small Business 1.0.0.
- [Secret Guard, code source](${SECRET_GUARD_REPOSITORY})

## Cabinet

- [xSOM Consulting](${MAIN_SITE_ORIGIN}) : le site principal de conseil de xSOM Consulting.
`;
  }
  if (site === "fleet") {
    return `# xSOM Fleet

> ${FLEET_SUMMARY} (EN: enterprise AI management: Claude Code and Codex on every workstation, API models and models hosted on the customer’s side through a gateway; security, FinOps steering and AI strategy.)

## Pages

- [xSOM Fleet](${origin("fleet")}/) : la page produit. Promesse : les assistants de code pour toute l’entreprise, sans fuite de secrets. Sécurité (Fleet Guard) : les secrets expurgés sur le Poste avant l’envoi, pas seulement bloqués, même dans les images ; Claude Code, Codex, GitHub Copilot CLI, Claude Desktop (Mode précis, macOS), le web par extension de navigateur ; deux captures vidéo réelles. FinOps (Fleet Sièges) : le coût réel par Développeur et par Équipe ; mesure réelle chez xSOM en septembre 2026 avec ccusage : forfait Claude de 200 $ par mois pour 7 815 $ d’usage au tarif API (estimation), soit 39 fois son prix ; la console sur données de démonstration. Stratégie (Fleet Gateway, disponible pour pilote) : abonnements, API ou modèle chez le client, choisis sur des chiffres. Preuves pour l’audit : Dossier de preuves, Journal des blocages, Événements sans contenu ; détection de Secret Guard en Apache-2.0, expurgation sous PolyForm Small Business 1.0.0. Déploiement en trois étapes (Client Fleet sur chaque Poste, Politique signée, console). Démo vidéo, questions fréquentes, demande de démonstration ou de tarif.
- [xSOM Fleet en détail](${origin("fleet")}/details) : le schéma complet, le message de blocage et l’Événement, la simulation des coûts aux hypothèses affichées, le schéma interactif d’une entreprise type et la matrice des options, les licences, sources et engagements.
- [Console xSOM Fleet](https://plateforme.xsom.fr) : la connexion des Administrateurs.

## Liens

- [xSOM · IA](${origin("ai")}/) : la division IA de xSOM Consulting.
- [Secret Guard](${origin("guard")}/) : le moteur open source de détection de secrets de Fleet Guard.
- [xSOM Consulting](${MAIN_SITE_ORIGIN}) : le site principal de conseil.
`;
  }
  return `# Secret Guard

> Secret Guard protège les assistants d’IA (Claude Code, Codex, GitHub Copilot CLI ; ChatGPT et Claude dans le navigateur, bientôt) : avant l’envoi, le Client Fleet installé sur le Poste analyse le prompt et les fichiers lus, localement, sans réseau ni modèle de langage, puis bloque l’envoi ou remplace la valeur par un Substitut. Rien ne quitte le Poste. Gratuit jusqu’à 3 Postes. (EN: Secret Guard keeps secrets on the workstation when using AI assistants; free for up to 3 workstations.)

## Pages

- [Secret Guard](${origin("guard")}/) : ce que ça fait (bloquer, masquer par un Substitut, captures d’écran, mascotte, faux positifs), comment l’installer (macOS, Linux, Windows en essai ; extension du navigateur bientôt), ce qui ne quitte jamais la machine, les licences, et xSOM Fleet pour une entreprise.
- [Créer un compte gratuit](https://plateforme.xsom.fr/inscription) : inscription ouverte, par adresse courriel ou GitHub.

## Liens

- [Code source](${SECRET_GUARD_REPOSITORY}) : le dépôt public ; la détection sous licence Apache-2.0, l’expurgation (dossier expurgation/) sous PolyForm Small Business 1.0.0 (gratuite pour moins de 100 personnes et moins de 1 M$ de revenu, sinon licence écrite de xSOM).
- [xSOM Fleet](${origin("fleet")}/) : la plateforme qui intègre le moteur dans son module Fleet Guard.
- [xSOM · IA](${origin("ai")}/) : la division IA de xSOM Consulting.
- [xSOM Consulting](${MAIN_SITE_ORIGIN}) : le site principal de conseil.
`;
}
