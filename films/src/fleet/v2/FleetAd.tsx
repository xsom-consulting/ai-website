import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, outExpo } from "../../kit";
import { CaptureImage, PAGE } from "../screen";
import CUES from "./ad-cues.json";
import { EUROPE_DOTS, PARIS } from "./europe";
import "../../titles.css";
import "./ad.css";

export const AD_SECONDS = CUES.seconds;
export const AD_FPS = 60;
export type AdLang = "fr" | "en";

const COPY = {
  fr: {
    labels: ["Poste", "Console", "Coûts", "Terminal", "UE", "Entreprise"],
    pills: ["modèle", "assistant", "API"],
    words: ["Toutes", "les meilleures", "IA."],
    poste: "Poste",
    nothing: "Rien ne sort.",
    stamp: "Politique signée",
    everywhere: ["Partout.", "Tout de suite."],
    counters: [
      { label: "Sièges", value: "23 636,00 $" },
      { label: "Facture réelle", value: "25 476,00 $" },
      { label: "Équivalent API estimé", value: "44 043,62 $", note: "estimation · Catalogue de prix du 2026-07-01" },
    ],
    period: "Coûts · Groupe · septembre 2026",
    control: "Chaque euro maîtrisé.",
    mention: "Démonstration · données illustratives",
    finale: ["Les meilleures IA", "pour toute votre entreprise."],
    secure: "La sécurité reste chez vous.",
  },
  en: {
    labels: ["Poste", "Console", "Costs", "Terminal", "EU", "Company"],
    pills: ["model", "assistant", "API"],
    words: ["All", "the best", "AI."],
    poste: "Poste",
    nothing: "Nothing leaves.",
    stamp: "Signed Policy",
    everywhere: ["Everywhere.", "Instantly."],
    counters: [
      { label: "Seats", value: "23 636,00 $" },
      { label: "Actual invoice", value: "25 476,00 $" },
      { label: "Estimated API equivalent", value: "44 043,62 $", note: "estimate · Price catalog of 2026-07-01" },
    ],
    period: "Costs · Group · September 2026",
    control: "Every euro under control.",
    mention: "Demonstration · illustrative data",
    finale: ["The best AI", "for your whole company."],
    secure: "Security stays with you.",
  },
} as const;

/* ---------------------------------------------------------------------------------------- */
/* Helpers                                                                                   */

