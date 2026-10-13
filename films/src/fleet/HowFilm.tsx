import { AbsoluteFill } from "remotion";
import { Probe } from "./kit";
import { ScreenTour, type TourPage } from "./screen-tour";
import "../titles.css";
import "./fleet.css";
import "./site.css";

export const HOW_SECONDS = 10;
export const HOW_TOPICS = ["orgs", "policy", "coverage", "costs"] as const;
export type HowTopic = (typeof HOW_TOPICS)[number];
export type HowLang = "fr" | "en";

const MENTION = { fr: "Démonstration · données illustratives", en: "Demonstration · illustrative data" } as const;

/** Captures are 1600 × 1000 CSS pixels (3200 × 2000 PNG); full pages are taller. */
const VIEWPORT = { width: 1600, height: 1000 };

/**
 * The plans of each film. Focus boxes are read on the French captures; the English ones
 * (interface translated, data still in French) share their layout within a few pixels.
 * Every film starts and ends on the same overview, so it loops without a cut.
 */
function tours(lang: HowLang): Record<HowTopic, TourPage[]> {
  const fr = lang === "fr";
  const screen = (name: string) => `screens/${lang}/${name}.png`;
  const orgs: TourPage = { src: screen("provider-orgs"), ...VIEWPORT, path: "/organisations-fournisseur", steps: [] };
  const costsGroup: TourPage = { src: screen("costs-group"), ...VIEWPORT, path: "/couts", steps: [] };
  const policy: TourPage = { src: screen("policy-preview-full"), width: 1600, height: 2404, path: "/politique", steps: [] };
  const coverage: TourPage = { src: screen("coverage-full"), width: 1600, height: fr ? 1644 : 1503, path: "/couverture", steps: [] };
  return {
    orgs: [
      {
        ...orgs,
        steps: [
          { at: 0 },
          { at: 0.9, focus: { x: 24, y: 278, w: 560, h: 320 }, callout: fr ? "Plusieurs Organisations fournisseur" : "Several provider organizations" },
          { at: 3.5, focus: { x: 1322, y: 278, w: 260, h: 320 }, callout: fr ? "150/150 : le Plafond de Sièges est atteint" : "150/150: the seat cap is reached" },
        ],
      },
      {
        src: screen("developer-detail"),
        ...VIEWPORT,
        path: "/developpeurs/dev-001",
        steps: [{ at: 6.0 }, { at: 6.3, focus: { x: 24, y: 500, w: 1100, h: 124 }, zoom: 1.45, callout: fr ? "Chaque Siège de chaque Développeur" : "Every Seat of every developer" }],
      },
      { ...orgs, steps: [{ at: 8.8 }] },
    ],
    policy: [
      {
        ...policy,
        steps: [
          { at: 0 },
          { at: 0.9, focus: { x: 20, y: 216, w: 834, h: 72 }, zoom: 1.6, callout: fr ? "Une Politique signée, versionnée" : "A signed, versioned Policy" },
          { at: 3.6, focus: { x: 30, y: 2050, w: 560, h: 200 }, callout: fr ? "Avant publication : les Postes en retard" : "Before publishing: the Postes behind" },
          { at: 6.2, focus: { x: 44, y: 2262, w: 180, h: 52 }, zoom: 2.2, callout: fr ? "Publiée vers chaque Poste" : "Published to every Poste" },
          { at: 8.7 },
        ],
      },
    ],
    coverage: [
      {
        ...coverage,
        steps: [
          { at: 0 },
          { at: 0.9, focus: { x: 24, y: 360, w: 880, h: 82 }, zoom: 1.75, callout: fr ? "Chaque Poste : sain, dégradé, en échec" : "Every Poste: healthy, degraded, failing" },
          { at: 3.5, focus: { x: 24, y: 440, w: 880, h: 250 }, zoom: 1.6, callout: fr ? "Par Équipe" : "By team" },
          { at: 6.0, focus: { x: 640, y: 945, w: 420, h: 290 }, callout: fr ? "Chaque écart, avec son Motif" : "Every Poste out of line, with its Motif" },
          { at: 8.7 },
        ],
      },
    ],
    costs: [
      {
        ...costsGroup,
        steps: [
          { at: 0 },
          { at: 0.9, focus: { x: 186, y: 452, w: 522, h: 214 }, callout: fr ? "Facture réelle : Sièges et Dépassements" : "Actual invoice: Seats and overages" },
          { at: 3.6, focus: { x: 712, y: 452, w: 520, h: 214 }, callout: fr ? "À part : l’Équivalent API, une estimation" : "Separately: the API equivalent, an estimate" },
        ],
      },
      {
        src: screen("costs-developer"),
        ...VIEWPORT,
        path: "/couts",
        steps: [{ at: 6.2 }, { at: 6.5, focus: { x: 24, y: 370, w: 640, h: 80 }, callout: fr ? "Par Développeur, Équipe ou Groupe" : "By developer, team or group" }],
      },
      { ...costsGroup, steps: [{ at: 8.8 }] },
    ],
  };
}

/** A silent "how it works" loop: one console page or more, walked through plan by plan. */
export function HowFilm({ topic, lang }: { topic: HowTopic; lang: HowLang }) {
  return (
    <AbsoluteFill className="film fleet site">
      <div className="backdrop" />
      <ScreenTour pages={tours(lang)[topic]} mention={MENTION[lang]} />
      <Probe />
    </AbsoluteFill>
  );
}
