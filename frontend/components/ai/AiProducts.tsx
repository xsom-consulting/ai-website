"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CHATGPT_MARK, CLAUDE_MARK } from "@/components/fleet/brand-marks";
import { motionReduced } from "@/components/home/motion";
import { SiteLink } from "@/components/site/SiteLink";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import type { AI_COPY } from "./ai-copy";

type Products = (typeof AI_COPY)["fr" | "en"]["products"];
type FeatureKey = Products["fleet"]["features"][number]["key"];

/**
 * « Nos produits » dans la charte claire de www.xsom.fr (« 01 Notre offre »). Ce qui
 * fonctionne se montre en action, ce qui se construit se décrit : Secret Guard joue son
 * expurgation dans VS Code (messages réels de l'extension, capture réelle de son panneau),
 * xSOM Fleet, en développement, est présenté par son architecture cible. Le mouvement
 * joue une fois, à l'apparition, puis se pose ; sans animation, tout est dans son état final.
 */
const GUARD_PANEL = { src: "/signal-media/secret-guard-vscode-panel.webp", width: 856, height: 814 } as const;
export function AiProducts({ copy }: { copy: Products }) {
  const { fleet, guard } = copy;
  return (
    <section id="produits" className="ai-light ai-offer" aria-labelledby="ai-products-title">
      <div className="guard-wrap">
        <header className="ai-offer__head">
          <p className="ai-eyebrow reveal"><span>{copy.number}</span>{copy.name}</p>
          <h2 id="ai-products-title" className="ai-h2 reveal" data-delay="1">
            {copy.title.before}<em>{copy.title.accent}</em>{copy.title.after}
          </h2>
        </header>

        <article className="ai-product ai-product--fleet ai-showcase reveal" data-delay="2">
          <div className="ai-showcase__body">
            <p className="ai-tag ai-tag--pilot">{fleet.tag}</p>
            <h3 className="ai-showcase__name"><Mark />{fleet.name}</h3>
            <p className="ai-showcase__line">{fleet.line}</p>
            <p className="ai-verbs">
              {fleet.verbs.map((verb, index) => (
                <span key={verb} style={{ "--i": index } as CSSProperties}>{verb}</span>
              ))}
            </p>
            <ul className="ai-features">
              {fleet.features.map((feature, index) => (
                <li key={feature.key} className="ai-feature" style={{ "--i": index } as CSSProperties}>
                  <span className="ai-feature__icon" aria-hidden="true"><FeatureIcon name={feature.key} /></span>
                  <span className="ai-feature__text">
                    <span className="ai-feature__tag">{feature.tag}</span>
                    <strong>{feature.title}</strong>
                    <small>{feature.body}</small>
                    {feature.key === "security" ? (
                      <span className="ai-feature__brands">
                        {fleet.providers.map((source) => (
                          <span key={source.brand} className="ai-brand-chip">
                            <ProviderMark brand={source.brand} />{source.name}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <div className="ai-proof">
              <b>{fleet.proof.figure}</b>
              <p>{fleet.proof.text}</p>
            </div>
            <div className="ai-showcase__actions">
              <SiteLink to={{ site: "fleet" }} className="ai-btn">{fleet.action} <span aria-hidden="true">→</span></SiteLink>
            </div>
            <p className="ai-fineprint">{fleet.trademarks}</p>
          </div>
          <FleetArchitecture plan={fleet.architecture} providers={fleet.providers} />
        </article>

        <article className="ai-product ai-product--guard ai-showcase ai-showcase--reverse reveal" data-delay="2">
          <GuardInAction demo={guard.demo} />
          <div className="ai-showcase__body">
            <p className="ai-tag ai-tag--ok">{guard.tag}</p>
            <h3 className="ai-showcase__name"><Mark />{guard.name}</h3>
            <p className="ai-showcase__audience">{guard.audience}</p>
            <p className="ai-showcase__line">{guard.line}</p>
            <ul className="ai-checks">{guard.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <p className="ai-tag ai-tag--soon"><CodeGlyph />{guard.vscode}</p>
            <div className="ai-showcase__actions">
              <SiteLink to={{ site: "guard" }} className="ai-btn">{guard.action} <span aria-hidden="true">→</span></SiteLink>
              <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="ai-link">{guard.source} <span aria-hidden="true">↗</span></SiteLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/** Le logo xSOM, variante pour fond clair (décoratif : le nom du produit suit). */
function Mark() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="ai-showcase__mark" src="/xsom-mark-light.svg" alt="" width={34} height={34} aria-hidden="true" />;
}

function ProviderMark({ brand }: { brand: string }) {
  return (
    <svg className="ai-provider" data-brand={brand} viewBox="0 0 24 24" aria-hidden="true">
      <path d={brand === "claude" ? CLAUDE_MARK : CHATGPT_MARK} />
    </svg>
  );
}

function Stroke({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function FeatureIcon({ name }: { name: FeatureKey }) {
  if (name === "finops") {
    return <Stroke><path d="M4 3h16v18l-3-2-2.5 2-2.5-2-2.5 2L7 19l-3 2z" /><path d="M14.5 8.5a3 3 0 1 0 0 5M8.5 10h5M8.5 12h5" /></Stroke>;
  }
  if (name === "security") {
    return <Stroke><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6z" /><path d="m8.8 12 2.2 2.2 4.3-4.4" /></Stroke>;
  }
  return <Stroke><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></Stroke>;
}

function CodeGlyph() {
  return <Stroke><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m13.5 5-3 14" /></Stroke>;
}

/** Les fils de l'architecture, dans le repère 520 × 360 du schéma (voir `ai-home.css`). */
const WIRES = [
  "M122 70 C 165 70, 160 97, 195 97",
  "M122 125 C 165 125, 160 97, 195 97",
  "M325 97 C 360 97, 360 70, 395 70",
  "M325 97 C 360 97, 360 125, 395 125",
  "M248 236 L 248 127",
  "M272 127 L 272 236",
  "M291 268 C 330 268, 330 232, 364 232",
  "M291 268 C 330 268, 330 304, 364 304",
];

/**
 * L'architecture cible de xSOM Fleet : les envois passent par l'Agent xSOM du poste
 * (Secret Guard en local) avant les fournisseurs ; la console signe la Politique, reçoit
 * des Événements sans contenu et en tire la facture et le dossier de preuves.
 */
function FleetArchitecture({ plan, providers }: { plan: Products["fleet"]["architecture"]; providers: Products["fleet"]["providers"] }) {
  return (
    <figure className="ai-panel ai-schema" role="img" aria-label={plan.label}>
      <div className="ai-schema__stage" aria-hidden="true">
        <svg className="ai-schema__wires" viewBox="0 0 520 360" preserveAspectRatio="none">
          {WIRES.map((d, index) => (
            <g key={d} style={{ "--i": index } as CSSProperties}>
              <path className="ai-wire" d={d} pathLength={1} />
              <path className="ai-pulse" d={d} pathLength={1} />
            </g>
          ))}
        </svg>
        <span className="ai-group ai-group--left">{plan.postes}</span>
        <span className="ai-group ai-group--right">{plan.providers}</span>
        {providers.map((source, index) => (
          <span key={source.brand} className="ai-node ai-node--in" style={{ "--i": index, top: `${index ? 34.7 : 19.4}%` } as CSSProperties}>
            <ProviderMark brand={source.brand} />{source.name}
          </span>
        ))}
        <span className="ai-agent" style={{ "--i": 2 } as CSSProperties}>
          <b>{plan.agent.name}</b>
          <small>{plan.agent.detail}</small>
        </span>
        {["Anthropic", "OpenAI"].map((name, index) => (
          <span key={name} className="ai-node ai-node--provider" style={{ "--i": index + 3, top: `${index ? 34.7 : 19.4}%` } as CSSProperties}>{name}</span>
        ))}
        <span className="ai-link-label ai-link-label--policy">{plan.policy} ↑</span>
        <span className="ai-link-label ai-link-label--events">↓ {plan.events}</span>
        <span className="ai-hub">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/xsom-mark.svg" alt="" width={34} height={34} />
          <b>{plan.console}</b>
        </span>
        {plan.outputs.map((output, index) => (
          <span key={output.key} className="ai-node ai-node--out" data-key={output.key} style={{ "--i": index + 5, top: `${index ? 84.4 : 64.4}%` } as CSSProperties}>
            <FeatureIcon name={output.key} />
            <span><b>{output.name}</b><small>{output.detail}</small></span>
          </span>
        ))}
      </div>
      <figcaption className="ai-panel__caption"><span className="ai-demo">{plan.tag}</span>{plan.caption}</figcaption>
    </figure>
  );
}

/** Les temps du film de Secret Guard, en millisecondes : une étape par entrée. */
const GUARD_STEPS = [0, 400, 2500, 3000, 3700, 4300, 4900, 6000, 7000, 7800];
const GUARD_FINAL = GUARD_STEPS.length - 1;

/**
 * Secret Guard en action, joué dans une fenêtre VS Code : la caméra cadre le champ du
 * chat, le développeur envoie à @secretguard un prompt avec une clé, la clé est
 * remplacée par le marqueur réel de l'extension, la caméra recule, le modèle répond et le
 * vrai panneau de l'extension s'ouvre depuis la barre d'état. Joué une fois à
 * l'apparition, rejouable ; sans animation (ou sans JavaScript), l'état final s'affiche.
 */
function GuardInAction({ demo }: { demo: Products["guard"]["demo"] }) {
  const root = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const [step, setStep] = useState(GUARD_FINAL);

  const play = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    if (motionReduced()) {
      setStep(GUARD_FINAL);
      return;
    }
    setStep(0);
    timers.current = GUARD_STEPS.slice(1).map((at, index) => window.setTimeout(() => setStep(index + 1), at));
  }, []);

  useEffect(() => {
    const figure = root.current;
    if (!figure || motionReduced()) return;
    setStep(0);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      play();
    }, { threshold: 0.45 });
    observer.observe(figure);
    const pending = timers.current;
    return () => {
      observer.disconnect();
      pending.forEach(window.clearTimeout);
    };
  }, [play]);

  // Le prompt se tape caractère par caractère pendant l'étape 1.
  const typing = `${demo.participant} ${demo.prompt}${demo.secret}`;
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (step !== 1) return;
    setTyped(0);
    const started = performance.now();
    const tick = window.setInterval(() => {
      const count = Math.min(typing.length, Math.round(((performance.now() - started) / 1700) * typing.length));
      setTyped(count);
      if (count >= typing.length) window.clearInterval(tick);
    }, 30);
    return () => window.clearInterval(tick);
  }, [step, typing.length]);
  const shown = step === 1 ? typing.slice(0, typed) : "";
  const tag = demo.participant.length;

  const steps = Array.from({ length: step + 1 }, (_, index) => `s${index}`).join(" ");
  const secret = <mark className="ai-vsc__secret">{demo.secret}</mark>;

  return (
    <figure ref={root} className={`ai-panel ai-vsc ${steps}`} aria-label={demo.label} role="group">
      <div className="ai-vsc__viewport" aria-hidden="true">
        <div className="ai-vsc__window">
          <div className="ai-vsc__title"><span className="ai-editor__dots"><i /><i /><i /></span>{demo.window}</div>
          <div className="ai-vsc__body">
            <div className="ai-vsc__activity"><i /><i /><i /><i /></div>
            <div className="ai-vsc__chat">
              <p className="ai-vsc__chat-title">{demo.chat}</p>
              <div className="ai-vsc__messages">
                <div className="ai-vsc__bubble"><b>{demo.participant}</b> {demo.prompt}{secret}</div>
                <div className="ai-vsc__reply">
                  <p className="ai-vsc__who"><Shield />{demo.participant}</p>
                  <p className="ai-vsc__notice">{demo.notice}</p>
                  {demo.answer.map((line, index) => (
                    <p key={line} className="ai-vsc__answer" style={{ "--i": index } as CSSProperties}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="ai-vsc__input">
                <span className="ai-vsc__typed"><b>{shown.slice(0, tag)}</b>{shown.slice(tag)}<span className="ai-vsc__caret" /></span>
                <span className="ai-vsc__send"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5 21 12 3 3.5 5.5 12z" /></svg></span>
              </div>
            </div>
            <div className="ai-vsc__editor">
              <p className="ai-vsc__tab">{demo.file}</p>
              {[62, 48, 74, 35, 58, 66, 41].map((width, index) => <i key={index} style={{ width: `${width}%` }} />)}
            </div>
          </div>
          <div className="ai-vsc__status">
            <span>main</span>
            <span className="ai-vsc__status-guard"><Shield />{demo.status}</span>
          </div>
          <div className="ai-vsc__panel">
            <Image src={GUARD_PANEL.src} alt="" width={GUARD_PANEL.width} height={GUARD_PANEL.height} unoptimized sizes="12rem" />
            <span>{demo.panel}</span>
          </div>
        </div>
      </div>
      <div className="ai-vsc__outcome">
        <p className="ai-vsc__received">
          <span>{demo.received}</span>
          <code>
            {demo.participant} {demo.prompt}
            <span className="ai-vsc__swap"><span className="ai-vsc__raw">{demo.secret}</span><span className="ai-vsc__marker">{demo.marker}</span></span>
          </code>
        </p>
        <ul className="ai-vsc__results">
          {demo.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
        </ul>
      </div>
      <figcaption className="ai-panel__caption ai-vsc__caption">
        <button type="button" className="ai-vsc__replay" onClick={play}>↻ {demo.replay}</button>
        {demo.caption}
      </figcaption>
    </figure>
  );
}

function Shield() {
  return <Stroke><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6z" /></Stroke>;
}
