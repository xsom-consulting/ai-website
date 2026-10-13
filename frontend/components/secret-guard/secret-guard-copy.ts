import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";

/**
 * guard.xsom.fr : Secret Guard, le moteur de détection de secrets de xSOM, open source
 * (Apache-2.0). Peu de mots, chacun à sa place.
 *
 * Ce que la page dit : une analyse locale, sans réseau ni modèle de langage ; un code
 * ouvert ; une intégration dans le module Fleet Guard de xSOM Fleet, qui remplace les
 * anciennes offres Pro et Entreprise. Ce qu'elle ne dit pas : aucun prix, aucune
 * couverture d'un assistant précis, aucun téléchargement d'extension. Pour l'extension
 * VS Code, elle dit seulement qu'une nouvelle version, branchée sur ce moteur, est en
 * préparation.
 */

export const SECRET_GUARD_ORIGIN = "https://guard.xsom.fr";

/** La vidéo d'ambiance de la page ; son affiche tient lieu d'image fixe. */
export const SECRET_GUARD_HERO_MEDIA = {
  webm: "/signal-media/secret-guard-loop.webm",
  poster: "/signal-media/secret-guard-loop.jpg",
};

export const SECRET_GUARD_COPY = {
  fr: {
    meta: {
      title: "Secret Guard · détection de secrets open source",
      description: "Secret Guard : le moteur de détection de secrets de xSOM, open source (Apache-2.0). Règles explicites et entropie, analyse locale, sans réseau ni modèle de langage.",
      ogAlt: "Secret Guard, le moteur open source de détection de secrets de xSOM",
    },
    hero: {
      kicker: "Open source · Apache-2.0",
      title: ["Repérer les secrets", "avant qu’ils ne partent."],
      lead: "Secret Guard est le moteur de détection de secrets de xSOM. Il analyse le texte sur la machine, sans réseau et sans modèle de langage. Son code est ouvert.",
      source: "Voir le code source",
      how: "Comment ça marche",
      video: "Un poste de développement de nuit : une ligne de code est saisie par un trait de lumière bleue.",
    },
    flow: {
      kicker: "Comment ça marche",
      title: "Un filtre entre texte et serveur.",
      prompt: "Votre texte",
      guard: "Secret Guard · sur la machine",
      server: "Serveurs de l’IA",
      layers: [
        ["Règles déterministes", "Clés, jetons, mots de passe"],
        ["Entropie", "Les chaînes trop aléatoires"],
        ["Pack de règles signé", "Distribué par Fleet Guard"],
      ],
      team: "xSOM Fleet",
      sent: "Envoyé",
      masked: "‹ secret masqué ›",
      promptLine: "Déploie avec",
      footnote: "Sans modèle de langage · sans réseau",
    },
    open: {
      kicker: "Open source",
      title: "Un code que chacun peut lire.",
      points: [
        ["Licence Apache-2.0", "Vous pouvez lire, utiliser et adapter le moteur selon les termes de la licence."],
        ["Dépôt public", "Le code, ses règles et son historique sont sur GitHub, dans l’organisation xSOM Consulting."],
        ["Analyse locale", "Le texte est analysé sur la machine. Il n’y a ni appel réseau, ni modèle de langage dans la détection."],
      ],
      action: "Ouvrir le dépôt sur GitHub",
    },
    fleet: {
      kicker: "Dans xSOM Fleet",
      title: "Pour toute l’entreprise.",
      body: "Le moteur tourne dans Fleet Guard, le module de xSOM Fleet qui protège les assistants de code d’une entreprise : un agent sur chaque Poste, une Politique et un Pack de règles signés, un Journal des blocages et un Dossier de preuves. Les offres payantes de Secret Guard, Pro et Entreprise, renvoient désormais vers ce module.",
      action: "Découvrir xSOM Fleet",
    },
    extension: {
      kicker: "Extension VS Code",
      body: "Une nouvelle version de l’extension VS Code, branchée sur ce moteur, est en préparation.",
    },
  },
  en: {
    meta: {
      title: "Secret Guard · open-source secret detection",
      description: "Secret Guard: xSOM’s open-source (Apache-2.0) secret-detection engine. Explicit rules and entropy, local analysis, no network and no language model.",
      ogAlt: "Secret Guard, xSOM’s open-source secret-detection engine",
    },
    hero: {
      kicker: "Open source · Apache-2.0",
      title: ["Spot secrets", "before they leave."],
      lead: "Secret Guard is xSOM’s secret-detection engine. It analyses text on the machine, with no network and no language model. Its code is open.",
      source: "View the source code",
      how: "How it works",
      video: "A developer workstation at night: one line of code is caught by a streak of blue light.",
    },
    flow: {
      kicker: "How it works",
      title: "A filter between text and server.",
      prompt: "Your text",
      guard: "Secret Guard · on the machine",
      server: "AI servers",
      layers: [
        ["Deterministic rules", "Keys, tokens, passwords"],
        ["Entropy", "Strings too random to be text"],
        ["Signed rule pack", "Distributed by Fleet Guard"],
      ],
      team: "xSOM Fleet",
      sent: "Sent",
      masked: "‹ secret masked ›",
      promptLine: "Deploy with",
      footnote: "No language model · no network",
    },
    open: {
      kicker: "Open source",
      title: "Code anyone can read.",
      points: [
        ["Apache-2.0 licence", "You may read, use and adapt the engine under the terms of the licence."],
        ["Public repository", "The code, its rules and its history are on GitHub, in the xSOM Consulting organisation."],
        ["Local analysis", "Text is analysed on the machine. Detection makes no network call and uses no language model."],
      ],
      action: "Open the repository on GitHub",
    },
    fleet: {
      kicker: "In xSOM Fleet",
      title: "For the whole company.",
      body: "The engine runs in Fleet Guard, the xSOM Fleet module that protects an enterprise’s coding assistants: an agent on every workstation, a signed Policy and rule pack, a block log and an evidence dossier. Secret Guard’s paid offers, Pro and Enterprise, now point to this module.",
      action: "Discover xSOM Fleet",
    },
    extension: {
      kicker: "VS Code extension",
      body: "A new version of the VS Code extension, built on this engine, is in preparation.",
    },
  },
} as const;

export { SECRET_GUARD_REPOSITORY };