const ramp = (t: number, from: number, span: number) => clamp((t - from) / span);
/** A seeded pseudo-random sequence, so every render draws the same shards and dots. */
function random(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
/** A decaying camera shake after an impact at `at`. */
function shake(t: number, at: number, amount: number, decay = 0.35) {
  const d = t - at;
  if (d < 0 || d > decay * 4) return { x: 0, y: 0 };
  const k = amount * Math.exp(-d / decay);
  return { x: Math.sin(d * 97) * k, y: Math.cos(d * 71) * k * 0.8 };
}
/** Keystroke times of the opening line, the very formula of scripts/ad-score.mjs. */
function keystrokes(text: string, from: number, to: number) {
  const n = [...text].length;
  return Array.from({ length: n }, (_, k) => from + (to - from) * Math.sqrt((k + 1) / n) ** 1.35);
}
/** A word or block that slams in: big and blurred, then sharp, on its beat. */
function Slam({ t, at, out, style, className, children }: { t: number; at: number; out?: number; style?: CSSProperties; className?: string; children: ReactNode }) {
  const p = outExpo(ramp(t, at, 0.22));
  const gone = out === undefined ? 0 : ramp(t, out, 0.18);
  if (p <= 0 || gone >= 1) return null;
  return (
    <div className={className} style={{ ...style, opacity: p * (1 - gone), transform: `${style?.transform ?? ""} scale(${1.55 - 0.55 * p + gone * 0.25})`, filter: `blur(${(1 - p) * 18 + gone * 14}px)` }}>
      {children}
    </div>
  );
}
function Flash({ t, at, color = "255,255,255", peak = 0.85, decay = 0.12 }: { t: number; at: number; color?: string; peak?: number; decay?: number }) {
  const d = t - at;
  if (d < -0.02 || d > decay * 3) return null;
  const o = d < 0 ? peak * (1 + d / 0.02) : peak * Math.exp(-d / decay);
  return <AbsoluteFill style={{ background: `rgb(${color})`, opacity: o, mixBlendMode: "screen" }} />;
}
function Mention({ text, style }: { text: string; style?: CSSProperties }) {
  return (
    <div className="ad-mention" style={style}>
      {text}
    </div>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* 0–2 s : a line of code typed very fast                                                   */

function Typing({ t, lang }: { t: number; lang: AdLang }) {
  const text = CUES.typing.text[lang];
  const times = keystrokes(text, CUES.typing.from, CUES.typing.to);
  const count = times.filter((at) => at <= t).length;
  const chars = [...text];
  // Colours: keyword, identifier, call.
  const colour = (i: number) => {
    const before = chars.slice(0, i).join("");
    if (before.length < 5) return "#7cc0ff";
    if (before.includes("=") && /[A-Za-z]/.test(chars[i])) return "#ffd27a";
    if ("();=".includes(chars[i])) return "#6f86a6";
    return "#e8f0fb";
  };
  const end = CUES.typing.to;
  const dive = ramp(t, end + 0.05, CUES.impact - end - 0.05);
  const scale = 1 + 0.08 * ramp(t, 0, end) + dive ** 3 * 5;
  const blink = t > end || Math.floor(t * 4) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, #08152a, #01040b 75%)" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${scale})`, filter: `blur(${dive ** 2 * 10}px)`, transformOrigin: "62% 50%" }}>
        <div className="ad-code">
          <span className="ad-prompt">›</span>
          {chars.slice(0, count).map((c, i) => (
            <span key={i} style={{ color: colour(i) }}>
              {c}
            </span>
          ))}
          <span className="ad-caret" style={{ opacity: blink ? 1 : 0 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* 2–5 s : a burst of half-second plans                                                      */

function Punch({ t, at, children, from = 1 }: { t: number; at: number; children: ReactNode; from?: number }) {
  const p = outExpo(ramp(t, at, 0.3));
  const blur = (1 - ramp(t, at, 0.09)) * 16;
  const drift = (t - at) * 0.06;
  return (
    <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 120 * from}px) scale(${1.22 - 0.2 * p + drift})`, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>
  );
}
function Footage({ clip, from, exposure = 0.8 }: { clip: string; from: number; exposure?: number }) {
  return (
    <OffthreadVideo
      src={staticFile(`footage/${clip}.mp4`)}
      trimBefore={Math.round(from * AD_FPS)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${exposure}) contrast(1.12) saturate(0.7) hue-rotate(-8deg)` }}
    />
  );
}
function Label({ t, at, n, text }: { t: number; at: number; n: number; text: string }) {
  const p = outExpo(ramp(t, at + 0.04, 0.2));
  return (
    <div className="ad-label" style={{ opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <b>{String(n).padStart(2, "0")}</b>
      {text}
    </div>
  );
}
function ConsolePlan({ lang }: { lang: AdLang }) {
  const scale = 1180 / PAGE.width;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, #0f2747, #030a16 75%)", perspective: 2000 }}>
      <div className="ad-window" style={{ transform: "rotateY(-18deg) rotateX(8deg) translateZ(0)" }}>
        <div className="ad-window-bar">
          <i />
          <i />
          <i />
        </div>
        <div style={{ transformOrigin: "0 0", transform: `scale(${scale})` }}>
          <CaptureImage capture={{ src: `screens/${lang}/coverage.png`, width: 1600, height: 1000 }} />
        </div>
      </div>
      <Mention text={COPY[lang].mention} style={{ left: 1110, top: 300 }} />
    </AbsoluteFill>
  );
}
function CostChart({ t, at }: { t: number; at: number }) {
  const bars = [0.42, 0.55, 0.48, 0.66, 0.6, 0.74, 0.7, 0.82, 0.78, 0.9];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 60%, #0d2340, #02070f 75%)" }}>
      <svg width={1920} height={1080}>
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={360} x2={1560} y1={820 - k * 140} y2={820 - k * 140} stroke="rgba(124,192,255,.12)" strokeWidth={2} />
        ))}
        {bars.map((h, i) => {
          const g = outExpo(ramp(t, at + i * 0.025, 0.3));
          const height = 470 * h * g;
          return <rect key={i} x={390 + i * 116} y={820 - height} width={70} height={height} rx={8} fill={i === bars.length - 1 ? "#7cc0ff" : "rgba(124,192,255,.45)"} />;
        })}
        <polyline
          points={bars.map((h, i) => `${425 + i * 116},${820 - 470 * h * 0.62 * outExpo(ramp(t, at + 0.1, 0.3))}`).join(" ")}
          fill="none"
          stroke="#ffd27a"
          strokeWidth={6}
          strokeDasharray="14 12"
        />
      </svg>
    </AbsoluteFill>
  );
}
const CODE = [
  "export async function invoice(month: string) {",
  "  const seats = await seatsOf(group, month);",
  "  const usage = await usageOf(group, month);",
  "  return totals(seats, usage.estimate);",
  "}",
  "test('rounds once per line', () => {",
  "  expect(round(lines)).toEqual(total);",
  "});",
  "const retries = backoff({ base: 30, max: 1800 });",
  "for (const poste of postes) report(poste.state);",
  "if (!policy.verified) return refuse('signature');",
  "deploy({ region: 'eu', replicas: 2 });",
];
function Terminal({ t, at }: { t: number; at: number }) {
  const scroll = (t - at) * 520;
  return (
    <AbsoluteFill style={{ background: "#050b16" }}>
      <div className="ad-terminal" style={{ transform: `translateY(${-scroll}px) rotate(-4deg)` }}>
        {[...CODE, ...CODE, ...CODE].map((line, i) => (
          <div key={i} style={{ color: i % 5 === 0 ? "#7cc0ff" : i % 3 === 0 ? "#ffd27a" : "#c7d6ea", opacity: 0.35 + 0.65 * ((i * 7) % 5) / 4 }}>
            {line}
          </div>
        ))}
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #050b16, transparent 28%, transparent 72%, #050b16)" }} />
    </AbsoluteFill>
  );
}
function EuropeMap({ t, at }: { t: number; at: number }) {
  const d = t - at;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, #0b1f3a, #02060f 75%)" }}>
      <svg width={1920} height={1080}>
        {EUROPE_DOTS.map((p, i) => {
          const dist = Math.hypot(p.x - PARIS.x, p.y - PARIS.y);
          const lit = clamp(1 - Math.abs(dist - d * 1500) / 140);
          return <circle key={i} cx={p.x} cy={p.y} r={5.2} fill={lit > 0.05 ? `rgba(124,192,255,${0.45 + 0.55 * lit})` : "rgba(124,192,255,.38)"} />;
        })}
        {[0, 0.18].map((delay) => {
          const k = ((d + delay) % 0.4) / 0.4;
          return <circle key={delay} cx={PARIS.x} cy={PARIS.y} r={10 + 60 * k} fill="none" stroke="#ffd27a" strokeWidth={4} opacity={1 - k} />;
        })}
        <circle cx={PARIS.x} cy={PARIS.y} r={12} fill="#ffd27a" />
      </svg>
    </AbsoluteFill>
  );
}

