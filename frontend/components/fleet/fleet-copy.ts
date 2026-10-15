import type { FilmMedia } from "@/components/home/HomeFilm";
import type { Lang } from "@/lib/i18n";

/**
 * La page xSOM Fleet. La promesse d'abord : les meilleures IA pour toute l'entreprise,
 * la sécurité chez le client. Puis la définition de la plateforme et ses trois modules,
 * les trois raisons de la choisir (coût, pilotage FinOps, sécurité), le fonctionnement,
 * les licences et les engagements, enfin les questions. Règles : aucun client nommé,
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

type Step = { readonly id: FleetStepId; readonly title: string; readonly body: readonly [string, string]; readonly film: string };

export const FLEET_COPY = {
  fr: {
    meta: {
      title: "xSOM Fleet · la plateforme de gouvernance de vos IA",
      description: "Claude Code et Codex sur chaque Poste, vos applications API par une passerelle installée chez vous : Sièges, coût réel, Contrôle avant envoi et preuves pour l’audit.",
      ogAlt: "xSOM Fleet : les meilleures IA pour toute votre entreprise, la sécurité reste chez vous",
    },
    film: {
      fallback: "La plateforme de gouvernance de vos IA.",
    },
    hero: {
      kicker: "xSOM Fleet · plateforme · programme pilote 2026",
      title: ["Les meilleures IA pour toute votre entreprise.", "La sécurité reste chez vous."],
      lead: "Des Sièges pour ceux qui s’en servent, le coût réel par Développeur, un contrôle sur chaque Poste avant envoi, des preuves pour l’audit.",
      contact: "Demander une démonstration",
      how: "Comment ça marche",
      hosts: "Fonctionne avec",
      hostList: ["Claude Code", "Codex", "Vos applications API, par Fleet Gateway"],
    },
    platform: {
      kicker: "La plateforme",
      definition: [
        "xSOM Fleet est la plateforme de gouvernance de vos IA :",
        "Claude Code et Codex sur chaque Poste, vos applications API par une passerelle installée chez vous.",
      ],
      next: "D’autres assistants suivront.",
      items: [
        {
          name: "Fleet Sièges",
          badge: "Disponible pour pilote",
          lead: "Les abonnements, leur coût et leur couverture.",
          points: [
            "Organisations fournisseur et Plafond de Sièges : le 151e Siège d’une organisation Claude Team est refusé.",
            "Facture réelle par Développeur, par Équipe et pour le Groupe, à côté de l’Équivalent API estimé.",
            "État de chaque Poste, et liste exportable des Postes en écart.",
          ],
        },
        {
          name: "Fleet Guard",
          badge: "Disponible pour pilote",
          lead: "Les secrets restent sur le Poste.",
          points: [
            "Contrôle avant envoi : un secret détecté bloque l’envoi, sans réseau ni modèle d’IA.",
            "Journal des blocages : chaque Événement de blocage, sans contenu, dans un journal chaîné par hachage.",
            "Dossier de preuves : les pièces qu’un auditeur demandera, et ce qu’elles ne prouvent pas.",
          ],
          engine: "Le moteur de détection est open source : Secret Guard",
        },
        {
          name: "Fleet Gateway",
          badge: "Disponible pour pilote",
          lead: "Vos applications API, par une passerelle installée chez vous.",
          points: [
            "Une passerelle LiteLLM installée chez le Groupe, pilotée depuis la même console.",
            "Budgets API par application.",
            "Aucun prompt ni aucune clé ne passe par xSOM : seules remontent des Traces de passerelle sans contenu.",
          ],
        },
      ],
      note: "Claude Code et Codex sont couverts sur les Postes Windows, macOS et Linux. ChatGPT sur le web, Copilot et les modèles locaux ne le sont pas encore : d’autres assistants suivront, sans date annoncée.",
    },
    why: {
      kicker: "Pourquoi xSOM Fleet",
      title: "Pourquoi choisir xSOM Fleet.",
      items: [
        {
          id: "cost",
          name: "Coût",
          lead: "Payer les Sièges utilisés, pas les Sièges dormants.",
          points: [
            "Facture réelle par Développeur.",
            "Palier de siège recommandé selon l’usage.",
            "Plafonds de Sièges respectés.",
            "Dépassements répartis par Développeur et par Équipe.",
          ],
          action: "Demander la simulation pour votre entreprise",
          actionNote: "Simulation · hypothèses affichées",
        },
        {
          id: "finops",
          name: "Pilotage FinOps",
          lead: "La Facture réelle face à l’Équivalent API estimé.",
          points: [
            "Par Développeur, par Équipe et par cas d’usage.",
            "Budgets API par application.",
            "Limites atteintes et recommandation de Palier.",
            "L’estimation n’est jamais additionnée à ce que vous payez.",
          ],
        },
        {
          id: "security",
          name: "Une sécurité unique pour toutes vos IA",
          lead: "Le contrôle se fait chez vous, pas chez xSOM.",
          points: [
            "Contrôle avant envoi sur le Poste : secrets, Instructions cachées, fichiers cités.",
            "Aucun prompt ni aucune clé chez xSOM.",
            "Une Politique signée, vérifiée par chaque agent.",
            "Hébergement dans l’Union européenne ou chez vous.",
          ],
        },
      ],
    },
    how: {
      kicker: "Comment ça marche",
      title: "De la console au Poste.",
      demo: "Démonstration · données illustratives",
      play: "Lire le film",
      pause: "Mettre le film en pause",
      steps: [
        {
          id: "orgs",
          title: "Toutes vos organisations",
          body: [
            "Vos organisations Claude Team et espaces ChatGPT Business, réunis dans une seule console.",
            "Chaque Siège est nominatif, et la console refuse le 151e Siège d’une organisation Claude Team.",
          ],
          film: "Film de démonstration sans son : la page Organisations fournisseur liste trois organisations Claude Team à 150 Sièges sur 150 ; l’affectation d’un 151e Siège est refusée et la console propose une autre organisation.",
        },
        {
          id: "policy",
          title: "Une Politique signée",
          body: [
            "Vous publiez une Politique : réglages imposés, serveurs MCP autorisés, modèles.",
            "Avant publication, la console compte les Postes trop anciens pour la suivre ; chaque agent en vérifie la signature avant toute application.",
          ],
          film: "Film de démonstration sans son : la page Politique affiche l’aperçu des Postes sous la version minimale, puis la publication d’une nouvelle version signée.",
        },
        {
          id: "block",
          title: "Le secret reste sur le Poste",
          body: [
            "Avant chaque envoi, l’agent vérifie le prompt sur le Poste, sans réseau ni modèle d’IA.",
            "Un secret détecté bloque l’envoi : le message nomme la règle et la marche à suivre, jamais la valeur.",
          ],
          film: "Film de démonstration sans son : dans le terminal de l’assistant, un prompt qui contient une clé fictive est bloqué ; le message de xSOM Fleet nomme la règle sans afficher la valeur.",
        },
        {
          id: "coverage",
          title: "L’État de chaque Poste",
          body: [
            "Sain, dégradé, en échec ou inconnu : chaque Poste remonte son état et ses motifs.",
            "Vous exportez la liste des Postes en écart pour les faire corriger.",
          ],
          film: "Film de démonstration sans son : la page Couverture compte les Postes sains, dégradés, en échec et inconnus, par Équipe, puis liste les Postes en écart avec leurs motifs.",
        },
        {
          id: "costs",
          title: "Le coût réel, à part l’estimation",
          body: [
            "La Facture réelle par développeur, par équipe et pour le Groupe : Sièges et Dépassements.",
            "À côté, jamais additionné, l’Équivalent API estimé, daté par son Catalogue de prix.",
          ],
          film: "Film de démonstration sans son : la page Coûts montre, onglet par onglet, la Facture réelle et, dans des colonnes séparées, l’Équivalent API estimé et le Ratio de coût.",
        },
      ] satisfies readonly Step[],
    },
    commitments: {
      kicker: "Pour l’audit et vos juristes",
      title: "Licences, sources et engagements.",
      lead: "xSOM Fleet ne fait pas l’audit à votre place. Il produit les pièces qu’un auditeur demandera, et dit ce qu’elles ne prouvent pas.",
      items: [
        {
          name: "Un moteur open source",
          body: "Secret Guard, le moteur de détection de Fleet Guard, est publié sous licence Apache-2.0. Chacun peut lire ses règles et les vérifier.",
          link: "Code source de Secret Guard",
        },
        {
          name: "LiteLLM, partie MIT seulement",
          body: "Fleet Gateway s’appuie sur LiteLLM, dans sa seule partie sous licence MIT, à une version épinglée.",
        },
        {
          name: "L’inventaire des composants",
          body: "La liste des composants de xSOM Fleet est fournie au format SBOM CycloneDX. Les licences admises tiennent dans une liste fermée.",
        },
        {
          name: "Ce que xSOM ne voit jamais",
          body: "Ni prompt, ni clé, ni code, ni valeur d’un secret. Chaque développeur garde sa propre connexion au fournisseur : aucun identifiant n’est collecté.",
        },
        {
          name: "Hébergé dans l’UE ou chez vous",
          body: "Console, Politiques et journaux hébergés dans l’Union européenne, ou installés chez le Groupe.",
        },
        {
          name: "Des preuves exportables",
          body: "Le Dossier de preuves s’exporte en JSON et en PDF. Les journaux sont chaînés par hachage : vous vérifiez vous-même la chaîne.",
        },
      ],
      note: "Ce qui remonte vers la console : des métriques d’usage (tokens, sessions) et des Événements sans contenu. xSOM ne revend ni compte ni usage, et ne modifie aucun assistant : l’agent écrit seulement leurs réglages officiels.",
    },
    faq: {
      kicker: "Questions",
      title: "Questions fréquentes.",
      items: [
        ["xSOM voit-il nos prompts ou nos clés ?", "Non. Le Contrôle avant envoi tourne sur le Poste, sans réseau ni modèle d’IA, et la passerelle reste chez vous. Seuls remontent des métriques d’usage et des Événements sans contenu."],
        ["Est-ce permis par les fournisseurs ?", "Vos développeurs gardent l’outil officiel, non modifié, avec leur propre connexion ; aucun identifiant n’est collecté. L’agent écrit seulement les réglages que chaque fournisseur documente pour les entreprises."],
        ["Quels assistants sont couverts ?", "Claude Code et Codex, sur les Postes Windows, macOS et Linux, et vos applications API par Fleet Gateway. ChatGPT sur le web, Copilot et les modèles locaux ne le sont pas encore : d’autres assistants suivront, sans date annoncée."],
        ["À partir de combien de développeurs ?", "150 et plus. En dessous, une seule organisation Claude Team suffit."],
        ["Et si le contrôle échoue ?", "L’envoi est bloqué, avec un message clair. Un contenu trop gros, une analyse incomplète ou un délai dépassé ne laissent jamais partir un envoi partiel. Le contrôle ne fait aucun appel réseau vers xSOM."],
        ["Comment se déroule le déploiement ?", "Votre outil de gestion de flotte, Intune ou un autre, installe l’agent xSOM. D’abord une démonstration gratuite sur nos propres comptes, puis un pilote de deux à trois mois chez vous, puis le Groupe entier."],
        ["Combien coûte xSOM Fleet ?", "Un abonnement annuel par développeur gouverné, sur devis. La démonstration est gratuite."],
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
      fallback: "The governance platform for your AI.",
    },
    hero: {
      kicker: "xSOM Fleet · platform · 2026 pilot programme",
      title: ["The best AI for your whole company.", "Security stays with you."],
      lead: "Seats for the people who use them, the real cost per developer, a check on every workstation before anything is sent, evidence for audit.",
      contact: "Request a demo",
      how: "How it works",
      hosts: "Works with",
      hostList: ["Claude Code", "Codex", "Your API applications, through Fleet Gateway"],
    },
    platform: {
      kicker: "The platform",
      definition: [
        "xSOM Fleet is the governance platform for your AI:",
        "Claude Code and Codex on every workstation, your API applications through a gateway installed on your side.",
      ],
      next: "Other assistants will follow.",
      items: [
        {
          name: "Fleet Sièges",
          badge: "Available for pilot",
          lead: "Subscriptions, their cost and their coverage.",
          points: [
            "Provider organizations and the seat cap: the 151st seat of a Claude Team organization is refused.",
            "Actual invoice per developer, per team and for the group, next to the estimated API equivalent.",
            "The status of every workstation, and an exportable list of the ones out of line.",
          ],
        },
        {
          name: "Fleet Guard",
          badge: "Available for pilot",
          lead: "Secrets stay on the workstation.",
          points: [
            "Pre-send check: a detected secret blocks the send, with no network and no AI model.",
            "Block log: every block event, without content, in a hash-chained log.",
            "Evidence dossier: the documents an auditor will ask for, and what they do not prove.",
          ],
          engine: "The detection engine is open source: Secret Guard",
        },
        {
          name: "Fleet Gateway",
          badge: "Available for pilot",
          lead: "Your API applications, through a gateway installed on your side.",
          points: [
            "A LiteLLM gateway installed in the group, run from the same console.",
            "API budgets per application.",
            "No prompt and no key goes through xSOM: only gateway traces without content are sent.",
          ],
        },
      ],
      note: "Claude Code and Codex are covered on Windows, macOS and Linux workstations. ChatGPT on the web, Copilot and local models are not covered yet: other assistants will follow, with no date announced.",
    },
    why: {
      kicker: "Why xSOM Fleet",
      title: "Why choose xSOM Fleet.",
      items: [
        {
          id: "cost",
          name: "Cost",
          lead: "Pay for the seats in use, not the idle ones.",
          points: [
            "Actual invoice per developer.",
            "Recommended seat tier, based on usage.",
            "Seat caps respected.",
            "Overages split per developer and per team.",
          ],
          action: "Request the simulation for your company",
          actionNote: "Simulation · assumptions shown",
        },
        {
          id: "finops",
          name: "FinOps steering",
          lead: "The actual invoice against the estimated API equivalent.",
          points: [
            "Per developer, per team and per use case.",
            "API budgets per application.",
            "Limits reached and a seat-tier recommendation.",
            "The estimate is never added to what you pay.",
          ],
        },
        {
          id: "security",
          name: "One security layer for all your AI",
          lead: "The check runs on your side, not at xSOM.",
          points: [
            "Pre-send check on the workstation: secrets, hidden instructions, referenced files.",
            "No prompt and no key at xSOM.",
            "A signed Policy, checked by every agent.",
            "Hosted in the European Union or on your premises.",
          ],
        },
      ],
    },
    how: {
      kicker: "How it works",
      title: "From console to workstation.",
      demo: "Demonstration · illustrative data",
      play: "Play the film",
      pause: "Pause the film",
      steps: [
        {
          id: "orgs",
          title: "All your organizations",
          body: [
            "Your Claude Team organizations and ChatGPT Business workspaces, brought together in one console.",
            "Every seat is named, and the console refuses the 151st seat of a Claude Team organization.",
          ],
          film: "Demonstration film without sound: the Provider organizations page lists three Claude Team organizations at 150 of 150 seats; assigning a 151st seat is refused and the console suggests another organization.",
        },
        {
          id: "policy",
          title: "A signed Policy",
          body: [
            "You publish a Policy: enforced settings, allowed MCP servers, models.",
            "Before publishing, the console counts the workstations too old to follow it; each agent checks its signature before applying anything.",
          ],
          film: "Demonstration film without sound: the Policy page shows the preview of workstations below the minimum version, then the publication of a new signed version.",
        },
        {
          id: "block",
          title: "The secret stays on the workstation",
          body: [
            "Before anything is sent, the agent checks the prompt on the workstation, with no network and no AI model.",
            "A detected secret blocks the send: the message names the rule and what to do, never the value.",
          ],
          film: "Demonstration film without sound: in the assistant’s terminal, a prompt containing a fictitious key is blocked; the xSOM Fleet message names the rule without showing the value.",
        },
        {
          id: "coverage",
          title: "The status of every workstation",
          body: [
            "Healthy, degraded, failing or unknown: every workstation reports its status and its reasons.",
            "You export the list of workstations out of line to get them fixed.",
          ],
          film: "Demonstration film without sound: the Coverage page counts healthy, degraded, failing and unknown workstations by team, then lists the workstations out of line with their reasons.",
        },
        {
          id: "costs",
          title: "The real cost, apart from the estimate",
          body: [
            "The actual invoice per developer, per team and for the group: seats and overages.",
            "Next to it, never added, the estimated API equivalent, dated by its price catalog.",
          ],
          film: "Demonstration film without sound: the Costs page shows, tab by tab, the actual invoice and, in separate columns, the estimated API equivalent and the cost ratio.",
        },
      ] satisfies readonly Step[],
    },
    commitments: {
      kicker: "For your auditors and lawyers",
      title: "Licences, sources and commitments.",
      lead: "xSOM Fleet does not do the audit for you. It produces the documents an auditor will ask for, and states what they do not prove.",
      items: [
        {
          name: "An open-source engine",
          body: "Secret Guard, the detection engine of Fleet Guard, is published under the Apache-2.0 licence. Anyone can read its rules and check them.",
          link: "Secret Guard source code",
        },
        {
          name: "LiteLLM, MIT part only",
          body: "Fleet Gateway relies on LiteLLM, using only its MIT-licensed part, at a pinned version.",
        },
        {
          name: "The component inventory",
          body: "The list of xSOM Fleet’s components is provided as a CycloneDX SBOM. Accepted licences fit in a closed list.",
        },
        {
          name: "What xSOM never sees",
          body: "No prompt, no key, no code, no secret value. Every developer keeps their own sign-in with the provider: no credential is collected.",
        },
        {
          name: "Hosted in the EU or on your side",
          body: "Console, policies and logs hosted in the European Union, or installed within the group.",
        },
        {
          name: "Exportable evidence",
          body: "The evidence dossier exports as JSON and PDF. Logs are hash-chained: you check the chain yourself.",
        },
      ],
      note: "What reaches the console: usage metrics (tokens, sessions) and events without content. xSOM resells no account and no usage, and modifies no assistant: the agent only writes their official settings.",
    },
    faq: {
      kicker: "Questions",
      title: "Frequently asked questions.",
      items: [
        ["Does xSOM see our prompts or keys?", "No. The pre-send check runs on the workstation, with no network and no AI model, and the gateway stays on your side. Only usage metrics and events without content are sent."],
        ["Do the providers allow it?", "Your developers keep the official, unmodified tool with their own sign-in; no credential is collected. The agent only writes the settings each provider documents for enterprises."],
        ["Which assistants are covered?", "Claude Code and Codex, on Windows, macOS and Linux workstations, and your API applications through Fleet Gateway. ChatGPT on the web, Copilot and local models are not covered yet: other assistants will follow, with no date announced."],
        ["From how many developers?", "150 and more. Below that, a single Claude Team organization is enough."],
        ["What if the check fails?", "The send is blocked, with a clear message. Oversized content, an incomplete scan or a timeout never lets a partial send through. The check makes no network call to xSOM."],
        ["How does the rollout work?", "Your fleet management tool, Intune or another, installs the xSOM agent. First a free demo on our own accounts, then a two-to-three-month pilot on your side, then the whole group."],
        ["How much does xSOM Fleet cost?", "An annual subscription per governed developer, on quotation. The demo is free."],
      ],
      contact: "Talk to our team",
    },
  },
} as const;
