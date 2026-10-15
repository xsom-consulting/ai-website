import type { FilmMedia } from "@/components/home/HomeFilm";
import type { Lang } from "@/lib/i18n";

/**
 * La page xSOM Fleet. La promesse d'abord, avec son illustration animée : les meilleurs
 * modèles d'IA du marché, aux standards de sécurité de l'entreprise. Puis la phrase qui
 * définit la plateforme (piloter toute l'architecture IA en un seul endroit), la ligne
 * « Pris en charge » et les trois solutions, le film, les raisons de la choisir en
 * grille, le film « Comment ça marche », les licences et engagements en badges, enfin
 * les questions. Une phrase par bloc ; le reste est visuel.
 *
 * Règles : aucun client nommé, aucun prix de licence publié, aucun chiffre sans source
 * (la mesure de la tuile Coût est datée, sourcée et montrée, `FLEET_MEASUREMENT`) ; aucune
 * promesse de « conformité » ; toute simulation porte « Simulation · hypothèses
 * affichées » ; toute donnée tirée de la console porte « Démonstration · données
 * illustratives ». Les logos des fournisseurs sont cités en usage nominatif seulement.
 * Assistants couverts : Claude Code et Codex sur le Poste ; les modèles par API et les
 * modèles hébergés chez le client passent par la passerelle (Fleet Gateway, disponible
 * pour pilote) ; aucun fournisseur d'API n'est nommé tant que la version de LiteLLM
 * n'est pas épinglée. Vocabulaire : glossaire du PRD (§3).
 */

export const FLEET_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet";
/** La demande de simulation des coûts : même adresse, objet distinct. */
export const FLEET_SIMULATION_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet%20%C2%B7%20simulation";
/** La demande de tarif : le prix ne se publie pas, il se demande. */
export const FLEET_PRICE_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet%20%C2%B7%20tarif";
export const FLEET_ORIGIN = "https://fleet.xsom.fr";

const MEDIA = "/signal-media";

/** Le film d'ouverture (Remotion : `films/src/fleet/v2/FleetAd.tsx`), un par langue. */
export const FLEET_HERO_MEDIA: FilmMedia = {
  fr: {
    mp4: `${MEDIA}/xsom-fleet-hero-v2-fr.mp4`,
    poster: `${MEDIA}/xsom-fleet-hero-v2-fr.jpg`,
    name: "Film d’introduction xSOM Fleet",
    label: "Film d’introduction de xSOM Fleet, vingt secondes sans parole : toutes les meilleures IA réunies, une clé masquée arrêtée sur le Poste, une Politique signée appliquée partout, les coûts du Groupe de démonstration, puis la promesse : les meilleures IA pour toute votre entreprise, la sécurité reste chez vous.",
  },
  en: {
    mp4: `${MEDIA}/xsom-fleet-hero-v2-en.mp4`,
    poster: `${MEDIA}/xsom-fleet-hero-v2-en.jpg`,
    name: "xSOM Fleet introduction film",
    label: "xSOM Fleet introduction film, twenty seconds without speech: all the best AI brought together, a masked key stopped on the workstation, a signed Policy applied everywhere, the costs of the demonstration group, then the promise: the best AI for your whole company, security stays with you.",
  },
};

/** Le film « Comment ça marche » (Remotion : `films/src/fleet/v2/HowV2.tsx`), avec voix off. */
export const fleetHowMedia = (lang: Lang) => ({
  mp4: `${MEDIA}/xsom-fleet-how-v2-${lang}.mp4`,
  poster: `${MEDIA}/xsom-fleet-how-v2-${lang}.jpg`,
});

/**
 * Le prix du forfait Codex de xSOM (septembre 2026), dans sa devise : 103 € TTC par
 * mois, à confirmer sur la facture avant la mise en ligne. `null` : la ligne Codex
 * n'affiche que l'usage. Jamais converti, jamais additionné aux dollars : aucun ratio
 * global n'est calculé.
 */