function Burst({ t, lang }: { t: number; lang: AdLang }) {
  const [a, b, c, d, e, f] = CUES.burst;
  const labels = COPY[lang].labels;
  const plan = (at: number, i: number, node: ReactNode, from = 1) => {
    const next = CUES.burst[i + 1] ?? CUES.magnet;
    if (t < at || t >= next) return null;
    return (
      <AbsoluteFill key={i}>
        <Punch t={t} at={at} from={from}>
          {node}
        </Punch>
        <Label t={t} at={at} n={i + 1} text={labels[i]} />
      </AbsoluteFill>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#02060f" }}>
      <Sequence from={Math.round(a * AD_FPS)} durationInFrames={Math.round((b - a) * AD_FPS)} layout="none">
        {t >= a && t < b ? plan(a, 0, <Footage clip="13522186" from={1.4} exposure={0.85} />) : null}
      </Sequence>
      {plan(b, 1, <ConsolePlan lang={lang} />, -1)}
      {plan(c, 2, <CostChart t={t} at={c} />)}
      {plan(d, 3, <Terminal t={t} at={d} />, -1)}
      {plan(e, 4, <EuropeMap t={t} at={e} />)}
      <Sequence from={Math.round(f * AD_FPS)} durationInFrames={Math.round((CUES.magnet - f) * AD_FPS)} layout="none">
        {t >= f && t < CUES.magnet ? plan(f, 5, <Footage clip="35317702" from={2.4} exposure={0.7} />, -1) : null}
      </Sequence>
      {CUES.burst.map((at) => (
        <Flash key={at} t={t} at={at} peak={at === a ? 0.9 : 0.35} decay={0.06} />
      ))}
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* 5–8 s : models, assistants and APIs snap onto every Poste                                 */

const GRID = { cols: 22, rows: 9, cell: 74 };
function PosteGrid({ t, lit }: { t: number; lit: (x: number, y: number) => number }) {
  return (
    <div className="ad-grid" style={{ width: GRID.cols * GRID.cell, height: GRID.rows * GRID.cell, transform: `rotateX(58deg) translateY(${-t * 8}px)` }}>
      {Array.from({ length: GRID.cols * GRID.rows }, (_, i) => {
        const col = i % GRID.cols;
        const row = Math.floor(i / GRID.cols);
        const on = lit(col / (GRID.cols - 1), row / (GRID.rows - 1));
        return (
          <div
            key={i}
            className="ad-poste"
            style={{
              left: col * GRID.cell,
              top: row * GRID.cell,
              background: `rgba(150,208,255,${0.07 + 0.78 * on})`,
              borderColor: `rgba(124,192,255,${0.25 + 0.75 * on})`,
              boxShadow: on > 0.3 ? `0 0 ${30 * on}px rgba(124,192,255,${0.8 * on})` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
function Magnet({ t, lang }: { t: number; lang: AdLang }) {
  const copy = COPY[lang];
  const land = CUES.pills.map((at) => at + CUES.pillFlight);
  const targets = [
    { x: 560, y: 330, from: { x: -500, y: -200 } },
    { x: 960, y: 300, from: { x: 0, y: -600 } },
    { x: 1360, y: 330, from: { x: 500, y: -200 } },
  ];
  // Each landing lights the grid from its own column outwards.
  const lit = (x: number, y: number) =>
    Math.max(
      ...land.map((at, k) => {
        const d = t - at;
        if (d < 0) return 0;
        const centre = [0.22, 0.5, 0.78][k];
        const dist = Math.hypot(x - centre, (1 - y) * 0.6);
        return clamp((d * 1.6 - dist) * 4) * (0.55 + 0.45 * Math.exp(-Math.max(0, d * 1.6 - dist) * 2));
      }),
    );
  const exit = ramp(t, 7.88, 0.12);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 70%, #0c2140, #02060f 72%)", transform: `scale(${1 + exit ** 2 * 1.6})`, filter: `blur(${exit * 14}px)` }}>
      <div className="ad-grid-wrap">
        <PosteGrid t={t - CUES.magnet} lit={lit} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {targets.map((p, k) => {
          const d = t - land[k];
          if (d < 0) return null;
          const len = outExpo(clamp(d / 0.35));
          return [-260, -130, 0, 130, 260].map((dx) => (
            <line key={`${k}${dx}`} x1={p.x} y1={p.y + 40} x2={p.x + dx * len} y2={p.y + 40 + 330 * len} stroke="rgba(124,192,255,.55)" strokeWidth={3} strokeDasharray="6 10" />
          ));
        })}
      </svg>
      {targets.map((p, k) => {
        const at = CUES.pills[k];
        const fly = clamp((t - at) / CUES.pillFlight);
        if (fly <= 0) return null;
        const e = fly < 1 ? fly ** 2.6 : 1; // accelerates into the magnet
        const settle = t > land[k] ? Math.exp(-(t - land[k]) / 0.08) * Math.sin((t - land[k]) * 60) * 0.12 : 0;
        const x = p.x + p.from.x * (1 - e);
        const y = p.y + p.from.y * (1 - e);
        const ring = t > land[k] ? clamp((t - land[k]) / 0.4) : 0;
        return (
          <div key={k}>
            {ring > 0 && ring < 1 && <div className="ad-ring" style={{ left: p.x - 140 * ring - 20, top: p.y - 80 * ring - 10, width: 280 * ring + 40, height: 160 * ring + 20, opacity: 1 - ring }} />}
            <div className="ad-pill" style={{ left: x, top: y, transform: `translate(-50%, -50%) scale(${(0.6 + 0.4 * e) * (1 + settle)})`, filter: `blur(${(1 - e) * 10}px)` }}>
              {copy.pills[k]}
            </div>
          </div>
        );
      })}
      <div className="ad-words-shade" style={{ opacity: ramp(t, CUES.words[0] - 0.1, 0.3) }} />
      <div className="ad-words">
        {copy.words.map((w, k) => (
          <Slam key={k} t={t} at={CUES.words[k]} className={`ad-word${k === 2 ? " ad-accent" : ""}`}>
            {w}
          </Slam>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* 8–11 s : a key rushes out and breaks on the Poste                                         */

const SHARDS = (() => {
  const r = random(11);
  return Array.from({ length: 44 }, () => {
    const angle = Math.PI * (1.05 + r() * 0.9); // mostly back and up, away from the line
    const speed = 500 + r() * 1300;
    return {
      vx: Math.cos(angle) * speed * (r() > 0.5 ? 1 : -1),
      vy: Math.sin(angle) * speed,
      spin: (r() - 0.5) * 1400,
      size: 14 + r() * 46,
      shape: `polygon(${r() * 40}% 0%, 100% ${r() * 50}%, ${60 + r() * 40}% 100%, 0% ${50 + r() * 50}%)`,
      hue: r() > 0.35 ? "#ff4263" : "#ffd27a",
    };
  });
})();
function Shatter({ t, lang }: { t: number; lang: AdLang }) {
  const copy = COPY[lang];
  const { from, hit } = CUES.key;
  const fly = clamp((t - from) / (hit - from));
  const e = fly ** 3; // rushing forwards
  const s = shake(t, hit, 26);
  const flare = t >= hit ? Math.exp(-(t - hit) / 0.35) : 0;
  const lineY = 600;
  const keyPos = { x: 960 + (1 - e) * 380, y: lineY - 60 - (1 - e) * 380, scale: 0.2 + 1.0 * e };
  const exit = ramp(t, 10.82, 0.18);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 55%, #0a1a33, #01040b 75%)", transform: `translate(${s.x}px, ${s.y}px) scale(${1 + Math.max(0, t - hit) * 0.035 + exit * 0.4})`, opacity: 1 - exit, filter: `blur(${exit * 10}px)` }}>
      {/* the Poste: a line of light */}
      <div className="ad-line" style={{ top: lineY, boxShadow: `0 0 ${30 + 120 * flare}px ${6 + 30 * flare}px rgba(124,192,255,${0.45 + 0.5 * flare})`, height: 6 + 6 * flare }} />
      <div className="ad-line-label" style={{ top: lineY + 26 }}>
        {copy.poste}
      </div>
      {t < hit &&
        [0.06, 0.03, 0].map((lag, k) => {
          const f = clamp((t - lag - from) / (hit - from)) ** 3;
          return (
            <div
              key={k}
              className="ad-key"
              style={{
                left: 960 + (1 - f) * 380,
                top: lineY - 60 - (1 - f) * 380,
                opacity: k === 2 ? 1 : 0.25,
                transform: `translate(-50%, -50%) scale(${0.2 + 1.0 * f}) rotate(${(1 - f) * -18}deg)`,
                filter: `blur(${k === 2 ? (1 - fly) * 4 : 8}px)`,
              }}
            >
              <svg width={44} height={44} viewBox="0 0 24 24" style={{ marginRight: 18 }}>
                <circle cx={8} cy={12} r={5} fill="none" stroke="#ff8ca0" strokeWidth={2.4} />
                <path d="M13 12 H22 M19 12 V16 M22 12 V15" stroke="#ff8ca0" strokeWidth={2.4} fill="none" />
              </svg>
              AKIA••••
            </div>
          );
        })}
      {t >= hit &&
        SHARDS.map((sh, i) => {
          const d = t - hit;
          const x = keyPos.x + sh.vx * d;
          const y = keyPos.y + sh.vy * d + 900 * d * d;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: sh.size,
                height: sh.size,
                background: sh.hue,
                clipPath: sh.shape,
                opacity: clamp(1 - d / 1.1),
                transform: `rotate(${sh.spin * d}deg)`,
                filter: `blur(${clamp(1 - d / 0.15) * 3}px)`,
              }}
            />
          );
        })}
      <Flash t={t} at={hit} color="255,235,240" peak={0.6} decay={0.05} />
      <div className="ad-center" style={{ top: 690 }}>
        <Slam t={t} at={CUES.nothing} className="ad-title">
          {copy.nothing}
        </Slam>
      </div>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* 11–14 s : the signed Policy stamps the centre, a wave crosses thousands of Postes         */

const FIELD = (() => {
  const dots: { x: number; y: number }[] = [];
  for (let y = 70; y < 1040; y += 26) for (let x = 40; x < 1900; x += 26) dots.push({ x, y });
  return dots;
})();
function Stamp({ t, lang }: { t: number; lang: AdLang }) {
  const copy = COPY[lang];
  const { from, hit } = CUES.stamp;
  const fall = clamp((t - from) / (hit - from));
  const e = fall ** 2.4;
  const squash = t >= hit ? 1 - 0.07 * Math.exp(-(t - hit) / 0.05) * Math.cos((t - hit) * 50) : 1;
  const s = shake(t, hit, 30, 0.25);
  const centre = { x: 960, y: 470 };
  const wave = t >= hit ? (t - hit) * 1500 : -1;
  const echo = t >= hit + 0.375 ? (t - hit - 0.375) * 1500 : -1;
  const exit = ramp(t, 13.84, 0.16);
  // The stamp glows on every beat after it lands.
  const beat = t >= hit + 0.5 ? Math.exp(-(((t - hit) % 0.5) / 0.09)) : 0;
  return (
    <AbsoluteFill style={{ background: "#02060f", transform: `translate(${s.x}px, ${s.y}px) scale(${1 + Math.max(0, t - hit) * 0.03})`, opacity: 1 - exit }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {FIELD.map((p, i) => {
          const d = Math.hypot(p.x - centre.x, p.y - centre.y);
          const front = wave > 0 ? clamp(1 - Math.abs(d - wave) / 90) : 0;
          const front2 = echo > 0 ? clamp(1 - Math.abs(d - echo) / 70) * 0.6 : 0;
          const after = wave > d ? 0.45 : 0;
          const v = Math.max(front, front2, after);
          return <circle key={i} cx={p.x} cy={p.y} r={3.2 + 3 * Math.max(front, front2)} fill={v > 0 ? `rgba(124,192,255,${0.15 + 0.85 * v})` : "rgba(124,192,255,.12)"} />;
        })}
      </svg>
      {wave > 0 && wave < 2400 && <div className="ad-wave" style={{ left: centre.x - wave, top: centre.y - wave, width: wave * 2, height: wave * 2, opacity: clamp(1 - wave / 2000) }} />}
      {fall > 0 && (
        <div
          className="ad-stamp"
          style={{
            left: centre.x,
            top: centre.y,
            opacity: clamp(fall * 3),
            transform: `translate(-50%, -50%) scale(${(3.2 - 2.2 * e) * squash}) rotate(${-14 + 8 * e}deg)`,
            filter: `blur(${(1 - e) * 12}px)`,
            boxShadow: `0 0 ${80 + 90 * beat}px rgba(124,192,255,${0.45 + 0.4 * beat})`,
          }}
        >
          <svg width={92} height={92} viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={10.5} fill="none" stroke="#7cc0ff" strokeWidth={1.8} />
            <path d="M7 12.5 L10.5 16 L17.5 8.5" fill="none" stroke="#7cc0ff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{copy.stamp}</span>
        </div>
      )}
      <Flash t={t} at={hit} color="170,215,255" peak={0.5} decay={0.1} />
      <div className="ad-center" style={{ top: 690, display: "flex", gap: 40, justifyContent: "center" }}>
        <Slam t={t} at={CUES.everywhere[0]} className="ad-title">
          {copy.everywhere[0]}
        </Slam>
        <Slam t={t} at={CUES.everywhere[1]} className="ad-title ad-accent">
          {copy.everywhere[1]}
        </Slam>
      </div>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* 14–17 s : the console's counters roll and land                                            */

function Rolling({ t, from, land, value }: { t: number; from: number; land: number; value: string }) {
  const p = clamp((t - from) / (land - from));
  const chars = [...value];
  const digits = chars.filter((c) => /\d/.test(c)).length;
  let seen = 0;
  return (
    <span className="ad-roll">
      {chars.map((c, i) => {
        if (!/\d/.test(c)) return <span key={i}>{c}</span>;
        const k = seen++;
        const target = Number(c);
        // Digits further right spin more; each lands with an ease-out.
        const turns = 2 + (digits - k);
        const pos = target + 10 * turns * (1 - outExpo(p));
        const offset = pos % 10;
        return (
          <span key={i} className="ad-digit">
            <span style={{ transform: `translateY(${-offset * 1}em)` }}>
              {Array.from({ length: 11 }, (_, n) => (
                <span key={n}>{n % 10}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
function Counters({ t, lang }: { t: number; lang: AdLang }) {
  const copy = COPY[lang];
  const { from, lands } = CUES.counters;
  const enterP = outExpo(ramp(t, from, 0.35));
  const exit = ramp(t, 16.85, 0.15);
  return (
    <AbsoluteFill style={{ background: "#030914", opacity: 1 - exit }}>
      <div style={{ position: "absolute", inset: -40, transform: `scale(${1.06 + (t - from) * 0.02})`, filter: "blur(16px) brightness(.32) saturate(.6)" }}>
        <CaptureImage capture={{ src: `screens/${lang}/costs-group.png`, width: 1600, height: 1000 }} style={{ width: 2000, height: 1250 }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(3,9,20,.3), rgba(3,9,20,.85))" }} />
      <div className="ad-counters-head" style={{ opacity: enterP }}>
        <span>{copy.period}</span>
        <Mention text={copy.mention} style={{ position: "static" }} />
      </div>
      <div className="ad-counters">
        {copy.counters.map((c, k) => {
          const p = outExpo(ramp(t, from + k * 0.12, 0.35));
          const landed = t >= lands[k];
          const pop = landed ? 1 + 0.08 * Math.exp(-(t - lands[k]) / 0.08) : 1;
          return (
            <div key={k} className={`ad-card${k === 2 ? " ad-card--estimate" : ""}`} style={{ opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${pop})` }}>
              <div className="ad-card-label">{c.label}</div>
              <div className="ad-card-value">
                <Rolling t={t} from={from} land={lands[k]} value={c.value} />
              </div>
              {"note" in c && <div className="ad-card-note">{c.note}</div>}
            </div>
          );
        })}
      </div>
      <div className="ad-center" style={{ top: 735 }}>
        <Slam t={t} at={CUES.control} className="ad-title">
          {copy.control}
        </Slam>
      </div>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* 18–20 s : the promise and the logo                                                        */

function Finale({ t, lang }: { t: number; lang: AdLang }) {
  const copy = COPY[lang];
  const at = CUES.finale;
  const word = (text: string, start: number, className: string) => (
    <div className={className}>
      {text.split(" ").map((w, i) => {
        const p = outExpo(ramp(t, start + i * 0.045, 0.3));
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
  const logo = outExpo(ramp(t, CUES.logo, 0.4));
  const fade = ramp(t, CUES.fadeOut, AD_SECONDS - CUES.fadeOut);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, #0d2340, #02060f 72%)", opacity: 1 - fade }}>
      <div className="ad-finale">
        {word(copy.finale[0], at, "ad-final-line")}
        {word(copy.finale[1], at + 0.12, "ad-final-line")}
        {word(copy.secure, at + 0.4, "ad-final-line ad-accent")}
        <div className="ad-logo" style={{ opacity: logo, transform: `scale(${0.9 + 0.1 * logo})` }}>
          <Img src={staticFile("brand/mark.svg")} style={{ width: 96, height: 96, transform: `rotate(${(1 - logo) * -50}deg)` }} />
          <span>
            xSOM <em>Fleet</em>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------------------------------- */

export function FleetAd({ lang }: { lang: AdLang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const [mute0, mute1] = CUES.silence;
  return (
    <AbsoluteFill className="film fleet ad" style={{ background: "#01040b" }}>
      {t < CUES.impact && <Typing t={t} lang={lang} />}
      {t >= CUES.impact && t < CUES.magnet && <Burst t={t} lang={lang} />}
      {t >= CUES.magnet && t < CUES.key.from && <Magnet t={t} lang={lang} />}
      {t >= CUES.key.from && t < CUES.stamp.from && <Shatter t={t} lang={lang} />}
      {t >= CUES.stamp.from && t < CUES.counters.from && <Stamp t={t} lang={lang} />}
      {t >= CUES.counters.from && t < mute0 && <Counters t={t} lang={lang} />}
      {t >= mute1 && <Finale t={t} lang={lang} />}
      <Flash t={t} at={CUES.impact} peak={0.9} decay={0.07} />
      <Audio src={staticFile(`score/fleet-ad-${lang}.wav`)} />
    </AbsoluteFill>
  );
}
