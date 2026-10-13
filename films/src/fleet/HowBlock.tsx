import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Probe } from "./kit";
import "../titles.css";
import "./fleet.css";
import "./site.css";

export const HOW_BLOCK_SECONDS = 10;

/**
 * The block message is the agent's own text: catalogue keys hook.blocked, hook.blocked_rule
 * (rule github_token, label hook.rule.github_token) and hook.remedy.provider_token of
 * xsom-fleet contracts/i18n/{fr,en}.json, assembled as agent/internal/domain/hook/messages.go
 * does (header, one line per rule, one remedy per secret type). The key on screen is a dummy,
 * masked: no character of a real token is ever drawn or written here.
 */
const COPY = {
  fr: {
    title: "Contrôle avant envoi",
    window: "assistant de code — ~/paiements",
    prompt: "Déploie la préproduction avec ce jeton : ",
    checking: "Contrôle avant envoi sur le Poste",
    tag: "xSOM Fleet · envoi refusé",
    blocked: "Envoi bloqué par xSOM Fleet : un secret a été détecté sur ce Poste. Sa valeur n’est ni affichée ni transmise.",
    rule: "Règle github_token : Jeton GitHub",
    remedy: "Retirez cette valeur de jeton du contenu, remplacez-la par une variable d’environnement ou une référence à votre gestionnaire de secrets, puis renvoyez.",
    note: "La clé n’a pas quitté le Poste.",
    small: "Clé fictive, masquée à l’écran.",
  },
  en: {
    title: "Check before sending",
    window: "coding assistant — ~/payments",
    prompt: "Deploy staging with this token: ",
    checking: "Check before sending, on the Poste",
    tag: "xSOM Fleet · sending refused",
    blocked: "Sending blocked by xSOM Fleet: a secret was detected on this Poste. Its value is neither displayed nor transmitted.",
    rule: "Rule github_token: GitHub token",
    remedy: "Remove the token value from the content, replace it with an environment variable or a reference to your secrets manager, then send again.",
    note: "The key never left the Poste.",
    small: "Dummy key, masked on screen.",
  },
} as const;
export type BlockLang = keyof typeof COPY;

/** The masked key: its prefix tells the rule, the rest is dots. */
const MASKED = { prefix: "ghp_", dots: "•".repeat(16) };

/** Timeline, in seconds. */
const T = { typeFrom: 0.6, typeTo: 3.2, send: 3.6, block: 4.3, note: 5.0, out: 8.7, clear: 9.3 };

export function HowBlock({ lang }: { lang: BlockLang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const copy = COPY[lang];
  const ramp = (from: number, span = 0.25) => interpolate(t, [from, from + span], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = 1 - ramp(T.out, 0.5);

  // Typing: the sentence, then the masked key, at an even pace.
  const full = copy.prompt.length + MASKED.prefix.length + MASKED.dots.length;
  const typed = Math.round(full * ramp(T.typeFrom, T.typeTo - T.typeFrom));
  const sent = t >= T.send && t < T.clear;
  const draft = t < T.send ? typed : 0;
  const text = (count: number) => {
    const sentence = copy.prompt.slice(0, count);
    const rest = Math.max(0, count - copy.prompt.length);
    return (
      <>
        {sentence}
        <span className="masked">
          {MASKED.prefix.slice(0, rest)}
          {MASKED.dots.slice(0, Math.max(0, rest - MASKED.prefix.length))}
        </span>
      </>
    );
  };
  const dots = Math.min(3, Math.floor((t - T.send - 0.15) / 0.15) + 1);
  const block = ramp(T.block);

  return (
    <AbsoluteFill className="film fleet site">
      <div className="backdrop" />
      <div className="film-title">{copy.title}</div>
      <div className="terminal">
        <div className="chrome" style={{ height: 64 }}>
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          <span className="address">{copy.window}</span>
        </div>
        <div className="term-body">
          {sent && (
            <div style={{ opacity: fadeOut }}>
              <div className="term-line term-dim">› {text(full)}</div>
              <div className="term-line term-dim" style={{ opacity: ramp(T.send + 0.1, 0.2) * (1 - ramp(T.block, 0.2)) }}>
                {copy.checking}
                {".".repeat(Math.max(0, dots))}
              </div>
              <div className="blocked" style={{ opacity: block, transform: `translateY(${(1 - block) * 16}px)` }}>
                <span className="term-line tag">{copy.tag}</span>
                <div className="term-line head">{copy.blocked}</div>
                <div className="term-line">{copy.rule}</div>
                <div className="term-line">{copy.remedy}</div>
              </div>
            </div>
          )}
          <div className="prompt" style={{ position: "absolute", left: 54, right: 54, bottom: 40 }}>
            <b>›</b>
            <span className="term-line">
              {text(draft)}
              <span className="caret" />
            </span>
          </div>
        </div>
      </div>
      <div className="tour-note" style={{ top: 942, opacity: ramp(T.note) * fadeOut, transform: `translateY(${(1 - ramp(T.note)) * 14}px)` }}>
        {copy.note}
        <small>{copy.small}</small>
      </div>
    </AbsoluteFill>
  );
}

export function HowBlockFilm({ lang }: { lang: BlockLang }) {
  return (
    <>
      <HowBlock lang={lang} />
      <Probe />
    </>
  );
}
