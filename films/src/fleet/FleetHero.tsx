import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Flash, Grade, Line, Reel, clamp, useTime, type Shot } from "../kit";
import { Mesh } from "../overlays";
import { Probe, Seats, Shade, Slam } from "./kit";
import { BrowserChrome, CaptureImage, PAGE } from "./screen";
import "../titles.css";
import "./fleet.css";
import "./site.css";

export const FLEET_HERO_SECONDS = 16;
/** The last stretch, where the opening shot dissolves back in: the loop's seam. */
const SEAM = 0.9;

/**
 * Four beats: the developers and their assistant; the uncapped API bill, then the seat cap;
 * xSOM Fleet; its console. The opening shot comes back over the last 0.9 s, playing into the
 * very frame the film starts on, so the loop has no visible cut.
 */
export const HERO_SHOTS: Shot[] = [
  { clip: "13522186", at: 0, from: 1.2, exposure: 1.05, push: 0.05 },
  { clip: "34268861", at: 3.8, from: 4, exposure: 1.15, push: 0.08 },
  { clip: "5483080", at: 5.9, from: 0.5, exposure: 0.62, push: 0.04 },
  { clip: "35317702", at: 8, from: 2, exposure: 0.55, push: 0.04 },
  { clip: "35004655", at: 12.2, from: 0, exposure: 0.45, push: 0.02 },
];

/** The console capture the last beat shows (public/screens/<lang>/…). */
export const HERO_CAPTURE = "coverage";

const COPY = {
  fr: {
    devs: "Vos développeurs", have: "ont leur assistant", code: "de code.",
    api: "Au tarif API,", uncapped: "aucun plafond.",
    org: "Une organisation :", cap: "150 Sièges", capMore: "au plus.",
    orgs: "Plusieurs Organisations.", policy: "Une Politique par Poste.", cost: "Le coût réel.",
    console: "Une seule", consoleTitle: "console.", mention: "Démonstration · données illustratives", path: "/couverture",
  },
  en: {
    devs: "Your developers", have: "have their coding", code: "assistant.",
    api: "At API rates,", uncapped: "no ceiling.",
    org: "One organization:", cap: "150 Seats", capMore: "at most.",
    orgs: "Several organizations.", policy: "One Policy per Poste.", cost: "The real cost.",
    console: "One single", consoleTitle: "console.", mention: "Demonstration · illustrative data", path: "/couverture",
  },
} as const;
export type HeroLang = keyof typeof COPY;

