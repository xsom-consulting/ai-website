import type { FilmMedia } from "@/components/home/HomeFilm";
import type { Lang } from "@/lib/i18n";

/**
 * La page xSOM Fleet. La promesse d'abord, avec son illustration animée : les
 * meilleures IA pour toute l'entreprise, la sécurité chez le client. Puis la phrase qui
 * définit la plateforme et ses trois modules, le film, les raisons de la choisir en
 * grille, le fonctionnement, les licences et engagements en badges, enfin les questions.
 * Une phrase par bloc ; le reste est visuel. Les chiffres des tuiles viennent des
 * données de démonstration (`fleet-ops demo-data generate`) et le disent. Règles : aucun client nommé,
 * aucun prix de licence publié, aucun chiffre de gain sans simulation sourcée, aucune
 * promesse de « conformité » ; toute simulation porte « Simulation · hypothèses
 * affichées » ; tout film tiré de la console porte « Démonstration · données
 * illustratives ». Assistants couverts : Claude Code et Codex sur le Poste, les
 * applications API par Fleet Gateway ; rien d'autre n'est annoncé, ni daté.
 * Vocabulaire : glossaire du PRD (§3).
 */

export const FLEET_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet";
/** La demande de simulation des coûts : même adresse, objet distinct. */
export const FLEET_SIMULATION_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet%20%C2%B7%20simulation";
/** La demande de tarif : le prix ne se publie pas, il se demande. */
export const FLEET_PRICE_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet%20%C2%B7%20tarif";
export const FLEET_ORIGIN = "https://fleet.xsom.fr";

const MEDIA = "/signal-media";

/** Le film d'ouverture (Remotion : `films/src/fleet/`), un par langue. */
export const FLEET_HERO_MEDIA: FilmMedia = {
  fr: {
    mp4: `${MEDIA}/xsom-fleet-hero-fr.mp4`,
    poster: `${MEDIA}/xsom-fleet-hero-fr.jpg`,
    name: "Film d’introduction xSOM Fleet",
    label: "Film d’introduction de xSOM Fleet, sans parole : plusieurs Organisations fournisseur réunies dans une console, une Politique signée appliquée sur chaque Poste, un secret bloqué avant envoi, l’État de chaque Poste, puis la Facture réelle à côté de l’Équivalent API estimé.",
  },
  en: {
    mp4: `${MEDIA}/xsom-fleet-hero-en.mp4`,
    poster: `${MEDIA}/xsom-fleet-hero-en.jpg`,
    name: "xSOM Fleet introduction film",
    label: "xSOM Fleet introduction film, without speech: several provider organizations brought together in one console, a signed Policy applied on every workstation, a secret blocked before sending, the status of every workstation, then the actual invoice next to the estimated API equivalent.",
  },
};

export const FLEET_STEP_IDS = ["orgs", "policy", "block", "coverage", "costs"] as const;
export type FleetStepId = (typeof FLEET_STEP_IDS)[number];

/** Les films « Comment ça marche » : muets, en boucle, une affiche chacun. */
export const fleetStepMedia = (id: FleetStepId, lang: Lang) => ({
  mp4: `${MEDIA}/xsom-fleet-how-${id}-${lang}.mp4`,
  poster: `${MEDIA}/xsom-fleet-how-${id}-${lang}.jpg`,
});

type Step = { readonly id: FleetStepId; readonly title: string; readonly body: string; readonly film: string };

/**
 * Chiffres des tuiles « Pourquoi » : ceux du Groupe de démonstration de xSOM Fleet
 * (450 Développeurs, 6 Équipes, Organisations Claude Team à 150 Sièges, 438 Postes
 * sains sur 450). Affichés avec « Démonstration · données illustratives ».
 */
export const FLEET_DEMO_FIGURES = {
  seatCap: 150,
  developers: 450,
  teams: 6,
  healthyPostes: 438,
  postes: 450,
} as const;