export const CODEX_PLAN: { amount: number; currency: "EUR"; taxIncluded: boolean } | null = { amount: 103, currency: "EUR", taxIncluded: true };

/**
 * La mesure de la tuile Coût : l'usage réel de xSOM en septembre 2026, relevé par l'outil
 * libre ccusage (`ccusage monthly --since 20260901 --until 20260930`) sur les journaux
 * d'un seul Poste, aux tarifs API de l'outil (capture `xsom-ccusage-2026-09.png`, texte
 * exact) : Claude 7814,73 $, Codex 1173,27 $, total 8988,00 $. Forfait Claude : 200 $ par
 * mois (216 € TTC). Montants en cents ; les longueurs des barres en viennent (Claude : 1
 * pour 39).
 */
export const FLEET_MEASUREMENT = {
  totalUsageCents: 898_800,
  claude: { planCents: 20_000, usageCents: 781_473 },
  codex: { usageCents: 117_327 },
  capture: { webp: `${MEDIA}/xsom-ccusage-2026-09.webp`, png: `${MEDIA}/xsom-ccusage-2026-09.png`, width: 2362, height: 1200 },
} as const;

/** La ligne Codex de la tuile Coût, selon `CODEX_PLAN` ; aucun ratio entre devises. */
export const codexMeasureLine = (lang: Lang) => {
  if (!CODEX_PLAN) return lang === "fr" ? "Codex : 1 173 $ d’usage au tarif API." : "Codex: $1,173 of usage at API rates.";
  const price = lang === "fr"
    ? `${CODEX_PLAN.amount} €${CODEX_PLAN.taxIncluded ? " TTC" : " HT"}`
    : `€${CODEX_PLAN.amount}${CODEX_PLAN.taxIncluded ? " incl. VAT" : " excl. VAT"}`;
  return lang === "fr"
    ? `Forfait Codex à ${price} par mois : 1 173 $ d’usage au tarif API.`
    : `Codex plan at ${price} per month: $1,173 of usage at API rates.`;
};

/**
 * Chiffres des tuiles « Pourquoi » : ceux du Groupe de démonstration de xSOM Fleet
 * (`fleet-ops demo-data generate` : 450 Développeurs, 6 Équipes, 438 Postes sains sur
 * 450) et, pour les barres FinOps, sa page Coûts, vue Groupe, septembre 2026 : Facture
 * réelle 25 476,00 $, Équivalent API estimé 44 043,62 $ (en cents, comme les films).
 * Affichés avec « Démonstration · données illustratives ».
 */
export const FLEET_DEMO_FIGURES = {
  developers: 450,
  teams: 6,
  healthyPostes: 438,
  postes: 450,
  realInvoiceCents: 2_547_600,
  apiEquivalentCents: 4_404_362,
} as const;

type Chapter = { readonly id: string; readonly at: number; readonly title: string; readonly body: string };

