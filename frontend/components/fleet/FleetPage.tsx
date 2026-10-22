"use client";

import type { CSSProperties, ReactNode } from "react";
import { glideTo } from "@/components/home/motion";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { CHATGPT_MARK, CLAUDE_MARK } from "./brand-marks";
import { FleetCapture } from "./FleetCapture";
import { FleetConsole } from "./FleetConsole";
import { FleetFlow } from "./FleetFlow";
import { FleetGateway } from "./FleetGateway";
import { FleetGuardFlow } from "./FleetGuardFlow";
import { FleetHowFilm } from "./FleetHowFilm";
import { FleetMap } from "./FleetMap";
import { FleetMatrix } from "./FleetMatrix";
import { CATALOGUE, catalogueDate } from "./fleet-catalogue";
import { FleetSankey } from "./FleetSankey";
import {
  FLEET_CHAPTERS,
  FLEET_CONSOLE,
  FLEET_CONSOLE_URL,
  FLEET_CONTACT,
  FLEET_COPY,
  FLEET_MEASUREMENT,
  FLEET_PRICE_CONTACT,
  FLEET_SIMULATION_CONTACT,
  fleetHowMedia,
  type FleetChapter,
} from "./fleet-copy";
import { PitchProgress } from "./PitchProgress";

/** Une longueur de barre, en pourcentage de la plus longue (au moins un trait visible). */
const share = (part: number, whole: number) => `${Math.max((100 * part) / whole, 1.5).toFixed(1)}%`;
const SCALE = FLEET_MEASUREMENT.claude.usageCents;
const CLAUDE_PLAN = share(FLEET_MEASUREMENT.claude.planCents, SCALE);
const CODEX_USAGE = share(FLEET_MEASUREMENT.codex.usageCents, SCALE);
const bar = (width: string) => ({ "--w": width }) as CSSProperties;

const number = (chapter: FleetChapter) => String(FLEET_CHAPTERS.indexOf(chapter) + 1).padStart(2, "0");

/** L'en-tête d'un écran : le numéro du chapitre, son nom, l'étape s'il en a plusieurs, puis le titre. */
function ScreenHead({ chapter, name, step, title, lead, level = 2, id }: { chapter: FleetChapter; name: string; step?: string; title: string; lead?: string; level?: 2 | 3; id?: string }) {
  const Title = level === 2 ? "h2" : "h3";
  return (
    <header className="xp-head">
      <p className="xp-mark reveal"><span className="xp-mark__n">{number(chapter)}</span><span>{name}</span>{step ? <span className="xp-mark__step">{step}</span> : null}</p>
      <Title id={id} className="xp-head__title reveal" data-delay="1">{title}</Title>
      {lead ? <p className="xp-head__lead reveal" data-delay="2">{lead}</p> : null}
    </header>
  );
}

function Chapter({ id, children, className = "" }: { id: FleetChapter; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`xp-chapter ${className}`} data-n={number(id)} aria-labelledby={`${id}-title`}>
      {children}
    </section>
  );
}

/**
 * La page xSOM Fleet, servie à la racine de `fleet.xsom.fr`, lue comme un dossier de
 * présentation : la couverture (la plateforme en un mot et son schéma), trois piliers
 * (sécurité, FinOps en trois écrans, stratégie), les options sur le schéma d’une
 * entreprise type et leur matrice, le film, les licences et engagements,
 * les questions et le contact. Une idée par écran ; un indicateur de progression
 * discret ; les révélations au défilement sont celles du site (`.reveal`), coupées
 * quand le mouvement est réduit. Charte commune avec `ai.xsom.fr` : `app/pitch.css`.
 */