/** The console window, tilted in light perspective, turning slowly towards the viewer. */
function ConsoleShot({ lang, at, out }: { lang: HeroLang; at: number; out: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rise = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 200 }, durationInFrames: Math.round(0.8 * fps) });
  const turn = interpolate(t, [at, out], [-16, -9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gone = interpolate(t, [out - 0.4, out], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (rise <= 0 || gone <= 0) return null;
  const scale = 1000 / PAGE.width;
  return (
    <div className="console-shot" style={{ opacity: rise * gone }}>
      <div className="tour-window" style={{ transformOrigin: "30% 50%", transform: `translateY(${(1 - rise) * 60}px) rotateY(${turn}deg) rotateX(5deg)` }}>
        <BrowserChrome path={COPY[lang].path} height={54} />
        <div style={{ position: "absolute", left: 0, top: 54, right: 0, bottom: 0, overflow: "hidden" }}>
          <div style={{ transformOrigin: "0 0", transform: `scale(${scale})` }}>
            <CaptureImage capture={{ src: `screens/${lang}/${HERO_CAPTURE}.png`, ...PAGE }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Titles({ lang }: { lang: HeroLang }) {
  const t = useTime();
  const copy = COPY[lang];
  return (
    <div className="film fleet site-hero">
      {/* 0–3.8 s — the developers */}
      <Shade t={t} at={0} out={3.4} className="shade--left" />
      <div className="stack hero-stack">
        <Line t={t} at={0.3} out={3.2} className="kicker">{copy.devs}</Line>
        <Line t={t} at={0.45} out={3.25} className="title title--m">{copy.have}</Line>
        <Line t={t} at={0.6} out={3.3} className="title title--m accent">{copy.code}</Line>
      </div>

      {/* 3.8–5.9 s — the bill at API rates */}
      <Shade t={t} at={3.8} out={5.55} className="shade--left" />
      <div className="stack hero-stack">
        <Line t={t} at={3.95} out={5.4} className="kicker">{copy.api}</Line>
        <Line t={t} at={4.1} out={5.45} className="title red">{copy.uncapped}</Line>
      </div>

      {/* 5.9–8 s — the seat cap */}
      <Shade t={t} at={5.9} out={7.65} className="shade--full" />
      <div className="stack hero-stack">
        <Line t={t} at={6.0} out={7.5} className="kicker">{copy.org}</Line>
        <Line t={t} at={6.15} out={7.55} className="title accent">{copy.cap}</Line>
        <Line t={t} at={6.3} out={7.6} className="title title--m">{copy.capMore}</Line>
      </div>
      <div className="seats hero-seats">
        <Seats t={t} at={6.1} out={7.6} cols={15} rows={10} cap={150} fill={1.2} cell={28} />
      </div>

      {/* 8–12.2 s — xSOM Fleet */}
      <Shade t={t} at={8} out={11.85} className="shade--left" />
      <div className="stack hero-stack">
        <Line t={t} at={8.15} out={9.15} className="title title--xl brand">xSOM Fleet</Line>
      </div>
      <div className="stack hero-stack" style={{ display: "grid", gap: 8 }}>
        <Slam t={t} at={9.6} dim={10.35} out={11.7}>{copy.orgs}</Slam>
        <Slam t={t} at={10.35} dim={11.05} out={11.75}>{copy.policy}</Slam>
        <Slam t={t} at={11.05} out={11.8}>{copy.cost}</Slam>
      </div>

      {/* 12.2–15.1 s — the console */}
      <Shade t={t} at={12.2} out={14.75} className="shade--deep" />
      <div className="stack hero-stack">
        <Line t={t} at={12.4} out={14.6} className="kicker">{copy.console}</Line>
        <Line t={t} at={12.55} out={14.65} className="title">{copy.consoleTitle}</Line>
      </div>
      <ConsoleShot lang={lang} at={12.45} out={15.05} />
      <div className="mention-wrap" style={{ opacity: clamp((t - 12.7) / 0.25) * (1 - clamp((t - 14.65) / 0.4)) }}>
        <span className="mention">{copy.mention}</span>
      </div>

      <Flash t={t} at={3.85} className="flash--red" />
      <Flash t={t} at={8.05} className="flash--blue" />
    </div>
  );
}

/** The opening shot again, timed to reach its first frame exactly when the film loops. */
function Seam() {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const first = HERO_SHOTS[0];
  const span = Math.round(SEAM * fps);
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, span - 1], [0, 1], { extrapolateRight: "clamp" }) }}>
      <OffthreadVideo
        src={staticFile(`footage/${first.clip}.mp4`)}
        trimBefore={Math.round(first.from * fps) - span}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${(first.focus ?? 0.5) * 100}% 50%`,
          transform: "scale(1.015)",
          filter: `brightness(${first.exposure ?? 1}) contrast(1.06) saturate(0.8)`,
        }}
      />
    </AbsoluteFill>
  );
}

/** Footage, grade, mesh, titles, the console and the music; the seam closes the loop. */
export function FleetHero({ lang }: { lang: HeroLang }) {
  const t = useTime();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill className="site" style={{ backgroundColor: "#050d1b" }}>
      <Reel shots={HERO_SHOTS} seconds={FLEET_HERO_SECONDS} />
      <Sequence from={Math.round((FLEET_HERO_SECONDS - SEAM) * fps)}>
        <Seam />
      </Sequence>
      <Grade />
      <Mesh t={t} at={8.05} sweep={1.3} level={0.45} out={11.9} />
      <Mesh t={t} at={12.2} sweep={1.1} level={0.32} out={14.9} />
      <Titles lang={lang} />
      <Probe />
      <Audio src={staticFile("score/fleet-hero.wav")} />
    </AbsoluteFill>
  );
}
