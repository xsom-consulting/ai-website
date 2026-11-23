import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";

/**
 * guard.xsom.fr : Secret Guard en libre-service, pour un développeur ou un indépendant.
 *
 * Ce que la page dit : avant l'envoi, le Client Fleet installé sur le Poste analyse le
 * prompt et les fichiers lus, localement, sans réseau ni modèle de langage ; il bloque
 * l'envoi ou remplace la valeur par un Substitut ; une mascotte dit ce qu'elle a fait ;
 * rien ne quitte le Poste ; gratuit jusqu'à 3 Postes. Licences exactes : la détection en
 * Apache-2.0, l'expurgation sous PolyForm Small Business 1.0.0.
 *
 * Ce qu'elle ne dit pas : aucun prix, aucune promesse de couverture totale. Les secrets
 * d'exemple sont visiblement inventés. Les noms d'assistants désignent les services pris
 * en charge (mention de marques en tête de page).
 */

export const SECRET_GUARD_ORIGIN = "https://guard.xsom.fr";

/** La vidéo d'ambiance de la page ; son affiche tient lieu d'image fixe. */
export const SECRET_GUARD_HERO_MEDIA = {
  webm: "/signal-media/secret-guard-loop.webm",
  poster: "/signal-media/secret-guard-loop.jpg",
};

/**
 * La vidéo de démonstration, à produire : `public/signal-media/secret-guard-demo.mp4` et
 * son affiche `secret-guard-demo.jpg`. Leur présence est lue à la construction
 * (`next.config.mjs`) ; sans elles, la page garde la vidéo d'ambiance.
 */
export const SECRET_GUARD_DEMO_MEDIA = {
  mp4: "/signal-media/secret-guard-demo.mp4",
  poster: "/signal-media/secret-guard-demo.jpg",
  available: process.env.SG_DEMO_VIDEO === "1",
  hasPoster: process.env.SG_DEMO_POSTER === "1",
};

/** Les versions publiées, à mettre à jour à chaque publication. */
export const SECRET_GUARD_RELEASE = { client: "0.9.47", engine: "v0.10.4", date: "2026-11-21" };

export const SECRET_GUARD_LICENCES = {
  apache: "https://www.apache.org/licenses/LICENSE-2.0",
  polyform: "https://polyformproject.org/licenses/small-business/1.0.0/",
};

/**
 * Le Substitut tel que l'écrit le Client Fleet : un numéro d'ordre et le type du secret,
 * jamais la valeur. Composé ici plutôt qu'écrit en toutes lettres.
 */
export function substitute(lang: "fr" | "en", ordinal: number, type: string): string {
  return lang === "fr"
    ? `[secret masqué par xSOM n°${ordinal} : ${type}, pas la vraie valeur]`
    : `[secret masked by xSOM #${ordinal}: ${type}, not the real value]`;
}