export const FLEET_COPY = {
  fr: {
    meta: {
      title: "xSOM Fleet · la plateforme de gouvernance de vos IA",
      description: "Claude Code et Codex sur chaque Poste, vos applications API par une passerelle installée chez vous : Sièges, coût réel, Contrôle avant envoi et preuves pour l’audit.",
      ogAlt: "xSOM Fleet : les meilleures IA pour toute votre entreprise, la sécurité reste chez vous",
    },
    film: {
      fallback: "xSOM Fleet gouverne toutes vos IA.",
    },
    hero: {
      badge: "Programme pilote 2026",
      title: ["Les meilleures IA pour toute votre entreprise.", "La sécurité reste chez vous."],
      lead: "Des Sièges pour ceux qui s’en servent, le coût réel par Développeur, un contrôle sur chaque Poste avant envoi, des preuves pour l’audit.",
      contact: "Demander une démonstration",
      how: "Comment ça marche",
      hosts: "Fonctionne avec",
      apps: "vos applications API",
      visual: {
        label: "Illustration animée : une grille de Postes s’allume ; un prompt qui porte une clé masquée se brise sur la ligne du Poste ; le cachet « Politique signée » se propage à tous les Postes.",
        poste: "Poste",
        prompt: "prompt",
        blocked: "Bloqué sur le Poste",
        seal: "Politique signée",
      },
    },
    platform: {
      punch: "xSOM Fleet gouverne toutes vos IA.",
      sub: "Claude Code et Codex sur chaque Poste, vos applications API par une passerelle installée chez vous. D’autres assistants suivront.",
      badge: "Disponible pour pilote",
      modules: [
        { name: "Fleet Sièges", line: "Sièges, Plafonds et coût réel de chaque organisation." },
        { name: "Fleet Guard", line: "Les secrets restent sur le Poste.", engine: "Moteur open source : Secret Guard" },
        { name: "Fleet Gateway", line: "Vos applications API, par une passerelle chez vous." },
      ],
    },
    why: {
      title: "Pourquoi choisir xSOM Fleet.",
      demo: "Démonstration · données illustratives",
      cost: {
        name: "Coût",
        line: "Payer les Sièges utilisés, pas les Sièges dormants.",
        gauge: "Sièges d’une organisation Claude Team : le 151e est refusé.",
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
        name: "Une sécurité unique pour toutes vos IA",
        line: "Secrets, Instructions cachées et fichiers cités bloqués sur le Poste, avant envoi.",
        count: "Postes sains",
      },
    },
    how: {
      title: "De la console au Poste.",
      demo: "Démonstration · données illustratives",
      play: "Lire le film",
      pause: "Mettre le film en pause",
      steps: [
        {
          id: "orgs",
          title: "Toutes vos organisations",
          body: "Vos organisations Claude Team et espaces ChatGPT Business dans une seule console, et le 151e Siège refusé.",
          film: "Film de démonstration sans son : la page Organisations fournisseur liste trois organisations Claude Team à 150 Sièges sur 150 ; l’affectation d’un 151e Siège est refusée et la console propose une autre organisation.",
        },
        {
          id: "policy",
          title: "Une Politique signée",
          body: "Réglages, serveurs MCP et modèles autorisés : chaque agent vérifie la signature avant d’appliquer.",
          film: "Film de démonstration sans son : la page Politique affiche l’aperçu des Postes sous la version minimale, puis la publication d’une nouvelle version signée.",
        },
        {
          id: "block",
          title: "Le secret reste sur le Poste",
          body: "Un secret détecté bloque l’envoi, sans réseau ni modèle d’IA ; le message nomme la règle, jamais la valeur.",
          film: "Film de démonstration sans son : dans le terminal de l’assistant, un prompt qui contient une clé fictive est bloqué ; le message de xSOM Fleet nomme la règle sans afficher la valeur.",
        },
        {
          id: "coverage",
          title: "L’État de chaque Poste",
          body: "Sain, dégradé, en échec ou inconnu, avec ses motifs, et la liste des Postes en écart à exporter.",
          film: "Film de démonstration sans son : la page Couverture compte les Postes sains, dégradés, en échec et inconnus, par Équipe, puis liste les Postes en écart avec leurs motifs.",
        },
        {
          id: "costs",
          title: "Le coût réel, à part l’estimation",
          body: "La Facture réelle par Développeur, Équipe et Groupe, à côté de l’Équivalent API estimé et daté.",
          film: "Film de démonstration sans son : la page Coûts montre, onglet par onglet, la Facture réelle et, dans des colonnes séparées, l’Équivalent API estimé et le Ratio de coût.",
        },
      ] satisfies readonly Step[],
    },
    commitments: {
      title: "Licences, sources et engagements.",
      lead: "Des pièces qu’un auditeur peut vérifier, pas des promesses.",
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
        ["Quels assistants sont couverts ?", "Claude Code et Codex, sur les Postes Windows, macOS et Linux, et vos applications API par Fleet Gateway. ChatGPT sur le web, Copilot et les modèles locaux ne le sont pas encore : d’autres assistants suivront, sans date annoncée."],
        ["À partir de combien de développeurs ?", "150 et plus. En dessous, une seule organisation Claude Team suffit."],
        ["Et si le contrôle échoue ?", "L’envoi est bloqué, avec un message clair. Un contenu trop gros, une analyse incomplète ou un délai dépassé ne laissent jamais partir un envoi partiel. Le contrôle ne fait aucun appel réseau vers xSOM."],
        ["Comment se déroule le déploiement ?", "Votre outil de gestion de flotte, Intune ou un autre, installe l’agent xSOM. D’abord une démonstration gratuite sur nos propres comptes, puis un pilote de deux à trois mois chez vous, puis le Groupe entier."],
        ["Combien coûte xSOM Fleet ?", "Un abonnement annuel par développeur gouverné, sur devis : demandez un tarif. La démonstration est gratuite."],
      ],
      contact: "Parler à notre équipe",
    },
  },
  en: {
    meta: {
      title: "xSOM Fleet · the governance platform for your AI",
      description: "Claude Code and Codex on every workstation, your API applications through a gateway installed on your side: seats, real cost, pre-send check and evidence for audit.",
      ogAlt: "xSOM Fleet: the best AI for your whole company, security stays with you",
    },
    film: {
      fallback: "xSOM Fleet governs all your AI.",
    },
    hero: {
      badge: "2026 pilot programme",
      title: ["The best AI for your whole company.", "Security stays with you."],
      lead: "Seats for the people who use them, the real cost per developer, a check on every workstation before anything is sent, evidence for audit.",
      contact: "Request a demo",
      how: "How it works",
      hosts: "Works with",
      apps: "your API applications",
      visual: {
        label: "Animated illustration: a grid of workstations lights up; a prompt carrying a masked key breaks on the workstation line; the “Signed Policy” seal spreads to every workstation.",
        poste: "Workstation",
        prompt: "prompt",
        blocked: "Blocked on the workstation",
        seal: "Signed Policy",
      },
    },
    platform: {
      punch: "xSOM Fleet governs all your AI.",
      sub: "Claude Code and Codex on every workstation, your API applications through a gateway installed on your side. Other assistants will follow.",
      badge: "Available for pilot",
      modules: [
        { name: "Fleet Sièges", line: "Seats, caps and the real cost of every organization." },
        { name: "Fleet Guard", line: "Secrets stay on the workstation.", engine: "Open-source engine: Secret Guard" },
        { name: "Fleet Gateway", line: "Your API applications, through a gateway on your side." },
      ],
    },
    why: {
      title: "Why choose xSOM Fleet.",
      demo: "Demonstration · illustrative data",
      cost: {
        name: "Cost",
        line: "Pay for the seats in use, not the idle ones.",
        gauge: "Seats of a Claude Team organization: the 151st is refused.",
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
        name: "One security layer for all your AI",
        line: "Secrets, hidden instructions and referenced files blocked on the workstation, before sending.",
        count: "healthy workstations",
      },
    },
    how: {
      title: "From console to workstation.",
      demo: "Demonstration · illustrative data",
      play: "Play the film",
      pause: "Pause the film",
      steps: [
        {
          id: "orgs",
          title: "All your organizations",
          body: "Your Claude Team organizations and ChatGPT Business workspaces in one console, and the 151st seat refused.",
          film: "Demonstration film without sound: the Provider organizations page lists three Claude Team organizations at 150 of 150 seats; assigning a 151st seat is refused and the console suggests another organization.",
        },
        {
          id: "policy",
          title: "A signed Policy",
          body: "Settings, allowed MCP servers and models: every agent checks the signature before applying anything.",
          film: "Demonstration film without sound: the Policy page shows the preview of workstations below the minimum version, then the publication of a new signed version.",
        },
        {
          id: "block",
          title: "The secret stays on the workstation",
          body: "A detected secret blocks the send, with no network and no AI model; the message names the rule, never the value.",
          film: "Demonstration film without sound: in the assistant’s terminal, a prompt containing a fictitious key is blocked; the xSOM Fleet message names the rule without showing the value.",
        },
        {
          id: "coverage",
          title: "The status of every workstation",
          body: "Healthy, degraded, failing or unknown, with its reasons, and the list of workstations out of line to export.",
          film: "Demonstration film without sound: the Coverage page counts healthy, degraded, failing and unknown workstations by team, then lists the workstations out of line with their reasons.",
        },
        {
          id: "costs",
          title: "The real cost, apart from the estimate",
          body: "The actual invoice per developer, team and group, next to the dated estimated API equivalent.",
          film: "Demonstration film without sound: the Costs page shows, tab by tab, the actual invoice and, in separate columns, the estimated API equivalent and the cost ratio.",
        },
      ] satisfies readonly Step[],
    },
    commitments: {
      title: "Licences, sources and commitments.",
      lead: "Documents an auditor can check, not promises.",
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
        ["Which assistants are covered?", "Claude Code and Codex, on Windows, macOS and Linux workstations, and your API applications through Fleet Gateway. ChatGPT on the web, Copilot and local models are not covered yet: other assistants will follow, with no date announced."],
        ["From how many developers?", "150 and more. Below that, a single Claude Team organization is enough."],
        ["What if the check fails?", "The send is blocked, with a clear message. Oversized content, an incomplete scan or a timeout never lets a partial send through. The check makes no network call to xSOM."],
        ["How does the rollout work?", "Your fleet management tool, Intune or another, installs the xSOM agent. First a free demo on our own accounts, then a two-to-three-month pilot on your side, then the whole group."],
        ["How much does xSOM Fleet cost?", "An annual subscription per governed developer, on quotation: request pricing. The demo is free."],
      ],
      contact: "Talk to our team",
    },
  },
} as const;
