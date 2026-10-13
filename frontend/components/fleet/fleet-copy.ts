import type { FilmMedia } from "@/components/home/HomeFilm";
import type { Lang } from "@/lib/i18n";

/**
 * La page xSOM Fleet. La promesse d'abord : les abonnements à l'échelle de
 * l'entreprise. La sécurité et les preuves viennent ensuite, comme conditions
 * d'achat (PRD §1). Règles : aucun client nommé, aucun prix de licence publié, aucune
 * promesse de « conformité » ; toute estimation est signée et datée ; tout film tiré
 * de la console porte « Démonstration · données illustratives ». Chiffres : brief
 * produit du 2026-10-07 seulement. Vocabulaire : glossaire du PRD (§3).
 */

export const FLEET_CONTACT = "mailto:julian.talou@xsom.fr?subject=xSOM%20Fleet";
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
      title: "xSOM Fleet · assistants de code en entreprise",
      description: "Claude Code et Codex pour 150 développeurs et plus, en abonnement par siège. Une console, un agent sur chaque Poste, le coût réel et des preuves.",
      ogAlt: "xSOM Fleet : vos abonnements d’assistants de code à l’échelle de l’entreprise",
    },
    film: {
      fallback: "Vos abonnements d’assistants de code, à l’échelle de l’entreprise.",
    },
    hero: {
      kicker: "xSOM Fleet · plateforme · programme pilote 2026",
      title: ["Vos abonnements d’assistants de code,", "à l’échelle de toute l’entreprise."],
      lead: "Claude Code et Codex pour 150 à plus de 600 développeurs, en abonnement par siège plutôt qu’à la consommation. Une console pour tout le Groupe, un agent sur chaque Poste, le coût réel par développeur.",
      contact: "Demander une démonstration",
      how: "Comment ça marche",
      hosts: "Fonctionne avec",
    },
    modules: {
      kicker: "Une plateforme",
      title: "Trois modules, une console.",
      lead: "xSOM Fleet est une plateforme à trois modules, pilotés depuis la même console.",
      items: [
        {
          name: "Fleet Sièges",
          status: "pilot",
          badge: "Programme pilote",
          lead: "Les abonnements, leur coût et leur couverture.",
          points: [
            "Organisations fournisseur et Plafond de Sièges : le 151e Siège d’une organisation Claude Team est refusé.",
            "Facture réelle par développeur, par équipe et pour le Groupe, à côté de l’Équivalent API estimé.",
            "État de chaque Poste, et liste exportable des Postes en écart.",
          ],
        },
        {
          name: "Fleet Guard",
          status: "pilot",
          badge: "Programme pilote",
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
          status: "soon",
          badge: "À venir · sans date",
          lead: "Une passerelle API et des agents, installée chez le client.",
          points: [
            "Pilotée depuis la même console xSOM Fleet.",
            "Pas encore disponible : aucune date n’est annoncée.",
          ],
        },
      ],
      note: "Fleet Sièges et Fleet Guard sont ceux que montre cette page. Fleet Gateway n’existe pas encore : nous n’en promettons ni le périmètre ni la date.",
    },
    cost: {
      kicker: "Le constat",
      title: "Le même usage, deux factures.",
      api: {
        label: "Au tarif API",
        value: "150 – 250 $",
        unit: "par développeur et par mois en moyenne, bien plus en usage intensif",
        source: "Estimation xSOM · octobre 2026",
      },
      seat: {
        label: "En abonnement par siège",
        value: "20 – 125 $",
        unit: "par développeur et par mois, selon le palier du Siège",
        source: "Prix publics Claude Team et ChatGPT Business · octobre 2026",
      },
      note: "Claude Enterprise facture désormais tout l’usage au tarif API, et GitHub Copilot facture à l’usage depuis le 1er juin 2026. Les forfaits par siège restent, mais plafonnés : 150 Sièges par organisation Claude Team, 200 par espace ChatGPT Business. Au-delà de 150 développeurs, il faut plusieurs Organisations fournisseur : xSOM Fleet les réunit.",
      split: "Dans la console, la Facture réelle et l’Équivalent API estimé restent dans deux colonnes. L’estimation n’est jamais additionnée à ce que vous payez.",
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
    never: {
      kicker: "Nos limites",
      title: "Ce que xSOM ne fait jamais.",
      items: [
        ["Jamais vos prompts", "Le contrôle se fait sur le Poste. Aucun prompt, aucun fichier et aucune valeur de secret ne remonte vers xSOM."],
        ["Jamais vos identifiants", "Chaque développeur garde sa propre connexion au fournisseur. xSOM ne collecte ni mot de passe, ni jeton, ni clé."],
        ["Jamais de revente", "Vous achetez vos abonnements directement aux fournisseurs. xSOM ne revend ni compte ni usage."],
        ["Jamais d’outil modifié", "Claude Code et Codex restent tels que les fournisseurs les livrent. L’agent écrit seulement leurs réglages officiels."],
      ],
      sent: "Ce qui remonte vers la console : des métriques d’usage (tokens, sessions) et des Événements de blocage sans contenu.",
    },
    proof: {
      kicker: "Pour l’audit",
      title: "Des preuves, pas des promesses.",
      lead: "xSOM Fleet ne promet pas votre conformité. Il produit les pièces qu’un auditeur demandera.",
      items: [
        ["Le registre des Postes", "Les assistants autorisés et observés, avec l’État de chaque Poste et ses motifs."],
        ["Le Journal des blocages", "Chaque Événement de blocage, sans contenu, dans un journal chaîné par hachage que vous pouvez vérifier."],
        ["Chartes et formations", "Les chartes acceptées et les formations suivies, dans le même dossier. Prévu pour le pilote."],
      ],
      note: "Le Dossier de preuves exporte ces pièces sur une période, et dit noir sur blanc ce qu’il ne prouve pas.",
    },
    deploy: {
      kicker: "Déploiement",
      title: "Votre parc, votre hébergement.",
      items: [
        ["Un agent par MDM", "Votre outil de gestion de flotte, Intune ou un autre, installe l’agent xSOM. Windows d’abord, puis macOS et Linux."],
        ["Une console en Europe", "Console, Politiques et journaux hébergés dans l’Union européenne, ou installés chez vous."],
        ["Un contrôle hors ligne", "Le Contrôle avant envoi ne fait aucun appel réseau vers xSOM. Il bloque aussi quand il ne peut pas conclure."],
      ],
      stepsTitle: "Une preuve, un pilote, puis le Groupe entier.",
      steps: [
        ["La preuve", "Une démonstration en direct, sur nos propres comptes : console, secret bloqué, coût réel face à l’estimation. Gratuite."],
        ["Le pilote", "Deux à trois mois chez vous, sur 150 développeurs ou plus, avec vos comptes et votre outil de déploiement."],
        ["Le déploiement", "Un abonnement annuel par développeur, avec l’accompagnement de xSOM Consulting : installation, formation, suivi."],
      ],
    },
    faq: {
      kicker: "Questions",
      title: "Questions fréquentes.",
      items: [
        ["xSOM voit-il nos prompts ou nos clés ?", "Non. La détection tourne sur le Poste, sans réseau ni modèle d’IA. Seuls remontent des métriques d’usage et des Événements de blocage sans contenu."],
        ["Est-ce permis par les fournisseurs ?", "Vos développeurs gardent l’outil officiel, non modifié, avec leur propre connexion ; aucun identifiant n’est collecté. Le cadre de votre déploiement est validé avec chaque fournisseur avant le pilote."],
        ["Quels assistants sont couverts ?", "Claude Code et Codex, sur le Poste du développeur. L’usage dans un navigateur, sur claude.ai ou chatgpt.com, n’est pas couvert."],
        ["À partir de combien de développeurs ?", "150 et plus. En dessous, une seule organisation Claude Team suffit."],
        ["Et si le contrôle échoue ?", "L’envoi est bloqué, avec un message clair. Un contenu trop gros, une analyse incomplète ou un délai dépassé ne laissent jamais partir un envoi partiel."],
        ["Combien coûte xSOM Fleet ?", "Un abonnement annuel par développeur gouverné, sur devis. La démonstration est gratuite."],
      ],
    },
    cta: {
      title: "Parlons de votre équipe.",
      body: "Combien de développeurs, quels assistants, quel outil de déploiement : trente minutes suffisent pour savoir si xSOM Fleet vous convient.",
      button: "Écrire à xSOM",
    },
  },
  en: {
    meta: {
      title: "xSOM Fleet · coding assistants across the enterprise",
      description: "Claude Code and Codex for 150 developers and more, on per-seat plans. One console, an agent on every workstation, the real cost and the evidence.",
      ogAlt: "xSOM Fleet: your coding-assistant subscriptions across the whole company",
    },
    film: {
      fallback: "Your coding-assistant subscriptions, across the whole company.",
    },
    hero: {
      kicker: "xSOM Fleet · platform · 2026 pilot programme",
      title: ["Your coding-assistant subscriptions,", "across the whole company."],
      lead: "Claude Code and Codex for 150 to 600+ developers, on per-seat subscriptions rather than pay-per-use. One console for the whole group, an agent on every workstation, the real cost per developer.",
      contact: "Request a demo",
      how: "How it works",
      hosts: "Works with",
    },
    modules: {
      kicker: "One platform",
      title: "Three modules, one console.",
      lead: "xSOM Fleet is a platform of three modules, run from the same console.",
      items: [
        {
          name: "Fleet Sièges",
          status: "pilot",
          badge: "Pilot programme",
          lead: "Subscriptions, their cost and their coverage.",
          points: [
            "Provider organizations and the seat cap: the 151st seat of a Claude Team organization is refused.",
            "Actual invoice per developer, per team and for the group, next to the estimated API equivalent.",
            "The status of every workstation, and an exportable list of the ones out of line.",
          ],
        },
        {
          name: "Fleet Guard",
          status: "pilot",
          badge: "Pilot programme",
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
          status: "soon",
          badge: "Coming · no date",
          lead: "An API gateway and agents, installed on the customer’s side.",
          points: [
            "Run from the same xSOM Fleet console.",
            "Not available yet: no date is announced.",
          ],
        },
      ],
      note: "Fleet Sièges and Fleet Guard are what this page shows. Fleet Gateway does not exist yet: we promise neither its scope nor its date.",
    },
    cost: {
      kicker: "The problem",
      title: "Same usage, two bills.",
      api: {
        label: "At API rates",
        value: "$150 – 250",
        unit: "per developer per month on average, far more under heavy use",
        source: "xSOM estimate · October 2026",
      },
      seat: {
        label: "On per-seat subscriptions",
        value: "$20 – 125",
        unit: "per developer per month, depending on the seat tier",
        source: "Public Claude Team and ChatGPT Business prices · October 2026",
      },
      note: "Claude Enterprise now bills all usage at API rates, and GitHub Copilot has billed by usage since 1 June 2026. Per-seat plans remain, but capped: 150 seats per Claude Team organization, 200 per ChatGPT Business workspace. Beyond 150 developers you need several provider organizations: xSOM Fleet brings them together.",
      split: "In the console, the actual invoice and the estimated API equivalent stay in two columns. The estimate is never added to what you pay.",
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
    never: {
      kicker: "Our limits",
      title: "What xSOM never does.",
      items: [
        ["Never your prompts", "The check runs on the workstation. No prompt, no file and no secret value is sent to xSOM."],
        ["Never your credentials", "Every developer keeps their own sign-in with the provider. xSOM collects no password, token or key."],
        ["Never resold usage", "You buy your subscriptions directly from the providers. xSOM resells no account and no usage."],
        ["Never a modified tool", "Claude Code and Codex stay exactly as the providers ship them. The agent only writes their official settings."],
      ],
      sent: "What reaches the console: usage metrics (tokens, sessions) and block events without content.",
    },
    proof: {
      kicker: "For your auditors",
      title: "Evidence, not promises.",
      lead: "xSOM Fleet does not promise your compliance. It produces the documents an auditor will ask for.",
      items: [
        ["The workstation register", "Allowed and observed assistants, with the status of every workstation and its reasons."],
        ["The block log", "Every block event, without content, in a hash-chained log you can verify."],
        ["Charters and training", "Accepted charters and completed training, in the same dossier. Planned for the pilot."],
      ],
      note: "The evidence dossier exports these documents over a period, and states in black and white what it does not prove.",
    },
    deploy: {
      kicker: "Deployment",
      title: "Your fleet, your hosting.",
      items: [
        ["An agent through MDM", "Your fleet management tool, Intune or another, installs the xSOM agent. Windows first, then macOS and Linux."],
        ["A console in Europe", "Console, policies and logs hosted in the European Union, or installed on your premises."],
        ["An offline check", "The pre-send check makes no network call to xSOM. It also blocks when it cannot conclude."],
      ],
      stepsTitle: "A proof, a pilot, then the whole group.",
      steps: [
        ["The proof", "A live demo on our own accounts: console, a secret blocked, real cost against the estimate. Free."],
        ["The pilot", "Two to three months on your side, with 150 developers or more, your accounts and your deployment tool."],
        ["The rollout", "An annual per-developer subscription, with xSOM Consulting’s support: installation, training, follow-up."],
      ],
    },
    faq: {
      kicker: "Questions",
      title: "Frequently asked questions.",
      items: [
        ["Does xSOM see our prompts or keys?", "No. Detection runs on the workstation, with no network and no AI model. Only usage metrics and block events without content are sent."],
        ["Do the providers allow it?", "Your developers keep the official, unmodified tool with their own sign-in; no credential is collected. The setup of your rollout is checked with each provider before the pilot."],
        ["Which assistants are covered?", "Claude Code and Codex, on the developer’s workstation. Browser use, on claude.ai or chatgpt.com, is not covered."],
        ["From how many developers?", "150 and more. Below that, a single Claude Team organization is enough."],
        ["What if the check fails?", "The send is blocked, with a clear message. Oversized content, an incomplete scan or a timeout never lets a partial send through."],
        ["How much does xSOM Fleet cost?", "An annual subscription per governed developer, on quotation. The demo is free."],
      ],
    },
    cta: {
      title: "Let’s talk about your team.",
      body: "How many developers, which assistants, which deployment tool: thirty minutes is enough to know whether xSOM Fleet fits.",
      button: "Write to xSOM",
    },
  },
} as const;
