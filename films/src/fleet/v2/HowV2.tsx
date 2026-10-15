import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, outExpo } from "../../kit";
import { ScreenTour, type Focus, type TourPage, type TourWindow } from "../screen-tour";
import SCRIPT from "./how-script.json";
import TIMING from "./voice-timing.json";
import "../../titles.css";
import "../fleet.css";
import "../site.css";
import "./how.css";

export const HOW_V2_FPS = 30;
export type HowV2Lang = "fr" | "en";
export const howV2Seconds = (lang: HowV2Lang) => TIMING[lang].seconds;

type Cue = { text: string; start: number; end: number };
type SceneTiming = { id: string; start: number; length: number; voiceAt: number; voice: string | null; voiceLength: number; cues: Cue[] };

/** The voice is delivered near -21 dB RMS: raised to about -19 LUFS for the film, peaks kept under -1 dBFS. */
const VOICE_GAIN = 1.45;

const MENTION = { fr: "Démonstration · données illustratives", en: "Demonstration · illustrative data" } as const;

/** Where the console window sits: under the scene title, above the subtitles. */
const WINDOW: TourWindow = { left: 190, top: 150, width: 1540, height: 742, chrome: 58 };

/**
 * Boxes hidden on the captures (CSS pixels): the provider and product names the demonstration
 * data and the forms carry. No AI provider is named in the films; nothing else is changed.
 */
const REDACT = {
  orgs: {
    fr: [{ x: 28, y: 338, w: 702, h: 258 }, { x: 46, y: 748, w: 582, h: 42 }],
    en: [{ x: 28, y: 338, w: 738, h: 258 }, { x: 46, y: 748, w: 582, h: 42 }],
  },
  policy: [
    { x: 16, y: 322, w: 1568, h: 275 },
    { x: 46, y: 1226, w: 536, h: 118 },
    { x: 46, y: 1384, w: 536, h: 46 },
    { x: 56, y: 1686, w: 530, h: 30 },
    { x: 56, y: 1815, w: 530, h: 30 },
  ],
} satisfies Record<string, Focus[] | Record<HowV2Lang, Focus[]>>;

/** Text of the scenes drawn without a console capture (the screen does not exist yet). */
const COPY = {
  fr: {
    api: { kicker: "Console xSOM Fleet", title: "Applications API", items: ["Modèles autorisés", "Budget API", "Aucune clé ne passe par xSOM Fleet"] },
    tier: { kicker: "Coûts", title: "Recommandations de Palier de siège", items: ["Premium → Standard", "Équivalent API estimé (30 jours)", "Aucun Siège n’est modifié automatiquement"] },
    dossier: { kicker: "Dossier de preuves", title: "Prêt en un clic", items: ["PDF ou JSON", "Trois Pièces probantes", "Journaux chaînés vérifiés, avec ses limites"] },
    terminal: {
      window: "assistant de code — ~/paiements",
      first: "Ajoute les tests du module de facturation",
      firstReply: "✓ 14 tests ajoutés à facturation.test.ts",
      second: "Configure le déploiement avec cette clé : ",
      checking: "Contrôle avant envoi sur le Poste",
      tag: "xSOM Fleet · envoi refusé",
      blocked: "Envoi bloqué par xSOM Fleet : un secret a été détecté sur ce Poste. Sa valeur n’est ni affichée ni transmise.",
      rule: "Règle aws_access_key_id : Identifiant de clé d’accès AWS",
      remedy: "Retirez cette valeur d’identifiant cloud du contenu, remplacez-la par une variable d’environnement ou une référence à votre gestionnaire de secrets, puis renvoyez.",
      third: "Configure le déploiement avec la variable $AWS_ACCESS_KEY_ID",
      thirdReply: "✓ Déploiement configuré, la clé reste dans l’environnement",
      note: "Clé fictive, masquée à l’écran.",
    },
    signature: ["Les meilleures IA pour toute votre entreprise.", "La sécurité reste chez vous."],
  },
  en: {
    api: { kicker: "xSOM Fleet console", title: "API Applications", items: ["Allowed models", "API Budget", "No key goes through xSOM Fleet"] },
    tier: { kicker: "Costs", title: "Seat tier recommendations", items: ["Premium → Standard", "Estimated API equivalent (30 days)", "No Seat is changed automatically"] },
    dossier: { kicker: "Evidence dossier", title: "Ready in one click", items: ["PDF or JSON", "Three evidence pieces", "Chained journals verified, with its limitations"] },
    terminal: {
      window: "coding assistant — ~/payments",
      first: "Add the tests of the billing module",
      firstReply: "✓ 14 tests added to billing.test.ts",
      second: "Configure the deployment with this key: ",
      checking: "Check before sending, on the Poste",
      tag: "xSOM Fleet · sending refused",
      blocked: "Sending blocked by xSOM Fleet: a secret was detected on this Poste. Its value is neither displayed nor transmitted.",
      rule: "Rule aws_access_key_id: AWS access key ID",
      remedy: "Remove the cloud credential value from the content, replace it with an environment variable or a reference to your secrets manager, then send again.",
      third: "Configure the deployment with the variable $AWS_ACCESS_KEY_ID",
      thirdReply: "✓ Deployment configured, the key stays in the environment",
      note: "Dummy key, masked on screen.",
    },
    signature: ["The best AI for your whole company.", "Security stays with you."],
  },
} as const;

