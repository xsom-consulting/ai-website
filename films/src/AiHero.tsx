import { AbsoluteFill } from "remotion";
import { Grade, Reel, type Shot } from "./kit";

export const AI_HERO_SECONDS = 16;
/** How long each shot dissolves into the next, and the tail into the head. */
const BLEND = 1;

/**
 * The background of ai.xsom.fr's cover: no words, the title is the page's own HTML. Two
 * sides of the division, alternated: the consulting (a business district at dusk, La
 * Défense) and the products (code on screen, the network they run on). Seamless: the
 * last second dissolves into the second that precedes the first frame, without push, so
 * the end lands exactly on the start.
 */
const HEAD: Shot = { clip: "20670675", at: 0, from: 22, focus: 0.55, exposure: 0.95, push: 0.05 };
export const AI_HERO_SHOTS: Shot[] = [
  HEAD,
  { clip: "34279721", at: 4, from: 0.6, focus: 0.55, exposure: 0.9, push: 0.07 },
  { clip: "35317702", at: 8, from: 5, focus: 0.62, exposure: 0.74, push: 0.05 },
  { clip: "1085656", at: 12, from: 3, focus: 0.5, exposure: 0.88, push: 0.06 },
  { ...HEAD, at: AI_HERO_SECONDS - BLEND, from: HEAD.from - BLEND, push: 0 },
];

export function AiHero() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050d1b" }}>
      <Reel shots={AI_HERO_SHOTS} seconds={AI_HERO_SECONDS} dissolve={BLEND} />
      <Grade grain={0.04} />
    </AbsoluteFill>
  );
}