export const SECRET_GUARD_COPY = {
  fr: {
    meta: {
      title: "xSOM Aparté · gardez votre IA, rassurez vos clients",
      description: "Aparté bloque ou masque vos clés d’API, jetons et mots de passe avant qu’ils ne partent vers vos assistants d’IA. Analyse sur votre machine, sans réseau ni modèle de langage. Gratuit jusqu’à 3 Postes.",
      ogAlt: "Secret Guard : vos secrets restent sur votre machine",
    },
    hero: {
      kicker: "0 € · jusqu’à 3 Postes",
      title: ["Gardez votre IA.", "Rassurez vos clients."],
      lead: "Claude Code, Codex, ChatGPT : vous ne codez plus sans. Avant chaque envoi, Aparté vérifie sur votre machine ce qui part. Une clé d’API, un jeton, un mot de passe : il bloque l’envoi, ou remplace la valeur par un Substitut. Le modèle ne voit jamais la vraie valeur.",
      assistants: "Pour Claude Code, Codex et GitHub Copilot CLI ; bientôt ChatGPT et Claude dans le navigateur.",
      trademarks: "Claude, ChatGPT, Codex et GitHub Copilot sont des marques de leurs détenteurs, citées pour indiquer les services pris en charge, sans partenariat ni approbation.",
      form: {
        label: "Votre adresse",
        placeholder: "vous@exemple.fr",
        submit: "Créer mon compte gratuit",
        github: "Continuer avec GitHub",
        note: "L’adresse n’est lue que par la page d’inscription de plateforme.xsom.fr, dans votre navigateur. Ce site ne la garde pas. Sans code d’invitation.",
      },
      how: "Essayer dans le navigateur",
      video: "Un poste de développement de nuit : une ligne de code est saisie par un trait de lumière bleue.",
      demo: "Démonstration d’Aparté : un secret bloqué, puis masqué avant l’envoi.",
    },
    does: {
      kicker: "Ce que ça fait",
      title: "Il s’arrête avant l’envoi.",
      lead: "Le prompt et les fichiers que lit l’assistant sont analysés sur votre machine, avant de partir. Votre Politique décide de la suite.",
      items: [
        { key: "block", title: "Bloquer", body: "L’envoi s’arrête. Vous voyez quel type de secret a été trouvé, jamais sa valeur, et vous corrigez." },
        { key: "mask", title: "Masquer", body: "La valeur est remplacée par un Substitut. Le modèle ne voit que le Substitut ; la vraie valeur reste sur votre machine et y est réinjectée quand c’est permis." },
        { key: "image", title: "Captures d’écran", body: "Une capture contient un jeton ? La zone est masquée sur une copie de l’image. Le modèle lit tout le reste." },
        { key: "mascot", title: "Une mascotte qui prévient", body: "Elle apparaît quand elle bloque ou masque quelque chose et dit quoi : le type de secret, jamais la valeur. Quatre apparences : Standard, Discrète, Minimale, Aucune." },
        { key: "report", title: "Signaler un faux positif", body: "Ce n’était pas un secret ? Vous le signalez depuis la mascotte, avec sa nature et le pourquoi, sans la valeur." },
      ],
      example: {
        label: "Exemple · valeur inventée",
        typed: "Vous tapez",
        sent: "Le modèle reçoit",
        before: "Déploie avec API_KEY=",
        value: "exemple-inventé-0000",
        substitute: substitute("fr", 12, "clé d’API"),
      },
    },
    install: {
      kicker: "Comment l’installer",
      title: "En trois étapes.",
      steps: [
        { title: "Créez votre compte", body: "Avec votre adresse ou votre compte GitHub, sans code d’invitation." },
        { title: "Ouvrez la page de bienvenue", body: "Elle vous propose le téléchargement qui correspond à votre système." },
        { title: "Installez le Client Fleet", body: "Il se branche sur vos assistants. Rien d’autre à régler pour commencer." },
      ],
      systems: [
        { key: "macos", name: "macOS", tag: "Application", body: "Apple Silicon et Intel. L’application xSOM Fleet installe le Client Fleet et la mascotte." },
        { key: "linux", name: "Linux", tag: "Une commande", body: "La commande à copier vous est donnée sur la page de bienvenue." },
        { key: "windows", name: "Windows", tag: "Version d’essai", body: "Une version d’essai, plus ancienne que celle de macOS et Linux." },
        { key: "browser", name: "Navigateur", tag: "Bientôt", body: "L’extension pour ChatGPT et Claude dans le navigateur est construite ; elle n’est pas encore en boutique." },
      ],
      version: `Client Fleet ${SECRET_GUARD_RELEASE.client}, publié le 21 novembre 2026 · moteur ${SECRET_GUARD_RELEASE.engine}`,
      action: "Créer mon compte gratuit",
    },
    flow: {
      kicker: "Rien ne quitte votre machine",
      title: "L’analyse se fait chez vous.",
      prompt: "Votre prompt",
      guard: "Aparté · sur votre machine",
      server: "Serveurs de l’IA",
      layers: [
        ["Règles déterministes", "Clés, jetons, mots de passe"],
        ["Entropie", "Les chaînes trop aléatoires"],
        ["Pack de règles signé", "Distribué par Fleet Guard"],
      ],
      team: "xSOM Fleet",
      sent: "Envoyé",
      masked: substitute("fr", 1, "jeton GitHub"),
      promptLine: "Déploie avec",
      footnote: "Sans modèle de langage · sans réseau",
      points: [
        ["Ni prompt, ni fichier", "Ce que vous écrivez et ce que l’assistant lit sont analysés sur place. Rien n’est envoyé à xSOM."],
        ["Ni valeur de secret", "La vraie valeur ne quitte pas votre machine : ni en clair, ni encodée, ni hachée."],
        ["Des Événements sans contenu", "Le serveur ne reçoit que des Événements : quel type de secret, quand, quelle décision. Jamais le contenu."],
      ],
    },
    licences: {
      kicker: "Licences",
      title: "Le code se lit.",
      items: [
        { key: "detection", name: "Détection", licence: "Apache-2.0", path: "github.com/xsom-consulting/secret-guard", body: "Le moteur qui repère les secrets. Vous pouvez le lire, l’utiliser et l’adapter selon les termes de la licence." },
        { key: "expurgation", name: "Expurgation", licence: "PolyForm Small Business 1.0.0", path: "secret-guard/expurgation", body: "Le module qui écrit les Substituts. Gratuit pour une petite structure : moins de 100 personnes et moins de 1 M$ de revenu. Au-delà, une licence écrite de xSOM." },
      ],
      action: "Ouvrir le dépôt sur GitHub",
    },
    fleet: {
      kicker: "Pour votre entreprise",
      title: "Au-delà de 3 Postes : xSOM Fleet.",
      body: "Le même moteur tourne dans Fleet Guard, le module de sécurité de xSOM Fleet, pour toute une entreprise. Aparté s’appelait Secret Guard ; ses anciennes offres Pro et Entreprise renvoient désormais vers xSOM Fleet.",
      points: ["Une console pour plusieurs équipes", "Le pilotage FinOps de vos abonnements d’IA", "Des preuves pour l’audit : Journal des blocages, Dossier de preuves"],
      action: "Découvrir xSOM Fleet",
    },
  },
  en: {
    meta: {
      title: "xSOM Aparté · keep your AI, reassure your clients",
      description: "Aparté blocks or masks your API keys, tokens and passwords before they leave for your AI assistants. Analysis on your machine, no network and no language model. Free for up to 3 workstations.",
      ogAlt: "xSOM Aparté: keep your AI, reassure your clients",
    },
    hero: {
      kicker: "€0 · up to 3 workstations",
      title: ["Keep your AI.", "Reassure your clients."],
      lead: "Claude Code, Codex, ChatGPT: you no longer code without them. Before every send, Aparté checks on your machine what is leaving. An API key, a token, a password: it blocks the send, or replaces the value with a Substitute. The model never sees the real value.",
      assistants: "For Claude Code, Codex, GitHub Copilot CLI and Claude Desktop (precise mode, macOS); ChatGPT and Claude in the browser with the extension, soon in the stores.",
      trademarks: "Claude, ChatGPT, Codex and GitHub Copilot are trademarks of their owners, named to indicate the supported services, with no partnership or endorsement.",
      form: {
        label: "Your email",
        placeholder: "you@example.com",
        submit: "Create my free account",
        github: "Continue with GitHub",
        note: "Your email is read only by the sign-up page of plateforme.xsom.fr, in your browser. This site does not keep it. No invitation code.",
      },
      how: "Try it in the browser",
      video: "A developer workstation at night: one line of code is caught by a streak of blue light.",
      demo: "Aparté demo: a secret blocked, then masked before sending.",
    },
    does: {
      kicker: "What it does",
      title: "It stops before sending.",
      lead: "The prompt and the files the assistant reads are analysed on your machine, before they leave. Your Policy decides what happens next.",
      items: [
        { key: "block", title: "Block", body: "The send stops. You see which type of secret was found, never its value, and you fix it." },
        { key: "mask", title: "Mask", body: "The value is replaced by a Substitute. The model only sees the Substitute; the real value stays on your machine and is put back locally when allowed." },
        { key: "image", title: "Screenshots", body: "A screenshot shows a token? The area is masked on a copy of the image. The model reads everything else." },
        { key: "mascot", title: "A mascot that tells you", body: "It appears when it blocks or masks something and says what: the type of secret, never the value. Four looks: Standard, Discreet, Minimal, None." },
        { key: "report", title: "Report a false positive", body: "It was not a secret? Report it from the mascot, with what it was and why, without the value." },
      ],
      example: {
        label: "Example · made-up value",
        typed: "You type",
        sent: "The model receives",
        before: "Deploy with API_KEY=",
        value: "made-up-example-0000",
        substitute: substitute("en", 12, "API key"),
      },
    },
    install: {
      kicker: "How to install it",
      title: "In three steps.",
      steps: [
        { title: "Create your account", body: "With your email or your GitHub account, no invitation code." },
        { title: "Open the welcome page", body: "It offers the download that matches your system." },
        { title: "Install the Fleet Client", body: "It hooks into your assistants. Nothing else to set up to get started." },
      ],
      systems: [
        { key: "macos", name: "macOS", tag: "Application", body: "Apple Silicon and Intel. The xSOM Fleet application installs the Fleet Client and the mascot." },
        { key: "linux", name: "Linux", tag: "One command", body: "The command to copy is given on the welcome page." },
        { key: "windows", name: "Windows", tag: "Trial version", body: "A trial version, older than the macOS and Linux one." },
        { key: "browser", name: "Browser", tag: "Soon", body: "The extension for ChatGPT and Claude in the browser is built; it is not in the stores yet." },
      ],
      version: `Fleet Client ${SECRET_GUARD_RELEASE.client}, released on 21 November 2026 · engine ${SECRET_GUARD_RELEASE.engine}`,
      action: "Create my free account",
    },
    flow: {
      kicker: "Nothing leaves your machine",
      title: "The analysis happens on your side.",
      prompt: "Your prompt",
      guard: "Aparté · on your machine",
      server: "AI servers",
      layers: [
        ["Deterministic rules", "Keys, tokens, passwords"],
        ["Entropy", "Strings too random to be text"],
        ["Signed rule pack", "Distributed by Fleet Guard"],
      ],
      team: "xSOM Fleet",
      sent: "Sent",
      masked: substitute("en", 1, "GitHub token"),
      promptLine: "Deploy with",
      footnote: "No language model · no network",
      points: [
        ["No prompt, no file", "What you write and what the assistant reads are analysed in place. Nothing is sent to xSOM."],
        ["No secret value", "The real value does not leave your machine: not in clear, not encoded, not hashed."],
        ["Events without content", "The server only receives Events: which type of secret, when, which decision. Never the content."],
      ],
    },
    licences: {
      kicker: "Licences",
      title: "The code can be read.",
      items: [
        { key: "detection", name: "Detection", licence: "Apache-2.0", path: "github.com/xsom-consulting/secret-guard", body: "The engine that spots secrets. You may read, use and adapt it under the terms of the licence." },
        { key: "expurgation", name: "Redaction", licence: "PolyForm Small Business 1.0.0", path: "secret-guard/expurgation", body: "The module that writes the Substitutes. Free for a small business: fewer than 100 people and less than USD 1 M in revenue. Beyond that, a written licence from xSOM." },
      ],
      action: "Open the repository on GitHub",
    },
    fleet: {
      kicker: "For your company",
      title: "Beyond 3 workstations: xSOM Fleet.",
      body: "The same engine runs in Fleet Guard, the security module of xSOM Fleet, for a whole company. Aparté used to be called Secret Guard; its former Pro and Enterprise offers now point to xSOM Fleet.",
      points: ["One console for several teams", "FinOps steering of your AI subscriptions", "Evidence for the audit: block log, evidence dossier"],
      action: "Discover xSOM Fleet",
    },
  },
} as const;

export { SECRET_GUARD_REPOSITORY };
