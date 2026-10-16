import type { Lang } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site-copy";
import { MAIN_SITE_ORIGIN } from "@/lib/sites";

/**
 * ai.xsom.fr, la division IA de xSOM Consulting, réduite à l'essentiel : qui nous
 * sommes, nos produits (xSOM Fleet en vedette, Secret Guard en open source), nos
 * prestations de conseil IA en quelques lignes, le contact. Charte de fleet.xsom.fr
 * (`app/pitch.css`).
 *
 * Les prestations reprennent ce que dit le site de conseil (`www.xsom.fr`, pages
 * « IA & Souveraineté » et « Expertises ») : aucune prestation, aucun chiffre et aucune
 * référence client n'est ajouté ici. Fleet Gateway est présenté comme disponible pour
 * pilote, sans autre promesse.
 */

export const AI_CONTACT = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("xSOM · IA")}`;
export const AI_ORIGIN = "https://ai.xsom.fr";

/**
 * Le film de la couverture (Remotion, composition `ai-hero` de `films/`) : sans texte,
 * muet, en boucle. Le titre reste le HTML de la page.
 */
export const AI_HERO_FILM = { mp4: "/signal-media/xsom-ia-hero.mp4", poster: "/signal-media/xsom-ia-hero.jpg" } as const;

/** L'image Open Graph : la couverture de la page, un fichier par langue. */
export const aiOgImage = (lang: Lang) => `/signal-media/xsom-ia-og-${lang}.jpg`;

export const AI_COPY = {
  fr: {
    meta: {
      title: "xSOM · IA · la division IA de xSOM Consulting",
      description: "La division IA de xSOM Consulting : xSOM Fleet, la gestion de l’IA d’entreprise ; Secret Guard, le moteur open source de détection de secrets ; et nos prestations de conseil IA.",
      ogAlt: "xSOM · IA, la division IA de xSOM Consulting",
    },
    hero: {
      kicker: "La division IA de xSOM Consulting",
      title: "Conseil et produits pour l’IA d’entreprise.",
      lead: "Nos consultants mettent l’IA en production, nos produits la gouvernent au quotidien. Cabinet indépendant depuis 2007.",
      products: "Découvrir nos produits",
      services: "Découvrir nos prestations",
      contact: "Nous écrire",
      next: "Aller à nos produits",
      pause: "Mettre le film en pause",
      play: "Lire le film",
    },
    products: {
      number: "01",
      name: "Nos produits",
      title: { before: "Aperçu de nos ", accent: "produits", after: "." },
      carousel: { label: "Nos produits, un par un", prev: "Produit précédent", next: "Produit suivant" },
      fleet: {
        tag: "Plateforme · programme pilote 2026",
        name: "xSOM Fleet",
        line: "La plateforme de gestion de l’IA d’entreprise.",
        verbs: ["Gouverner", "Mesurer", "Décider"],
        features: [
          {
            key: "govern",
            tag: "Gouverner · Sécurité",
            title: "Les meilleures IA du marché, en toute sécurité.",
            body: "Claude Code et Codex sur chaque poste, sous une Politique signée : contrôle avant envoi, et un dossier de preuves pour vos clients et vos collaborateurs.",
          },
          {
            key: "measure",
            tag: "Mesurer · FinOps",
            title: "Vos coûts réels, pour optimiser votre facture IA.",
            body: "Sièges, facture réelle et équivalent API, par équipe et par mois : le FinOps et la business intelligence de votre IA.",
          },
          {
            key: "decide",
            tag: "Décider · Stratégie",
            title: "Abonnements, API ou modèle sur site : choisir sur des chiffres.",
            body: "Un simulateur, nourri par votre usage mesuré, compare les trois options et leurs coûts.",
          },
        ],
        proof: {
          figure: "× 39",
          text: "Mesure réelle chez xSOM, septembre 2026 : un forfait Claude à 200 $ par mois a couvert 7 815 $ d’usage au tarif API.",
        },
        providers: [
          { brand: "claude", name: "Claude Code" },
          { brand: "chatgpt", name: "Codex" },
        ],
        architecture: {
          label: "Architecture cible de xSOM Fleet, en développement : sur chaque poste, Claude Code et Codex passent par l’Agent xSOM, qui analyse localement chaque envoi avec Secret Guard avant qu’il ne parte vers Anthropic ou OpenAI. La console xSOM Fleet signe la Politique appliquée par l’Agent et reçoit des Événements sans contenu ; elle en tire le dossier de preuves, la facture réelle par équipe et un simulateur qui compare abonnements, API et modèle sur site.",
          tag: "Architecture cible · en développement",
          postes: "Poste du développeur",
          providers: "Fournisseurs IA",
          agent: { name: "Agent xSOM", detail: "Secret Guard · local" },
          console: "Console xSOM Fleet",
          policy: "Politique signée",
          events: "Événements sans contenu",
          outputs: [
            { key: "govern", name: "Dossier de preuves", detail: "pour l’audit" },
            { key: "measure", name: "Facture réelle", detail: "par équipe, par mois" },
            { key: "decide", name: "Simulateur", detail: "abonnements, API, sur site" },
          ],
          caption: "Schéma de principe",
        },
        trademarks: "Claude et ChatGPT sont des marques de leurs détenteurs, citées pour indiquer les services pris en charge, sans partenariat ni approbation.",
        action: "Découvrir xSOM Fleet",
      },
      guard: {
        tag: "Open source · Apache-2.0",
        name: "Secret Guard",
        audience: "Pour les entreprises et les indépendants",
        line: "Vos clés d’API, jetons et mots de passe repérés sur la machine, avant qu’ils ne partent vers vos agents de code.",
        points: ["Analyse locale, sans réseau ni modèle de langage", "Règles explicites et calcul d’entropie", "Code ouvert, vérifiable par tous"],
        vscode: "Extension VS Code · nouvelle version en préparation",
        demo: {
          label: "Secret Guard en action dans VS Code : le développeur envoie à @secretguard un prompt qui contient une clé d’accès AWS ; l’extension remplace la clé par <REDACTED_aws_access_key_id>, revérifie le texte et l’envoie ; le modèle répond. Le développeur n’est pas bloqué, la clé n’a pas quitté le poste.",
          window: "api — Visual Studio Code",
          file: "deploy.sh",
          chat: "CHAT",
          participant: "@secretguard",
          prompt: "Déploie l’API en production avec AWS_ACCESS_KEY_ID=",
          secret: "AKIAIOSFODNN7EXAMPLE",
          marker: "<REDACTED_aws_access_key_id>",
          notice: "Version expurgée et rescannée avant envoi.",
          answer: ["La clé a été masquée avant l’envoi : je ne la vois pas.", "Définissez-la dans vos variables d’environnement,", "puis lancez npm run deploy."],
          status: "Secret Guard : Expurger",
          received: "Ce que reçoit le modèle",
          outcomes: ["Le prompt est parti : le développeur continue.", "La clé est restée sur le poste."],
          panel: "Capture réelle",
          replay: "Rejouer",
          caption: "Messages réels de l’extension · clé d’exemple de la documentation AWS",
        },
        action: "Découvrir Secret Guard",
        source: "Code source",
      },
    },
    services: {
      name: "Conseil",
      title: "Nos prestations de conseil IA.",
      lead: "Du conseil jusqu’à la production. Trois exigences, jamais l’une au détriment des autres : sérénité, sécurité, souveraineté.",
      items: [
        { name: "Infrastructures IA & cloud souverain", body: "Dimensionner, héberger et exploiter les charges IA sous contrôle." },
        { name: "Données & MLOps", body: "Faire passer les modèles du prototype à un service suivi en production." },
        { name: "Sécurité des pipelines IA", body: "Les pipelines IA sont des surfaces d’attaque." },
      ],
      more: "Voir IA & Souveraineté sur www.xsom.fr",
      moreHref: `${MAIN_SITE_ORIGIN}/ia-souverainete.html`,
    },
    contact: {
      name: "Contact",
      title: "Un projet IA ?",
      body: "Écrivez-nous quelques lignes sur votre contexte : xSOM Consulting vous répond.",
      button: "Écrire à xSOM",
      main: "xSOM Consulting",
    },
  },
  en: {
    meta: {
      title: "xSOM · AI · the AI division of xSOM Consulting",
      description: "The AI division of xSOM Consulting: xSOM Fleet, enterprise AI management; Secret Guard, the open-source secret-detection engine; and our AI consulting services.",
      ogAlt: "xSOM · AI, the AI division of xSOM Consulting",
    },
    hero: {
      kicker: "The AI division of xSOM Consulting",
      title: "Consulting and products for enterprise AI.",
      lead: "Our consultants take AI to production, our products govern it day to day. An independent firm since 2007.",
      products: "Discover our products",
      services: "Discover our services",
      contact: "Write to us",
      next: "Go to our products",
      pause: "Pause the film",
      play: "Play the film",
    },
    products: {
      number: "01",
      name: "Our products",
      title: { before: "An overview of our ", accent: "products", after: "." },
      carousel: { label: "Our products, one at a time", prev: "Previous product", next: "Next product" },
      fleet: {
        tag: "Platform · 2026 pilot programme",
        name: "xSOM Fleet",
        line: "The enterprise AI management platform.",
        verbs: ["Govern", "Measure", "Decide"],
        features: [
          {
            key: "govern",
            tag: "Govern · Security",
            title: "The best AI on the market, securely.",
            body: "Claude Code and Codex on every workstation, under a signed Policy: a pre-send check, and an evidence dossier for your customers and your staff.",
          },
          {
            key: "measure",
            tag: "Measure · FinOps",
            title: "Your actual costs, to optimise your AI bill.",
            body: "Seats, actual invoice and API equivalent, per team and per month: FinOps and business intelligence for your AI.",
          },
          {
            key: "decide",
            tag: "Decide · Strategy",
            title: "Subscriptions, API or on-premise model: choose on figures.",
            body: "A simulator, fed by your measured usage, compares the three options and their costs.",
          },
        ],
        proof: {
          figure: "× 39",
          text: "Actual measurement at xSOM, September 2026: a $200-a-month Claude plan covered $7,815 of usage at API rates.",
        },
        providers: [
          { brand: "claude", name: "Claude Code" },
          { brand: "chatgpt", name: "Codex" },
        ],
        architecture: {
          label: "Target architecture of xSOM Fleet, in development: on each workstation, Claude Code and Codex go through the xSOM Agent, which checks every send locally with Secret Guard before it leaves for Anthropic or OpenAI. The xSOM Fleet console signs the Policy the Agent applies and receives content-free Events; from them it builds the evidence dossier, the actual invoice per team and a simulator comparing subscriptions, API and an on-premise model.",
          tag: "Target architecture · in development",
          postes: "Developer workstation",
          providers: "AI providers",
          agent: { name: "xSOM Agent", detail: "Secret Guard · local" },
          console: "xSOM Fleet console",
          policy: "Signed Policy",
          events: "Content-free Events",
          outputs: [
            { key: "govern", name: "Evidence dossier", detail: "for audit" },
            { key: "measure", name: "Actual invoice", detail: "per team, per month" },
            { key: "decide", name: "Simulator", detail: "subscriptions, API, on-premise" },
          ],
          caption: "Schematic diagram",
        },
        trademarks: "Claude and ChatGPT are trademarks of their owners, named to indicate the supported services, with no partnership or endorsement.",
        action: "Discover xSOM Fleet",
      },
      guard: {
        tag: "Open source · Apache-2.0",
        name: "Secret Guard",
        audience: "For companies and freelancers",
        line: "Your API keys, tokens and passwords caught on the machine, before they leave for your coding agents.",
        points: ["Local analysis, no network and no language model", "Explicit rules and an entropy check", "Open code, checkable by anyone"],
        vscode: "VS Code extension · new version in preparation",
        demo: {
          label: "Secret Guard in action in VS Code: the developer sends @secretguard a prompt containing an AWS access key; the extension replaces the key with <REDACTED_aws_access_key_id>, rechecks the text and sends it; the model replies. The developer is not blocked, the key never left the workstation.",
          window: "api — Visual Studio Code",
          file: "deploy.sh",
          chat: "CHAT",
          participant: "@secretguard",
          prompt: "Deploy the API to production with AWS_ACCESS_KEY_ID=",
          secret: "AKIAIOSFODNN7EXAMPLE",
          marker: "<REDACTED_aws_access_key_id>",
          notice: "Version expurgée et rescannée avant envoi.",
          answer: ["The key was masked before sending: I cannot see it.", "Set it in your environment variables,", "then run npm run deploy."],
          status: "Secret Guard : Expurger",
          received: "What the model receives",
          outcomes: ["The prompt went through: the developer carries on.", "The key stayed on the workstation."],
          panel: "Actual capture",
          replay: "Replay",
          caption: "The extension’s actual messages (in French) · AWS documentation example key",
        },
        action: "Discover Secret Guard",
        source: "Source code",
      },
    },
    services: {
      name: "Consulting",
      title: "Our AI consulting services.",
      lead: "From consulting to production. Three requirements, never one at the expense of the others: operational confidence, security, sovereignty.",
      items: [
        { name: "AI infrastructure & sovereign cloud", body: "Size, host and operate AI workloads with control." },
        { name: "Data & MLOps", body: "Move models from prototypes to monitored production services." },
        { name: "AI pipeline security", body: "AI pipelines are attack surfaces." },
      ],
      more: "See AI & Sovereignty on www.xsom.fr",
      moreHref: `${MAIN_SITE_ORIGIN}/en/ai-sovereignty.html`,
    },
    contact: {
      name: "Contact",
      title: "An AI project?",
      body: "Write us a few lines about your context: xSOM Consulting will reply.",
      button: "Write to xSOM",
      main: "xSOM Consulting",
    },
  },
} as const;