export function FleetPage() {
  const { lang } = useT();
  const copy = FLEET_COPY[lang];
  const hero = copy.hero;
  const measure = copy.finops.measure;
  const sankey = copy.finops.sankey;
  const consoleCopy = copy.finops.console;
  const chapters = FLEET_CHAPTERS.map((id) => ({ id, n: number(id), name: copy.chapters[id] }));

  const consoleTabs = [
    {
      id: "costs",
      label: consoleCopy.costs.tab,
      shot: FLEET_CONSOLE.costs,
      alt: consoleCopy.costs.alt,
      marks: [
        { label: consoleCopy.costs.markReal, box: [11.6, 52.4, 32.6, 44] as const },
        { label: consoleCopy.costs.markEstimate, box: [44.7, 52.4, 53.7, 44] as const, dashed: true },
      ],
      side: (
        <>
          <div className="fl-stat">
            <p>{consoleCopy.costs.real}</p>
            <strong>{consoleCopy.costs.realValue}</strong>
            <small>{consoleCopy.costs.realNote}</small>
          </div>
          <div className="fl-stat fl-stat--estimate">
            <p>{consoleCopy.costs.estimate}</p>
            <strong>{consoleCopy.costs.estimateValue}</strong>
            <small>{consoleCopy.costs.estimateNote}</small>
          </div>
          <p className="fl-console__note">{consoleCopy.costs.never}</p>
        </>
      ),
    },
    {
      id: "seats",
      label: consoleCopy.seats.tab,
      shot: FLEET_CONSOLE.seats,
      alt: consoleCopy.seats.alt,
      marks: [{ label: consoleCopy.seats.mark, box: [89.4, 45.5, 9.8, 52.5] as const }],
      side: (
        <>
          <div className="fl-stat">
            <p>{consoleCopy.seats.valueNote}</p>
            <strong>{consoleCopy.seats.value}</strong>
          </div>
          <p className="fl-console__line">{consoleCopy.seats.line}</p>
          <p className="fl-console__note">{consoleCopy.seats.history}</p>
        </>
      ),
    },
  ];

  return (
    <div className="guard-landing xhome xp xfl">
      <SiteHeader
        site="fleet"
        actions={[
          { label: copy.signIn, href: FLEET_CONSOLE_URL, variant: "ghost" },
          { label: hero.contact, href: FLEET_CONTACT, variant: "solid" },
        ]}
      />
      <PitchProgress chapters={chapters} label={copy.progress} />
      <main>
        {/* Couverture : la plateforme en un mot, puis son schéma. */}
        <section id="promesse" className="xp-cover" aria-labelledby="fl-title">
          <div className="xp-cover__grid" aria-hidden="true" />
          <div className="guard-wrap">
            <h1 id="fl-title" className="xp-cover__title reveal">{hero.title}</h1>
            <p className="xp-cover__lead reveal" data-delay="1">{hero.lead}</p>
            <div className="xp-actions reveal" data-delay="2">
              <a className="xp-btn" href={FLEET_CONTACT}>{hero.contact}</a>
              <a className="xp-btn xp-btn--ghost" href="#film" onClick={glideTo}>{hero.film}</a>
              <span className="xp-actions__note">{hero.pilot}</span>
            </div>
            <div className="reveal" data-delay="3">
              <FleetFlow labels={hero.flow} />
            </div>
            <div className="fl-supported reveal" data-delay="4">
              <p className="fl-supported__label">{hero.flow.supported}</p>
              <ul>
                <li><span className="fl-node__icon" data-brand="claude" aria-hidden="true"><svg viewBox="0 0 24 24"><path d={CLAUDE_MARK} /></svg></span>Claude <small>Claude Code</small></li>
                <li><span className="fl-node__icon" data-brand="chatgpt" aria-hidden="true"><svg viewBox="0 0 24 24"><path d={CHATGPT_MARK} /></svg></span>ChatGPT <small>Codex</small></li>
              </ul>
              <p className="fl-supported__note">{hero.flow.trademarks}</p>
              <span className="xp-pill">{hero.flow.schematic}</span>
            </div>
          </div>
        </section>

        {/* 01 · Sécurité */}
        <Chapter id="securite">
          <div className="xp-screen guard-wrap">
            <ScreenHead chapter="securite" name={copy.chapters.securite} title={copy.guard.title} lead={copy.guard.lead} id="securite-title" />
            <div className="reveal" data-delay="3"><FleetGuardFlow labels={copy.guard} /></div>
            <div className="fl-guard__foot reveal" data-delay="4">
              <p className="fl-seal">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 1.5l5 2v3.8c0 3.2-2.1 5.5-5 6.7-2.9-1.2-5-3.5-5-6.7V3.5z" /><path d="M5.6 8l1.7 1.7 3.1-3.2" /></svg>
                {copy.guard.policy}
              </p>
              <p>{copy.guard.failClosed}</p>
              <p className="xp-caption">{copy.guard.caption}</p>
              <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="xp-link">{copy.guard.source} <span aria-hidden="true">↗</span></SiteLink>
            </div>
          </div>
        </Chapter>

        {/* 02 · FinOps : la mesure réelle, la simulation, la console. */}
        <Chapter id="finops">
          <div className="xp-screen guard-wrap">
            <ScreenHead chapter="finops" name={copy.chapters.finops} step="1/3" title={copy.finops.title} id="finops-title" />
            <div className="fl-measure">
              <figure className="fl-measure__card reveal" data-delay="2">
                <p className="fl-measure__top"><span className="xp-pill xp-pill--ok">{measure.tag}</span><span>{measure.when}</span></p>
                <p className="fl-measure__ratio"><strong>{measure.ratio}</strong><span>{measure.ratioLine}</span></p>
                <div className="fl-bars">
                  <p className="fl-bars__group">{measure.claude}</p>
                  <div className="fl-bars__row"><span>{measure.plan}</span><i style={bar(CLAUDE_PLAN)} /><b>{measure.claudePlan}</b></div>
                  <div className="fl-bars__row" data-bar="usage"><span>{measure.usage}</span><i style={bar("100%")} /><b>{measure.claudeUsage}</b></div>
                  <p className="fl-bars__group">{measure.codex}</p>
                  <div className="fl-bars__row" data-bar="text"><span>{measure.plan}</span><em>{measure.codexPlanNote}</em><b>{measure.codexPlan}</b></div>
                  <div className="fl-bars__row" data-bar="usage"><span>{measure.usage}</span><i style={bar(CODEX_USAGE)} /><b>{measure.codexUsage}</b></div>
                </div>
                <figcaption className="fl-measure__source">{measure.source} <code>{measure.command}</code></figcaption>
              </figure>
              <div className="fl-measure__capture reveal" data-delay="3">
                <FleetCapture image={FLEET_MEASUREMENT.capture} alt={measure.captureAlt} open={measure.capture} close={measure.captureClose} />
              </div>
            </div>
          </div>

          <div className="xp-screen guard-wrap">
            <ScreenHead chapter="finops" name={copy.chapters.finops} step="2/3" title={sankey.title} lead={sankey.lead} level={3} />
            <figure className="fl-sankey-card reveal" data-delay="3">
              <figcaption className="fl-sankey-card__top"><span className="xp-pill xp-pill--sim">{copy.simulation}</span></figcaption>
              <FleetSankey labels={sankey} />
              <p className="fl-sankey-card__hyp">{sankey.hypotheses}</p>
            </figure>
            <div className="xp-actions reveal" data-delay="4">
              <a className="xp-btn xp-btn--ghost" href={FLEET_SIMULATION_CONTACT}>{sankey.action}</a>
              <span className="xp-pill xp-pill--sim">{copy.simulation}</span>
            </div>
          </div>

          <div className="xp-screen guard-wrap">
            <ScreenHead chapter="finops" name={copy.chapters.finops} step="3/3" title={consoleCopy.title} lead={consoleCopy.consoleLanguage ?? undefined} level={3} />
            <div className="reveal" data-delay="3">
              <FleetConsole tabs={consoleTabs} label={consoleCopy.tabs} demo={copy.demo} />
            </div>
          </div>
        </Chapter>

        {/* 03 · Stratégie : Fleet Gateway, disponible pour pilote. */}
        <Chapter id="strategie">
          <div className="xp-screen guard-wrap">
            <ScreenHead chapter="strategie" name={copy.chapters.strategie} title={copy.strategy.title} lead={copy.strategy.lead} id="strategie-title" />
            <p className="reveal" data-delay="2"><span className="xp-pill xp-pill--pilot">{copy.strategy.pilot}</span></p>
            <div className="reveal" data-delay="3"><FleetGateway labels={copy.strategy} /></div>
            <ul className="fl-points reveal" data-delay="4">
              {copy.strategy.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
        </Chapter>

        {/* 04 · Options : le schéma d’une entreprise type, puis la matrice de comparaison. */}
        <Chapter id="options">
          <div className="xp-screen guard-wrap">
            <ScreenHead chapter="options" name={copy.chapters.options} step="1/2" title={copy.options.title} lead={copy.options.lead} id="options-title" />
            <div className="reveal" data-delay="3">
              <FleetMap lang={lang} labels={copy.options.map} />
            </div>
            <div className="fl-map__foot reveal" data-delay="4">
              <span className="xp-pill">{copy.options.schematic}</span>
              <p className="xp-caption">{copy.options.provenance(catalogueDate(CATALOGUE.date, lang), catalogueDate(CATALOGUE.provenance.researchDate, lang))}</p>
              <p className="xp-caption">{copy.options.trademarks}</p>
            </div>
          </div>
          <div className="xp-screen guard-wrap" id="matrice">
            <ScreenHead chapter="options" name={copy.chapters.options} step="2/2" title={copy.options.matrix.title} lead={copy.options.matrix.lead} level={3} />
            <div className="reveal" data-delay="3">
              <FleetMatrix lang={lang} labels={copy.options.matrix} />
            </div>
          </div>
        </Chapter>

        {/* 05 · Film */}
        <Chapter id="film" className="xp-chapter--film">
          <div className="xp-screen guard-wrap">
            <ScreenHead chapter="film" name={copy.chapters.film} title={copy.film.title} lead={copy.film.lead} id="film-title" />
            <div className="reveal" data-delay="3">
              <FleetHowFilm key={lang} media={fleetHowMedia(lang)} chapters={copy.film.steps} labels={{ ...copy.film, demo: copy.demo }} />
            </div>
          </div>
        </Chapter>

        {/* 06 · Licences, sources et engagements */}
        <Chapter id="engagements">
          <div className="xp-screen guard-wrap">
            <ScreenHead chapter="engagements" name={copy.chapters.engagements} title={copy.commitments.title} lead={copy.commitments.lead} id="engagements-title" />
            <ul className="fl-badges">
              {copy.commitments.badges.map((badge, index) => {
                const body = (<><strong>{badge.value}</strong><span>{badge.caption}</span></>);
                return (
                  <li key={badge.id} className="reveal" data-delay={String(Math.min(index + 2, 5))}>
                    {"link" in badge && badge.link ? (
                      <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="fl-badge fl-badge--link" aria-label={`${copy.commitments.source} : ${badge.value}`}>
                        {body}
                        <span className="fl-badge__go" aria-hidden="true">↗</span>
                      </SiteLink>
                    ) : (
                      <div className="fl-badge">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Chapter>

        {/* 07 · Questions, puis l'appel final. */}
        <Chapter id="questions" className="xp-chapter--faq">
          <div className="xp-screen guard-wrap fl-faq">
            <ScreenHead chapter="questions" name={copy.chapters.questions} title={copy.faq.title} id="questions-title" />
            <div className="fl-faq__list reveal" data-delay="2">
              {copy.faq.items.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Chapter>

        <section className="xp-final" aria-labelledby="fl-final-title">
          <div className="xp-cover__grid" aria-hidden="true" />
          <div className="guard-wrap xp-final__inner reveal">
            <h2 id="fl-final-title">{copy.final.title}</h2>
            <p>{copy.final.lead}</p>
            <div className="xp-actions xp-actions--center">
              <a className="xp-btn" href={FLEET_CONTACT}>{copy.final.demo}</a>
              <a className="xp-btn xp-btn--ghost" href={FLEET_PRICE_CONTACT}>{copy.final.price}</a>
            </div>
            <small>{copy.final.note}</small>
          </div>
        </section>
      </main>
      <SiteFooter site="fleet" />
    </div>
  );
}
