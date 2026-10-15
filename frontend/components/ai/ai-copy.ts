import type { FilmMedia } from "@/components/home/HomeFilm";
import { CONTACT_EMAIL } from "@/lib/site-copy";
import { MAIN_SITE_ORIGIN } from "@/lib/sites";

/**
 * ai.xsom.fr, la division IA de xSOM Consulting.
 *
 * Les prestations reprennent mot pour mot ce que dit le site de conseil
 * (`www.xsom.fr`, pages « IA & Souveraineté » et « Expertises ») : aucune prestation,
 * aucun chiffre et aucune référence client n'est ajouté ici. Les produits sont ceux
 * de la plateforme xSOM Fleet et du moteur open source Secret Guard ; Fleet Gateway
 * est présenté comme disponible pour pilote, sans autre promesse.
 */

export const AI_CONTACT = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("xSOM · IA")}`;
export const AI_ORIGIN = "https://ai.xsom.fr";

const MEDIA = "/signal-media";

/** Le film d'ouverture (Remotion : `films/src/HomeFilm.tsx`), un par langue. */
export const AI_HERO_MEDIA: FilmMedia = {
  fr: {
    mp4: `${MEDIA}/xsom-ia-home-fr.mp4`,
    poster: `${MEDIA}/xsom-ia-home-fr.jpg`,
    name: "Film d’introduction de xSOM · IA",
    label: "Film d’introduction de xSOM · IA, sans parole : vos équipes adoptent l’IA. Secrets, données, actions d’agents : exposés. Détecter les secrets, bloquer avant l’envoi, prouver chaque blocage. La division IA de xSOM Consulting : produits et conseil.",
  },
  en: {
    mp4: `${MEDIA}/xsom-ia-home-en.mp4`,
    poster: `${MEDIA}/xsom-ia-home-en.jpg`,
    name: "xSOM · AI introduction film",
    label: "xSOM · AI introduction film, without speech: your teams embrace AI. Secrets, data, agent actions: exposed. Detect secrets, block before sending, prove every block. The AI division of xSOM Consulting: products and consulting.",
  },
};

export const AI_COPY = {
  fr: {
    meta: {
      title: "xSOM · IA · la division IA de xSOM Consulting",
      description: "Prestations de conseil IA et produits pour utiliser l’IA en entreprise : xSOM Fleet, la plateforme de gouvernance des IA, et Secret Guard, le moteur open source de détection de secrets.",
      ogAlt: "xSOM · IA, la division IA de xSOM Consulting",
    },
    film: { fallback: "La division IA de xSOM Consulting." },
    intro: {
      kicker: "xSOM · IA",
      title: "La division IA de xSOM.",
      lead: "xSOM Consulting, cabinet indépendant depuis 2007, réunit ici ses prestations IA et ses produits : de l’infrastructure au modèle, du poste du développeur à la console de l’entreprise.",
      services: "Voir les prestations",
      products: "Voir les produits",
    },
    services: {
      kicker: "01 · Prestations IA",
      title: "Du conseil jusqu’à la production.",
      lead: "Les prestations IA de xSOM Consulting, telles que le cabinet les présente sur www.xsom.fr. Trois exigences, jamais l’une au détriment des autres : sérénité, sécurité, souveraineté.",
      items: [
        {
          name: "Infrastructures IA & cloud souverain",
          body: "Dimensionner, héberger et exploiter les charges IA sous contrôle.",
          tags: ["Cloud souverain", "GPU & datacenter", "Cloud HPC", "FinOps · AIOps", "Green IT"],
        },
        {
          name: "Données & MLOps",
          body: "Faire passer les modèles du prototype à un service suivi en production.",
          tags: ["Data engineering", "ML & automatisation", "MLOps", "Gouvernance"],
        },
        {
          name: "Sécurité des pipelines IA",
          body: "Les pipelines IA sont des surfaces d’attaque.",
          tags: ["Pipelines de données sensibles", "Empoisonnement de modèles", "AI Act · DORA · NIS2", "Tests de résilience"],
        },
      ],
      more: "Voir IA & Souveraineté sur www.xsom.fr",
      moreHref: `${MAIN_SITE_ORIGIN}/ia-souverainete.html`,
      contact: "Parler de votre projet",
    },
    products: {
      kicker: "02 · Produits IA",
      title: "Nos produits IA.",
      lead: "Une plateforme pour gouverner les IA d’une entreprise, et le moteur open source qui y détecte les secrets.",
      fleet: {
        badge: "Plateforme · programme pilote 2026",
        name: "xSOM Fleet",
        body: "Les meilleurs modèles d’IA du marché, aux standards de sécurité de l’entreprise : pilotez toute votre architecture IA en un seul endroit, abonnements (Claude Code et Codex sur chaque Poste), clés API et modèles hébergés chez vous.",
        modules: [
          ["Fleet Sièges", "Solution FinOps : Sièges, Facture réelle, Équivalent API estimé."],
          ["Fleet Guard", "Solution cybersécurité : secrets bloqués sur le Poste, Journal des blocages, Dossier de preuves."],
          ["Fleet Gateway", "Solution architecture et stratégie IA : passerelle installée chez le client, Budgets API, modèles hébergés chez vous. Disponible pour pilote."],
        ],
        action: "Découvrir xSOM Fleet",
      },
      guard: {
        badge: "Open source · Apache-2.0",
        name: "Secret Guard",
        body: "Le moteur de détection de secrets de xSOM Fleet, publié en open source. Il analyse le texte sur la machine, sans réseau ni modèle de langage.",
        points: ["Règles explicites et calcul d’entropie", "Analyse locale, sans réseau", "Code ouvert, vérifiable par tous"],
        action: "Découvrir Secret Guard",
        source: "Code source",
      },
    },
    glossary: {
      title: "Mettre des mots sur les risques.",
      body: "Injection de prompt, fuite de secrets, empoisonnement… Chaque menace avec son attaque type, sa parade de référence et les outils libres.",
      action: "Ouvrir le glossaire des menaces IA",
    },
    contact: {
      title: "Un projet IA ?",
      body: "Écrivez-nous quelques lignes sur votre contexte : xSOM Consulting vous répond.",
      button: "Écrire à xSOM",
      main: "xSOM Consulting",
    },
  },
  en: {
    meta: {
      title: "xSOM · AI · the AI division of xSOM Consulting",
      description: "AI consulting services and products for using AI in the enterprise: xSOM Fleet, the AI governance platform, and Secret Guard, the open-source secret-detection engine.",
      ogAlt: "xSOM · AI, the AI division of xSOM Consulting",
    },
    film: { fallback: "The AI division of xSOM Consulting." },
    intro: {
      kicker: "xSOM · AI",
      title: "The AI division of xSOM.",
      lead: "xSOM Consulting, an independent firm since 2007, brings its AI services and its products together here: from infrastructure to the model, from the developer’s workstation to the enterprise console.",
      services: "See the services",
      products: "See the products",
    },
    services: {
      kicker: "01 · AI services",
      title: "From consulting to production.",
      lead: "The AI services of xSOM Consulting, as the firm presents them on www.xsom.fr. Three requirements, never one at the expense of the others: operational confidence, security, sovereignty.",
      items: [
        {
          name: "AI infrastructure & sovereign cloud",
          body: "Size, host and operate AI workloads with control.",
          tags: ["Sovereign cloud", "GPU & data centre", "Cloud HPC", "FinOps · AIOps", "Green IT"],
        },
        {
          name: "Data & MLOps",
          body: "Move models from prototypes to monitored production services.",
          tags: ["Data engineering", "ML & automation", "MLOps", "Governance"],
        },
        {
          name: "AI pipeline security",
          body: "AI pipelines are attack surfaces.",
          tags: ["Sensitive data pipelines", "Model poisoning", "AI Act · DORA · NIS2", "Resilience testing"],
        },
      ],
      more: "See AI & Sovereignty on www.xsom.fr",
      moreHref: `${MAIN_SITE_ORIGIN}/en/ai-sovereignty.html`,
      contact: "Discuss your project",
    },
    products: {
      kicker: "02 · AI products",
      title: "Our AI products.",
      lead: "A platform to govern a company’s AI, and the open-source engine that detects secrets in it.",
      fleet: {
        badge: "Platform · 2026 pilot programme",
        name: "xSOM Fleet",
        body: "The best AI models on the market, at enterprise security standards: steer your whole AI architecture from one place, subscriptions (Claude Code and Codex on every workstation), API keys and models hosted on your side.",
        modules: [
          ["Fleet Sièges", "FinOps solution: seats, actual invoice, estimated API equivalent."],
          ["Fleet Guard", "Cybersecurity solution: secrets blocked on the workstation, block log, evidence dossier."],
          ["Fleet Gateway", "AI architecture and strategy solution: gateway installed on the customer’s side, API budgets, models hosted on your side. Available for pilot."],
        ],
        action: "Discover xSOM Fleet",
      },
      guard: {
        badge: "Open source · Apache-2.0",
        name: "Secret Guard",
        body: "xSOM Fleet’s secret-detection engine, published as open source. It analyses text on the machine, with no network and no language model.",
        points: ["Explicit rules and an entropy check", "Local analysis, no network", "Open code, checkable by anyone"],
        action: "Discover Secret Guard",
        source: "Source code",
      },
    },
    glossary: {
      title: "Put a name to the risks.",
      body: "Prompt injection, secret leakage, poisoning… Each threat with its typical attack, its reference mitigation and open-source tools.",
      action: "Open the AI threat glossary",
    },
    contact: {
      title: "An AI project?",
      body: "Write us a few lines about your context: xSOM Consulting will reply.",
      button: "Write to xSOM",
      main: "xSOM Consulting",
    },
  },
} as const;