export const FLEET_COPY = {
  fr: {
    meta: {
      title: "xSOM Fleet · Gouvernance des usages IA en entreprise",
      description: "Gouvernez les usages IA de vos équipes : suivi des abonnements, Contrôle avant envoi sur le Poste et preuves pour l’audit. Programme pilote 2026.",
      ogAlt: "xSOM · Architectural illustration",
    },
    film: {
      fallback: "Pilotez toute votre architecture IA en un seul endroit.",
    },
    hero: {
      badge: "Programme pilote 2026",
      title: ["Vos usages IA,", "des règles communes."],
      lead: "Suivez les abonnements, appliquez le Contrôle avant envoi sur les Postes couverts et rassemblez les preuves pour l’audit.",
      contact: "Demander une démonstration",
      how: "Comment ça marche",
      visual: {
        label: "Illustration animée : une grille de Postes s’allume ; un prompt qui porte une clé masquée se brise sur la ligne du Poste ; le cachet « Politique signée » se propage à tous les Postes.",
        poste: "Poste",
        prompt: "prompt",
        blocked: "Bloqué sur le Poste",
        seal: "Politique signée",
      },
    },
    platform: {
      punch: "Un cadre commun.",
      rest: "Trois rôles complémentaires.",
      supported: {
        label: "Pris en charge",
        subscriptions: "Abonnements",
        gateway: "Par la passerelle",
        claude: { name: "Claude", product: "Claude Code" },
        chatgpt: { name: "ChatGPT", product: "Codex" },
        api: { name: "Modèles par API", detail: "vos clés" },
        hosted: { name: "Vos modèles", detail: "hébergés chez vous" },
      },
      badge: "Disponible pour pilote",
      modules: [
        { name: "Fleet Sièges", title: "Suivre les abonnements et les coûts", line: "Sièges, Facture réelle, Équivalent API estimé et Paliers de siège." },
        { name: "Fleet Guard", title: "Contrôler avant l’envoi", line: "Contrôle avant envoi sur le Poste, Politique signée, Journal des blocages et Dossier de preuves.", engine: "Moteur open source : Secret Guard" },
        { name: "Fleet Gateway", title: "Encadrer les accès aux modèles", line: "Gestion et pilotage de la stratégie IA de l’entreprise : Applications API, Budgets API, modèles hébergés chez vous." },
      ],
    },
    why: {
      title: "Distinguer ce que vous payez de ce que vous utilisez.",
      demo: "Démonstration · données illustratives",
      cost: {
        name: "Coût",
        line: "La Facture réelle et l’Équivalent API estimé répondent à deux questions différentes. Fleet les présente côte à côte, par Développeur et par Équipe.",
        measure: "Mesuré chez xSOM en septembre 2026, sur deux assistants : 8 988 $ d’usage au tarif API.",
        claudeLine: "Forfait Claude à 200 $ par mois (216 € TTC) : 7 815 $ d’usage au tarif API, 39 fois son prix.",
        measureNote: "Relevé avec ccusage (outil libre) sur les journaux d’un seul Poste, un utilisateur intensif. Les tarifs API sont ceux de l’outil ; c’est une estimation, pas une moyenne.",
        plan: "Forfait",
        usage: "Usage au tarif API",
        claudePlan: "200 $",
        claudeUsage: "7 815 $",
        codexUsage: "1 173 $",
        ratio: "× 39",
        capture: "Voir le relevé ccusage",
        captureAlt: "Sortie de ccusage dans un terminal, commande ccusage monthly --since 20260901 --until 20260930 : rapport mensuel 2026-09 de Claude, Codex et OpenClaw ; Cost (USD) $7814.73 pour Claude et $1173.27 pour Codex, mis en évidence, $0.00 pour OpenClaw, total $8988.00.",
        captureClose: "Fermer le relevé",
        action: "Demander la simulation pour votre entreprise",
        actionNote: "Simulation · hypothèses affichées",
      },
      price: {
        name: "Tarif",
        line: "Un abonnement annuel par développeur gouverné, sur devis.",
        action: "Demander un tarif",
      },
      finops: {
        name: "Pilotage FinOps",
        line: "La Facture réelle face à l’Équivalent API estimé, jamais additionnés.",
        real: "Facture réelle",
        estimate: "Équivalent API estimé",
        estimateTag: "estimation",
        count: "Développeurs suivis, dans 6 Équipes",
      },
      security: {
        name: "Le Contrôle avant envoi",
        line: "Secrets, Instructions cachées et fichiers cités bloqués sur le Poste, avant envoi.",
        count: "Postes sains",
      },
    },
    how: {
      title: "De la console au Poste.",
      demo: "Démonstration · données illustratives",
      film: "Film « Comment ça marche » de xSOM Fleet, avec voix off et sous-titres incrustés : choisir ses IA, une Politique signée pour tous les Postes, la supervision de chaque Poste, un secret arrêté sur le Poste, la facture IA, puis le Dossier de preuves. Captures de la console sur des données de démonstration.",
      play: "Lire le film",
      pause: "Mettre le film en pause",
      unmute: "Activer le son",
      mute: "Couper le son",
      chapters: "Chapitres du film",
      steps: [
        { id: "choose", at: 0, title: "Choisissez vos IA", body: "Abonnements et API réunis au même endroit, sans dépendre d’un seul fournisseur." },
        { id: "policy", at: 10.55, title: "Une seule Politique pour tous les Postes", body: "Une Politique signée, vérifiée puis appliquée sur chaque Poste." },
        { id: "coverage", at: 19.55, title: "Supervisez", body: "L’état de chaque Poste, et la liste de ceux qui sont en écart." },
        { id: "invisible", at: 28.55, title: "Le contrôle sur le Poste", body: "Un secret détecté est arrêté sur le Poste, sans réseau ni modèle d’IA." },
        { id: "costs", at: 41.07, title: "Maîtrisez votre facture IA", body: "La Facture réelle à côté de l’Équivalent API estimé, et le bon forfait pour chaque Développeur." },
        { id: "proof", at: 53.78, title: "Rassemblez les preuves", body: "Un Dossier de preuves pour examiner les contrôles et leurs résultats." },
      ] satisfies readonly Chapter[],
    },
    commitments: {
      title: "Un périmètre clair, des éléments vérifiables.",
      lead: "Le pilote précise les intégrations couvertes, les données traitées et les preuves disponibles.",
      badges: [
        { id: "apache", value: "Apache-2.0", caption: "Secret Guard, le moteur de détection, en code ouvert", link: true },
        { id: "mit", value: "MIT", caption: "LiteLLM, sa seule partie MIT, à une version épinglée" },
        { id: "sbom", value: "SBOM", caption: "Inventaire CycloneDX, licences en liste fermée" },
        { id: "eu", value: "UE", caption: "Hébergé dans l’Union européenne, ou chez vous" },
        { id: "zero", value: "0 prompt", caption: "Ni prompt, ni clé, ni code, ni valeur d’un secret chez xSOM" },
      ],
      evidence: "Dossier de preuves exportable en JSON et en PDF, journaux chaînés que vous vérifiez, Événements sans contenu.",
      source: "Code source de Secret Guard",
    },
    faq: {
      title: "Questions fréquentes.",
      items: [
        ["xSOM voit-il nos prompts ou nos clés ?", "Non. Le Contrôle avant envoi tourne sur le Poste, sans réseau ni modèle d’IA, et la passerelle reste chez vous. Seuls remontent des métriques d’usage et des Événements sans contenu."],
        ["Est-ce permis par les fournisseurs ?", "Vos développeurs gardent l’outil officiel, non modifié, avec leur propre connexion ; aucun identifiant n’est collecté, aucun compte n’est revendu. L’agent écrit seulement les réglages que chaque fournisseur documente pour les entreprises."],
        ["Quels assistants sont couverts ?", "Le périmètre vise Claude Code et Codex sur les Postes, ainsi que les Applications API via Fleet Gateway. La disponibilité de chaque intégration et système d’exploitation est vérifiée lors du cadrage du pilote. ChatGPT dans le navigateur, Copilot et les modèles locaux ne sont pas inclus."],
        ["À partir de combien de développeurs ?", "Fleet s’adresse aux organisations qui doivent piloter plusieurs équipes. Le pilote permet de vérifier l’intérêt de la plateforme pour votre taille et vos usages."],
        ["Et si le contrôle échoue ?", "L’envoi est bloqué, avec un message clair. Un contenu trop gros, une analyse incomplète ou un délai dépassé ne laissent jamais partir un envoi partiel. Le contrôle ne fait aucun appel réseau vers xSOM."],
        ["Comment se déroule le déploiement ?", "Votre outil de gestion de flotte, Intune ou un autre, installe l’agent xSOM. D’abord une démonstration gratuite sur nos propres comptes, puis un pilote de deux à trois mois chez vous, puis le Groupe entier."],
        ["Combien coûte xSOM Fleet ?", "Un abonnement annuel par développeur gouverné, sur devis : demandez un tarif. La démonstration est gratuite."],
      ],
      contact: "Parler à notre équipe",
    },
  },
  en: {
    meta: {
      title: "xSOM Fleet · Enterprise AI governance",
      description: "Govern your teams’ AI usage: subscription tracking, pre-send checks on the workstation and audit evidence. 2026 pilot programme.",
      ogAlt: "xSOM Fleet: the best AI models on the market, at enterprise security standards",
    },
    film: {
      fallback: "Steer your whole AI architecture from one place.",
    },
    hero: {
      badge: "2026 pilot programme",
      title: ["Your AI usage,", "shared rules."],
      lead: "Track subscriptions, apply pre-send checks on covered workstations and gather evidence for audit.",
      contact: "Request a demo",
      how: "How it works",
      visual: {
        label: "Animated illustration: a grid of workstations lights up; a prompt carrying a masked key breaks on the workstation line; the “Signed Policy” seal spreads to every workstation.",
        poste: "Workstation",
        prompt: "prompt",
        blocked: "Blocked on the workstation",
        seal: "Signed Policy",
      },
    },
    platform: {
      punch: "One framework.",
      rest: "Three complementary roles.",
      supported: {
        label: "Supported",
        subscriptions: "Subscriptions",
        gateway: "Through the gateway",
        claude: { name: "Claude", product: "Claude Code" },
        chatgpt: { name: "ChatGPT", product: "Codex" },
        api: { name: "API models", detail: "your keys" },
        hosted: { name: "Your models", detail: "hosted on your side" },
      },
      badge: "Available for pilot",
      modules: [
        { name: "Fleet Sièges", title: "Track subscriptions and costs", line: "Seats, actual invoice, estimated API equivalent and seat tiers." },
        { name: "Fleet Guard", title: "Check before sending", line: "Pre-send check on the workstation, signed Policy, block log and evidence dossier.", engine: "Open-source engine: Secret Guard" },
        { name: "Fleet Gateway", title: "Govern model access", line: "Managing and steering the company’s AI strategy: API applications, API budgets, models hosted on your side." },
      ],
    },
    why: {
      title: "See what you pay and what you use.",
      demo: "Demonstration · illustrative data",
      cost: {
        name: "Cost",
        line: "The actual invoice and estimated API equivalent answer two different questions. Fleet shows them side by side, by developer and team.",
        measure: "Measured at xSOM in September 2026, across two assistants: $8,988 of usage at API rates.",
        claudeLine: "Claude plan at $200 per month (€216 incl. VAT): $7,815 of usage at API rates, 39 times its price.",
        measureNote: "Read with ccusage (a free tool) from the logs of a single workstation, one heavy user. API rates are the tool’s own; this is an estimate, not an average.",
        plan: "Plan",
        usage: "Usage at API rates",
        claudePlan: "$200",
        claudeUsage: "$7,815",
        codexUsage: "$1,173",
        ratio: "× 39",
        capture: "See the ccusage report",
        captureAlt: "ccusage output in a terminal, command ccusage monthly --since 20260901 --until 20260930: monthly report for 2026-09 of Claude, Codex and OpenClaw; Cost (USD) $7814.73 for Claude and $1173.27 for Codex, highlighted, $0.00 for OpenClaw, total $8988.00.",
        captureClose: "Close the report",
        action: "Request the simulation for your company",
        actionNote: "Simulation · assumptions shown",
      },
      price: {
        name: "Pricing",
        line: "An annual subscription per governed developer, on quotation.",
        action: "Request pricing",
      },
      finops: {
        name: "FinOps steering",
        line: "The actual invoice against the estimated API equivalent, never added together.",
        real: "Actual invoice",
        estimate: "Estimated API equivalent",
        estimateTag: "estimate",
        count: "developers tracked, in 6 teams",
      },
      security: {
        name: "The pre-send check",
        line: "Secrets, hidden instructions and referenced files blocked on the workstation, before sending.",
        count: "healthy workstations",
      },
    },
    how: {
      title: "From console to workstation.",
      demo: "Demonstration · illustrative data",
      film: "xSOM Fleet “How it works” film, with voice-over and burned-in subtitles: choosing your AI, one signed Policy for every workstation, supervising every workstation, a secret stopped on the workstation, the AI bill, then the evidence dossier. Console captures on demonstration data.",
      play: "Play the film",
      pause: "Pause the film",
      unmute: "Turn sound on",
      mute: "Turn sound off",
      chapters: "Film chapters",
      steps: [
        { id: "choose", at: 0, title: "Choose your AI", body: "Subscriptions and APIs brought together in one place, without depending on a single provider." },
        { id: "policy", at: 13.71, title: "One Policy for every workstation", body: "A signed Policy, checked then applied on every workstation." },
        { id: "coverage", at: 23.3, title: "Supervise", body: "The status of every workstation, and the list of those out of line." },
        { id: "invisible", at: 32.3, title: "The workstation check", body: "A detected secret is stopped on the workstation, with no network and no AI model." },
        { id: "costs", at: 46.25, title: "Control your AI bill", body: "The actual invoice next to the estimated API equivalent, and the right plan for every developer." },
        { id: "proof", at: 60.36, title: "Gather the evidence", body: "An evidence dossier to review checks and their results." },
      ] satisfies readonly Chapter[],
    },
    commitments: {
      title: "Clear scope, verifiable evidence.",
      lead: "The pilot defines covered integrations, processed data and available evidence.",
      badges: [
        { id: "apache", value: "Apache-2.0", caption: "Secret Guard, the detection engine, as open code", link: true },
        { id: "mit", value: "MIT", caption: "LiteLLM, its MIT part only, at a pinned version" },
        { id: "sbom", value: "SBOM", caption: "CycloneDX inventory, licences in a closed list" },
        { id: "eu", value: "EU", caption: "Hosted in the European Union, or on your side" },
        { id: "zero", value: "0 prompts", caption: "No prompt, key, code or secret value at xSOM" },
      ],
      evidence: "Evidence dossier exportable as JSON and PDF, chained logs you can check, events without content.",
      source: "Secret Guard source code",
    },
    faq: {
      title: "Frequently asked questions.",
      items: [
        ["Does xSOM see our prompts or keys?", "No. The pre-send check runs on the workstation, with no network and no AI model, and the gateway stays on your side. Only usage metrics and events without content are sent."],
        ["Do the providers allow it?", "Your developers keep the official, unmodified tool with their own sign-in; no credential is collected and no account is resold. The agent only writes the settings each provider documents for enterprises."],
        ["Which assistants are covered?", "The scope targets Claude Code and Codex on workstations, and API applications through Fleet Gateway. Availability for each integration and operating system is checked when scoping the pilot. Browser-based ChatGPT, Copilot and local models are not included."],
        ["From how many developers?", "Fleet is designed for organisations managing multiple teams. A pilot establishes whether the platform fits your scale and usage."],
        ["What if the check fails?", "The send is blocked, with a clear message. Oversized content, an incomplete scan or a timeout never lets a partial send through. The check makes no network call to xSOM."],
        ["How does the rollout work?", "Your fleet management tool, Intune or another, installs the xSOM agent. First a free demo on our own accounts, then a two-to-three-month pilot on your side, then the whole group."],
        ["How much does xSOM Fleet cost?", "An annual subscription per governed developer, on quotation: request pricing. The demo is free."],
      ],
      contact: "Talk to our team",
    },
  },
} as const;
