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
      title: "La division IA de xSOM Consulting.",
      lead: "Des produits pour gérer l’IA en entreprise, et le conseil pour la mettre en production. Cabinet indépendant depuis 2007.",
      fleet: "Découvrir xSOM Fleet",
      contact: "Nous écrire",
    },
    products: {
      name: "Produits",
      title: "Nos produits.",
      fleet: {
        tag: "Plateforme · programme pilote 2026",
        name: "xSOM Fleet",
        line: "La gestion de l’IA d’entreprise : vos abonnements, vos clés API et vos modèles, gouvernés depuis une seule console.",
        modules: [
          { tag: "Sécurité", name: "Fleet Guard", detail: "Contrôle avant envoi sur chaque Poste, Politique signée, Dossier de preuves." },
          { tag: "FinOps", name: "Fleet Sièges", detail: "Sièges, Facture réelle, Équivalent API estimé." },
          { tag: "Stratégie", name: "Fleet Gateway", detail: "Passerelle installée chez vous, Budgets API. Disponible pour pilote." },
        ],
        action: "Découvrir xSOM Fleet",
      },
      guard: {
        tag: "Open source · Apache-2.0",
        name: "Secret Guard",
        line: "Le moteur de détection de secrets de xSOM Fleet. Il analyse le texte sur la machine, sans réseau ni modèle de langage.",
        points: ["Règles explicites et calcul d’entropie", "Analyse locale, sans réseau", "Code ouvert, vérifiable par tous"],
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
      title: "The AI division of xSOM Consulting.",
      lead: "Products to manage AI in the enterprise, and the consulting to take it to production. An independent firm since 2007.",
      fleet: "Discover xSOM Fleet",
      contact: "Write to us",
    },
    products: {
      name: "Products",
      title: "Our products.",
      fleet: {
        tag: "Platform · 2026 pilot programme",
        name: "xSOM Fleet",
        line: "Enterprise AI management: your subscriptions, API keys and models, governed from a single console.",
        modules: [
          { tag: "Security", name: "Fleet Guard", detail: "Pre-send check on every workstation, signed Policy, evidence dossier." },
          { tag: "FinOps", name: "Fleet Sièges", detail: "Seats, actual invoice, estimated API equivalent." },
          { tag: "Strategy", name: "Fleet Gateway", detail: "Gateway installed on your side, API budgets. Available for pilot." },
        ],
        action: "Discover xSOM Fleet",
      },
      guard: {
        tag: "Open source · Apache-2.0",
        name: "Secret Guard",
        line: "xSOM Fleet’s secret-detection engine. It analyses text on the machine, with no network and no language model.",
        points: ["Explicit rules and an entropy check", "Local analysis, no network", "Open code, checkable by anyone"],
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