const ramp = (t: number, from: number, span: number) => clamp((t - from) / span);
function useT() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

/* ---------------------------------------------------------------------------------------- */

/** A plan drawn as type, where the console screen does not exist yet: title and three facts. */
function TypePlan({ at, kicker, title, items, children }: { at: number; kicker: string; title: string; items: readonly string[]; children?: ReactNode }) {
  const t = useT();
  const p = outExpo(ramp(t, at, 0.5));
  return (
    <div className="how-type" style={{ opacity: ramp(t, at, 0.3) }}>
      <div className="how-type-kicker" style={{ transform: `translateY(${(1 - p) * 20}px)` }}>
        {kicker}
      </div>
      <div className="how-type-title" style={{ transform: `translateY(${(1 - p) * 40}px)`, filter: `blur(${(1 - p) * 8}px)` }}>
        {title}
      </div>
      <div className="how-type-items">
        {items.map((item, i) => {
          const q = outExpo(ramp(t, at + 0.45 + i * 0.35, 0.45));
          return (
            <div key={i} className="how-type-item" style={{ opacity: q, transform: `translateX(${(1 - q) * -40}px)` }}>
              <i />
              {item}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}

/** The console tour, then a typographic plan that fades over it at `typeAt`. */
function TourThenType({ pages, mention, typeAt, plan }: { pages: TourPage[]; mention: string; typeAt?: number; plan?: ReactNode }) {
  const t = useT();
  const cross = typeAt === undefined ? 0 : ramp(t, typeAt, 0.45);
  return (
    <>
      {cross < 1 && (
        <AbsoluteFill style={{ opacity: 1 - cross, transform: `scale(${1 - 0.04 * cross})` }}>
          <ScreenTour pages={pages} mention={mention} window={WINDOW} />
        </AbsoluteFill>
      )}
      {cross > 0 && plan}
    </>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* The terminal of scene 4: a normal send, a key blocked on the Poste, the corrected send.   */

function Terminal({ lang, scene }: { lang: HowV2Lang; scene: SceneTiming }) {
  const t = useT();
  const c = COPY[lang].terminal;
  const v = scene.voiceAt;
  const [, second, third] = scene.cues;
  // Timeline, on the voice: the key is typed while the secret "was about to leave", blocked on "it stops it".
  const T = {
    type1: 0.3,
    send1: 1.7,
    type2: v + second.start + 0.2,
    send2: v + third.start - 0.45,
    block: v + third.start,
    type3: v + third.end + 0.5,
  };
  T.send1 = Math.min(T.send1, T.type2 - 1.4);
  const send3 = T.type3 + 1.3;
  const typed = (text: string, from: number, to: number) => text.slice(0, Math.round(text.length * ramp(t, from, to - from)));
  const key = "AKIA" + "•".repeat(12);
  const phase = t < T.send1 ? 0 : t < T.send2 ? 1 : t < send3 ? 2 : 3;
  let draft: ReactNode = null;
  if (phase === 0) draft = typed(c.first, T.type1, T.send1 - 0.3);
  if (phase === 1 && t >= T.type2) {
    const full = c.second + key;
    const s = typed(full, T.type2, T.send2 - 0.25);
    draft = (
      <>
        {s.slice(0, c.second.length)}
        <span className="masked">{s.slice(c.second.length)}</span>
      </>
    );
  }
  if (phase === 2 && t >= T.type3) draft = typed(c.third, T.type3, send3 - 0.2);
  const block = ramp(t, T.block, 0.25);
  const dots = ".".repeat(Math.max(0, Math.min(3, Math.floor((t - T.send2) / 0.12) + 1)));
  const shake = t > T.block && t < T.block + 0.3 ? Math.sin((t - T.block) * 90) * 8 * (1 - (t - T.block) / 0.3) : 0;
  return (
    <div className="terminal how-terminal" style={{ transform: `translateX(${shake}px)` }}>
      <div className="chrome" style={{ height: 58 }}>
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="address">{c.window}</span>
      </div>
      <div className="term-body">
        {phase >= 1 && (
          <>
            <div className="term-line term-dim">› {c.first}</div>
            <div className="term-line how-ok" style={{ opacity: ramp(t, T.send1 + 0.4, 0.25) }}>
              {c.firstReply}
            </div>
          </>
        )}
        {phase >= 2 && (
          <div style={{ marginTop: 18 }}>
            <div className="term-line term-dim">
              › {c.second}
              <span className="masked">{key}</span>
            </div>
            {t < T.block && (
              <div className="term-line term-dim">
                {c.checking}
                {dots}
              </div>
            )}
            <div className="blocked" style={{ opacity: block, transform: `translateY(${(1 - block) * 16}px)` }}>
              <span className="term-line tag">{c.tag}</span>
              <div className="term-line head">{c.blocked}</div>
              <div className="term-line">{c.rule}</div>
              <div className="term-line">{c.remedy}</div>
            </div>
          </div>
        )}
        {phase >= 3 && (
          <div style={{ marginTop: 18 }}>
            <div className="term-line term-dim">› {c.third}</div>
            <div className="term-line how-ok" style={{ opacity: ramp(t, send3 + 0.35, 0.25) }}>
              {c.thirdReply}
            </div>
          </div>
        )}
        <div className="prompt how-prompt">
          <b>›</b>
          <span className="term-line">
            {draft}
            <span className="caret" style={{ opacity: Math.floor(t * 2.5) % 2 ? 0.25 : 1 }} />
          </span>
        </div>
      </div>
      <div className="how-term-note" style={{ opacity: ramp(t, T.type2 + 0.5, 0.3) }}>
        {c.note}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------- */

function Visual({ id, lang, scene }: { id: string; lang: HowV2Lang; scene: SceneTiming }) {
  const L = scene.length;
  const at = (f: number) => Math.round(f * L * 100) / 100;
  const screen = (name: string) => `screens/${lang}/${name}.png`;
  const copy = COPY[lang];
  const mention = MENTION[lang];
  switch (id) {
    case "choose": {
      const orgs: TourPage = {
        src: screen("provider-orgs"),
        width: 1600,
        height: 1000,
        path: "/organisations-fournisseur",
        redact: REDACT.orgs[lang],
        steps: [
          { at: 0 },
          { at: at(0.12), focus: { x: 24, y: 278, w: 1556, h: 320 }, zoom: 1.05, pointer: false },
          { at: at(0.3), focus: { x: 1040, y: 278, w: 540, h: 320 } },
        ],
      };
      return <TourThenType pages={[orgs]} mention={mention} typeAt={at(0.52)} plan={<TypePlan at={at(0.52)} {...copy.api} />} />;
    }
    case "policy": {
      const policy: TourPage = {
        src: screen("policy-preview"),
        width: 1600,
        height: 2404,
        path: "/politique",
        redact: REDACT.policy,
        steps: [
          { at: 0 },
          { at: at(0.1), focus: { x: 20, y: 258, w: 900, h: 36 }, zoom: 1.7 },
          { at: at(0.32), focus: { x: 44, y: 716, w: 540, h: 470 } },
          { at: at(0.56), focus: { x: 30, y: 2050, w: 560, h: 200 } },
          { at: at(0.78), focus: { x: 44, y: 2262, w: 180, h: 52 }, zoom: 2.1 },
        ],
      };
      return <TourThenType pages={[policy]} mention={mention} />;
    }
    case "coverage": {
      const coverage: TourPage = {
        src: screen("coverage-full"),
        width: 1600,
        height: lang === "fr" ? 1644 : 1503,
        path: "/couverture",
        steps: [
          { at: 0 },
          { at: at(0.12), focus: { x: 24, y: 366, w: 1552, h: 80 }, zoom: 1.25 },
          { at: at(0.38), focus: { x: 24, y: 440, w: 1552, h: 330 } },
          { at: at(0.66), focus: { x: 24, y: 900, w: 1552, h: 420 } },
        ],
      };
      return <TourThenType pages={[coverage]} mention={mention} />;
    }
    case "invisible":
      return <Terminal lang={lang} scene={scene} />;
    case "costs": {
      const costs: TourPage = {
        src: screen("costs-developer"),
        width: 1600,
        height: 1000,
        path: "/couts",
        steps: [
          { at: 0 },
          { at: at(0.1), focus: { x: 26, y: 452, w: 680, h: 330 } },
          { at: at(0.3), focus: { x: 752, y: 452, w: 830, h: 330 } },
          { at: at(0.4), focus: { x: 24, y: 370, w: 640, h: 80 }, zoom: 1.4 },
        ],
      };
      return (
        <TourThenType
          pages={[costs]}
          mention={mention}
          typeAt={at(0.56)}
          plan={<TypePlan at={at(0.56)} {...copy.tier} />}
        />
      );
    }
    case "proof": {
      const journal: TourPage = {
        src: screen("block-journal-full"),
        width: 1600,
        height: 1355,
        path: "/journal-des-blocages",
        steps: [
          { at: 0 },
          { at: at(0.1), focus: { x: 20, y: 928, w: 1420, h: 360 } },
          { at: at(0.32), focus: { x: 46, y: 1216, w: 286, h: 46 }, zoom: 2 },
        ],
      };
      return <TourThenType pages={[journal]} mention={mention} typeAt={at(0.55)} plan={<TypePlan at={at(0.55)} {...copy.dossier} />} />;
    }
    default:
      return <Signature lang={lang} />;
  }
}

function Signature({ lang }: { lang: HowV2Lang }) {
  const t = useT();
  const logo = outExpo(ramp(t, 0.2, 0.8));
  const lines = COPY[lang].signature;
  return (
    <div className="how-signature">
      <div className="how-logo" style={{ opacity: logo, transform: `scale(${0.92 + 0.08 * logo})` }}>
        <Img src={staticFile("brand/mark.svg")} style={{ width: 150, height: 150, transform: `rotate(${(1 - logo) * -40}deg)` }} />
        <span>
          xSOM <em>Fleet</em>
        </span>
      </div>
      {lines.map((line, i) => {
        const p = outExpo(ramp(t, 1.4 + i * 1.3, 0.6));
        return (
          <div key={i} className={`how-signature-line${i ? " accent" : ""}`} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

/** The scene's number and title, top left. */
function SceneTitle({ n, title }: { n: number; title: string }) {
  const t = useT();
  const p = outExpo(ramp(t, 0.05, 0.5));
  return (
    <div className="how-scene-title" style={{ opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
      <b>{String(n).padStart(2, "0")}</b>
      <span>{title}</span>
    </div>
  );
}

/** Burned-in subtitles, cue by cue on the voice's own timings. */
function Subtitles({ scene }: { scene: SceneTiming }) {
  const t = useT() - scene.voiceAt;
  const cue = scene.cues.find((c, i) => t >= c.start - 0.08 && t < (scene.cues[i + 1]?.start ?? c.end + 0.6) - 0.08);
  if (!cue) return null;
  const p = ramp(t, cue.start - 0.08, 0.15);
  return (
    <div className="how-subtitle-wrap">
      <div className="how-subtitle" style={{ opacity: p }}>
        {cue.text}
      </div>
    </div>
  );
}

function Scene({ lang, index, scene }: { lang: HowV2Lang; index: number; scene: SceneTiming }) {
  const t = useT();
  const script = SCRIPT[lang][index];
  const fadeIn = ramp(t, 0, 0.35);
  const fadeOut = 1 - ramp(t, scene.length - 0.3, 0.3);
  const last = scene.id === "signature";
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, last ? 1 : fadeOut) }}>
      {!last && <SceneTitle n={index + 1} title={script.title} />}
      <Visual id={scene.id} lang={lang} scene={scene} />
      {!last && <Subtitles scene={scene} />}
    </AbsoluteFill>
  );
}

export function HowV2({ lang }: { lang: HowV2Lang }) {
  const { fps } = useVideoConfig();
  const scenes = TIMING[lang].scenes as SceneTiming[];
  const total = TIMING[lang].seconds;
  return (
    <AbsoluteFill className="film fleet site how-v2">
      <div className="backdrop" />
      {scenes.map((scene, i) => (
        <Sequence key={scene.id} from={Math.round(scene.start * fps)} durationInFrames={Math.round(scene.length * fps) + 1}>
          <Scene lang={lang} index={i} scene={scene} />
          {scene.voice && (
            <Sequence from={Math.round(scene.voiceAt * fps)}>
              <Audio src={staticFile(scene.voice)} volume={VOICE_GAIN} />
            </Sequence>
          )}
        </Sequence>
      ))}
      <Audio
        src={staticFile(`score/fleet-how-v2-${lang}.wav`)}
        volume={(f) => {
          const s = f / fps;
          // Music under the voice: lower while someone speaks, up between scenes and at the end.
          const speaking = Math.max(
            ...scenes.map((sc) => {
              const from = sc.start + sc.voiceAt;
              const to = from + sc.voiceLength;
              return clamp(Math.min((s - from + 0.5) / 0.5, (to + 0.5 - s) / 0.5));
            }),
          );
          return (0.6 - 0.3 * speaking) * (1 - clamp((s - (total - 1.5)) / 1.5));
        }}
      />
    </AbsoluteFill>
  );
}
