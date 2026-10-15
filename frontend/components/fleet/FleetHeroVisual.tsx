import type { CSSProperties } from "react";

type Labels = { label: string; poste: string; prompt: string; blocked: string; seal: string };

const COLS = 4;
const ROWS = 5;
const TILE = { w: 50, h: 34, gapX: 12, gapY: 12, x0: 362, y0: 34 };
const SEAL = { x: 478, y: 330, r: 30 };
/** Vitesse de l'onde du cachet, en unités du dessin par seconde : sert au retard de chaque Poste. */
const WAVE_SPEED = 160;

const tiles = Array.from({ length: COLS * ROWS }, (_, index) => {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const x = TILE.x0 + col * (TILE.w + TILE.gapX);
  const y = TILE.y0 + row * (TILE.h + TILE.gapY);
  const distance = Math.hypot(x + TILE.w / 2 - SEAL.x, y + TILE.h / 2 - SEAL.y);
  return { index, x, y, on: `${(row * COLS + col) * 0.06}s`, wave: `${(distance / WAVE_SPEED).toFixed(2)}s` };
});

/** Les éclats du prompt : position de départ dans la carte, puis déplacement et rotation. */
const SHARDS = [
  { x: 196, y: 140, w: 30, h: 22, dx: -38, dy: -54, r: -32 },
  { x: 232, y: 138, w: 24, h: 26, dx: 6, dy: -70, r: 24 },
  { x: 262, y: 142, w: 28, h: 20, dx: 30, dy: -46, r: 48 },
  { x: 290, y: 150, w: 22, h: 26, dx: 18, dy: 8, r: -20 },
  { x: 204, y: 170, w: 26, h: 24, dx: -52, dy: 44, r: 36 },
  { x: 238, y: 174, w: 30, h: 20, dx: -8, dy: 62, r: -40 },
  { x: 272, y: 172, w: 24, h: 24, dx: 24, dy: 50, r: 62 },
] as const;

const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * L'illustration du haut de page, en SVG animé par la feuille de style (`fleet.css`) :
 * la grille des Postes s'allume, un prompt qui porte une clé masquée se brise sur la
 * ligne du Poste, puis le cachet « Politique signée » se propage de Poste en Poste.
 * Sans mouvement (`data-motion` absent), le dessin montre directement l'état final.
 * C'est une illustration : aucune donnée, aucune vraie clé.
 */
export function FleetHeroVisual({ labels }: { labels: Labels }) {
  return (
    <figure className="fl-visual" aria-label={labels.label} role="img">
      <svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="fl-line" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.5" stopColor="currentColor" stopOpacity="1" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="fl-seal-glow">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="fl-visual__tiles">
          {tiles.map((tile) => (
            <g key={tile.index} className="fl-visual__tile" style={vars({ "--on": tile.on, "--wave": tile.wave })}>
              <rect x={tile.x} y={tile.y} width={TILE.w} height={TILE.h} rx="6" />
              <path className="fl-visual__check" d={`M${tile.x + 18} ${tile.y + 17} l5 5 l10 -10`} />
              <line x1={tile.x + 17} x2={tile.x + 33} y1={tile.y + TILE.h + 5} y2={tile.y + TILE.h + 5} />
            </g>
          ))}
        </g>

        <g className="fl-visual__poste">
          <rect className="fl-visual__line" x="328" y="20" width="4" height="380" rx="2" fill="url(#fl-line)" />
          <text x="330" y="14" textAnchor="middle">{labels.poste}</text>
        </g>

        <g className="fl-visual__prompt">
          <rect x="24" y="134" width="292" height="66" rx="12" />
          <text className="fl-visual__prompt-label" x="44" y="157">{labels.prompt}</text>
          <text className="fl-visual__prompt-text" x="44" y="185">deploy --key AKIA••••••••</text>
        </g>

        <g className="fl-visual__shards">
          {SHARDS.map((shard, index) => (
            <rect
              key={index}
              x={shard.x}
              y={shard.y}
              width={shard.w}
              height={shard.h}
              rx="3"
              style={vars({ "--dx": `${shard.dx}px`, "--dy": `${shard.dy}px`, "--r": `${shard.r}deg` })}
            />
          ))}
        </g>

        <g className="fl-visual__blocked">
          <rect x="52" y="292" width="236" height="38" rx="19" />
          <circle cx="76" cy="311" r="7" />
          <path d="M72 307 l8 8 M80 307 l-8 8" />
          <text x="92" y="316">{labels.blocked}</text>
        </g>

        <g className="fl-visual__seal">
          <circle className="fl-visual__ring" cx={SEAL.x} cy={SEAL.y} r={SEAL.r} />
          <circle className="fl-visual__ring" cx={SEAL.x} cy={SEAL.y} r={SEAL.r} />
          <circle className="fl-visual__ring" cx={SEAL.x} cy={SEAL.y} r={SEAL.r} />
          <g className="fl-visual__stamp">
            <circle cx={SEAL.x} cy={SEAL.y} r={SEAL.r * 2} fill="url(#fl-seal-glow)" />
            <circle className="fl-visual__stamp-disc" cx={SEAL.x} cy={SEAL.y} r={SEAL.r} />
            <circle className="fl-visual__stamp-edge" cx={SEAL.x} cy={SEAL.y} r={SEAL.r - 6} />
            <path className="fl-visual__stamp-check" d={`M${SEAL.x - 11} ${SEAL.y + 1} l7 7 l15 -16`} />
            <text x={SEAL.x} y={SEAL.y + SEAL.r + 28} textAnchor="middle">{labels.seal}</text>
          </g>
        </g>
      </svg>
    </figure>
  );
}
