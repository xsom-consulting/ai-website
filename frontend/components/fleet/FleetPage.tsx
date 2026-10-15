"use client";

import { useRef, type CSSProperties } from "react";
import { glideTo } from "@/components/home/motion";
import { useHomeReveal } from "@/components/home/useHomeReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { CHATGPT_MARK, CLAUDE_MARK } from "./brand-marks";
import { CountUp } from "./CountUp";
import {
  FLEET_CONTACT,
  FLEET_COPY,
  FLEET_DEMO_FIGURES,
  FLEET_MEASUREMENT,
  FLEET_PRICE_CONTACT,
  FLEET_SIMULATION_CONTACT,
  codexMeasureLine,
  fleetHowMedia,
} from "./fleet-copy";
import { FleetCapture } from "./FleetCapture";
import { FleetHeroVisual } from "./FleetHeroVisual";
import { FleetHowFilm } from "./FleetHowFilm";

/** Une longueur de barre, en pourcentage de la plus longue (au moins un trait visible). */
const share = (part: number, whole: number) => `${Math.max((100 * part) / whole, 1.5).toFixed(1)}%`;
/** Tuile Coût : forfait et usage au tarif API mesurés chez xSOM, à l'échelle de l'usage Claude. */
const SCALE = FLEET_MEASUREMENT.claude.usageCents;
const CLAUDE_PLAN_WIDTH = share(FLEET_MEASUREMENT.claude.planCents, SCALE);
const CODEX_USAGE_WIDTH = share(FLEET_MEASUREMENT.codex.usageCents, SCALE);
/** Tuile FinOps : la Facture réelle contre l'Équivalent API estimé du Groupe de démonstration. */
const REAL_INVOICE_WIDTH = share(FLEET_DEMO_FIGURES.realInvoiceCents, FLEET_DEMO_FIGURES.apiEquivalentCents);

const vars = (value: Record<string, string>) => value as CSSProperties;

/**
 * La page xSOM Fleet, servie à la racine de `fleet.xsom.fr`. La promesse et son
 * illustration animée (`FleetHeroVisual`), la phrase qui définit la plateforme, la ligne
 * « Pris en charge » et les trois solutions, « Pourquoi choisir
 * xSOM Fleet » en grille, le film « Comment ça marche » et ses chapitres, les licences
 * et engagements en badges, puis les questions et le contact. En-tête et style de l'accueil (`.xhome`) ; ce qui est
 * propre à Fleet vit sous `.xfl`.
 */
export function FleetPage() {
  const root = useRef<HTMLDivElement>(null);
  useHomeReveal(root);
  const { lang } = useT();
  const copy = FLEET_COPY[lang];
  const locale = lang === "fr" ? "fr-FR" : "en-GB";
  const title = (text: string) => ({ "--chars": text.length }) as CSSProperties;
  const healthy = FLEET_DEMO_FIGURES.healthyPostes / FLEET_DEMO_FIGURES.postes;
  const supported = copy.platform.supported;
  const cost = copy.why.cost;

  return (
    <div ref={root} className="guard-landing xhome xfl">
      <SiteHeader site="fleet" />
      <main>
        <section id="promesse" className="fl-hero" aria-labelledby="fl-title">
          <div className="guard-wrap fl-hero__inner">
            <div className="fl-hero__text">
              <p className="fl-hero__badge">{copy.hero.badge}</p>
              <h1 id="fl-title" className="fl-hero__title">
                <span>{copy.hero.title[0]}</span> <span>{copy.hero.title[1]}</span>
              </h1>
              <p className="fl-hero__lead">{copy.hero.lead}</p>
              <div className="fl-hero__actions">
                <a className="guard-button" href={FLEET_CONTACT}>{copy.hero.contact}</a>
                <a className="fl-hero__how" href="#fonctionnement" onClick={glideTo}>{copy.hero.how}</a>
              </div>
            </div>
            <FleetHeroVisual labels={copy.hero.visual} />
          </div>
        </section>

        <section id="modules" className="fl-platform" aria-labelledby="fl-platform-title">
          <div className="guard-wrap">
            <h2 id="fl-platform-title" className="fl-platform__punch" data-reveal>
              {copy.platform.punch} <span>{copy.platform.rest}</span>
            </h2>
            <div className="fl-supported" data-reveal>
              <p className="fl-supported__label">{supported.label}</p>
              <div className="fl-supported__group">
                <p>{supported.subscriptions}</p>
                <ul>
                  <li>
                    <span className="fl-brand" data-brand="claude" aria-hidden="true"><svg viewBox="0 0 24 24"><path d={CLAUDE_MARK} /></svg></span>
                    <span>{supported.claude.name} <small>{supported.claude.product}</small></span>
                  </li>
                  <li>
                    <span className="fl-brand" data-brand="chatgpt" aria-hidden="true"><svg viewBox="0 0 24 24"><path d={CHATGPT_MARK} /></svg></span>
                    <span>{supported.chatgpt.name} <small>{supported.chatgpt.product}</small></span>
                  </li>
                </ul>
              </div>
              <div className="fl-supported__group">
                <p>{supported.gateway}</p>
                <ul>
                  <li>
                    <span className="fl-brand fl-brand--generic" aria-hidden="true">API</span>
                    <span>{supported.api.name} <small>{supported.api.detail}</small></span>
                  </li>
                  <li>
                    <span className="fl-brand fl-brand--generic" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><rect x="4" y="3.5" width="16" height="6" rx="1.5" /><rect x="4" y="14.5" width="16" height="6" rx="1.5" /><circle cx="8" cy="6.5" r="1" /><circle cx="8" cy="17.5" r="1" /></svg>
                    </span>
                    <span>{supported.hosted.name} <small>{supported.hosted.detail}</small></span>
                  </li>
                </ul>
              </div>
            </div>
            <ul className="fl-modules">
              {copy.platform.modules.map((module) => (
                <li key={module.name} className="fl-module" data-reveal>
                  <p className="fl-module__status">{copy.platform.badge}</p>
                  <h3>{module.title}</h3>
                  <p className="fl-module__name">{module.name}</p>
                  <p>{module.line}</p>
                  {"engine" in module && module.engine ? (
                    <SiteLink to={{ site: "guard" }} className="fl-module__link">{module.engine} <span aria-hidden="true">↗</span></SiteLink>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pourquoi" className="fl-section" aria-labelledby="fl-why-title">
          <div className="guard-wrap">
            <h2 id="fl-why-title" className="home-title fl-title" data-reveal style={title(copy.why.title)}>{copy.why.title}</h2>
            <div className="fl-bento">
              <article className="fl-tile fl-tile--cost" data-reveal>
                <div className="fl-tile__text">
                  <h3>{cost.name}</h3>
                  <p className="fl-tile__line">{cost.line}</p>
                  <div className="fl-tile__action">
                    <a className="guard-button" href={FLEET_SIMULATION_CONTACT}>{cost.action}</a>
                    <p>{cost.actionNote}</p>
                  </div>
                </div>
                {/* Mesure réelle de xSOM, datée, sourcée et montrée (relevé ccusage,
                    `FLEET_MEASUREMENT`, `CODEX_PLAN`) : ni moyenne, ni promesse. Un autre chiffre ne
                    s'ajoute qu'avec sa source. */}
                <figure className="fl-plan">
                  <p className="fl-plan__head">{cost.measure}</p>
                  <div className="fl-plan__agent">
                    <p className="fl-plan__name">
                      <span className="fl-brand" data-brand="claude" aria-hidden="true"><svg viewBox="0 0 24 24"><path d={CLAUDE_MARK} /></svg></span>
                      Claude
                      <b className="fl-plan__ratio" aria-hidden="true">{cost.ratio}</b>
                    </p>
                    <div className="fl-plan__bars" aria-hidden="true">
                      <div className="fl-plan__row" data-bar="plan"><span>{cost.plan}</span><i style={vars({ "--w": CLAUDE_PLAN_WIDTH })} /><b>{cost.claudePlan}</b></div>
                      <div className="fl-plan__row" data-bar="usage"><span>{cost.usage}</span><i style={vars({ "--w": "100%" })} /><b>{cost.claudeUsage}</b></div>
                    </div>
                    <p className="fl-plan__line">{cost.claudeLine}</p>
                  </div>
                  <div className="fl-plan__agent">
                    <p className="fl-plan__name">
                      <span className="fl-brand" data-brand="chatgpt" aria-hidden="true"><svg viewBox="0 0 24 24"><path d={CHATGPT_MARK} /></svg></span>
                      Codex
                    </p>
                    <div className="fl-plan__bars" aria-hidden="true">
                      <div className="fl-plan__row" data-bar="usage"><span>{cost.usage}</span><i style={vars({ "--w": CODEX_USAGE_WIDTH })} /><b>{cost.codexUsage}</b></div>
                    </div>
                    <p className="fl-plan__line">{codexMeasureLine(lang)}</p>
                  </div>
                  <FleetCapture image={FLEET_MEASUREMENT.capture} alt={cost.captureAlt} open={cost.capture} close={cost.captureClose} />
                  <figcaption>{cost.measureNote}</figcaption>
                </figure>
              </article>

              <article className="fl-tile fl-tile--price" data-reveal>
                <h3>{copy.why.price.name}</h3>
                <p className="fl-tile__line">{copy.why.price.line}</p>
                <a className="guard-button" href={FLEET_PRICE_CONTACT}>{copy.why.price.action}</a>
              </article>

              <article className="fl-tile fl-tile--finops" data-reveal>
                <h3>{copy.why.finops.name}</h3>
                <p className="fl-tile__line">{copy.why.finops.line}</p>
                <div className="fl-bars" aria-hidden="true">
                  <div className="fl-bars__row" data-bar="real">
                    <span>{copy.why.finops.real}</span>
                    <i style={vars({ "--w": REAL_INVOICE_WIDTH })} />
                  </div>
                  <div className="fl-bars__row" data-bar="estimate">
                    <span>{copy.why.finops.estimate} <em>{copy.why.finops.estimateTag}</em></span>
                    <i style={vars({ "--w": "100%" })} />
                  </div>
                </div>
                <p className="fl-stat">
                  <CountUp value={FLEET_DEMO_FIGURES.developers} locale={locale} /> {copy.why.finops.count}
                </p>
                <p className="fl-demo">{copy.why.demo}</p>
              </article>

              <article className="fl-tile fl-tile--security" data-reveal>
                <h3>{copy.why.security.name}</h3>
                <p className="fl-tile__line">{copy.why.security.line}</p>
                <div className="fl-shield" style={{ "--healthy": healthy } as CSSProperties}>
                  <svg viewBox="0 0 120 140" aria-hidden="true">
                    <circle className="fl-shield__pulse" cx="60" cy="70" r="56" />
                    <path className="fl-shield__body" d="M60 10 L104 28 V68 C104 98 84 120 60 130 C36 120 16 98 16 68 V28 Z" />
                    <path className="fl-shield__check" d="M40 70 l14 14 l27 -30" />
                  </svg>
                  <p className="fl-stat">
                    <strong><CountUp value={FLEET_DEMO_FIGURES.healthyPostes} locale={locale} />/{FLEET_DEMO_FIGURES.postes}</strong>
                    {copy.why.security.count}
                  </p>
                </div>
                <p className="fl-demo">{copy.why.demo}</p>
              </article>
            </div>
          </div>
        </section>

        <section id="fonctionnement" className="fl-section fl-section--tint" aria-labelledby="fl-how-title">
          <div className="guard-wrap">
            <h2 id="fl-how-title" className="home-title fl-title" data-reveal style={title(copy.how.title)}>{copy.how.title}</h2>
            <div data-reveal>
              <FleetHowFilm key={lang} media={fleetHowMedia(lang)} chapters={copy.how.steps} labels={copy.how} />
            </div>
          </div>
        </section>

        <section id="engagements" className="fl-section fl-section--ink" aria-labelledby="fl-commitments-title">
          <div className="guard-wrap">
            <h2 id="fl-commitments-title" className="home-title fl-title" data-reveal style={title(copy.commitments.title)}>{copy.commitments.title}</h2>
            <p className="fl-commitments__lead" data-reveal>{copy.commitments.lead}</p>
            <ul className="fl-badges">
              {copy.commitments.badges.map((badge) => {
                const body = (
                  <>
                    <strong>{badge.value}</strong>
                    <span>{badge.caption}</span>
                  </>
                );
                return (
                  <li key={badge.id} data-reveal>
                    {"link" in badge && badge.link ? (
                      <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="fl-badge" aria-label={`${copy.commitments.source} : ${badge.value}`}>
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
            <p className="fl-commitments__evidence" data-reveal>{copy.commitments.evidence}</p>
          </div>
        </section>

        <section id="questions" className="fl-section" aria-labelledby="fl-faq-title">
          <div className="guard-wrap fl-faq">
            <h2 id="fl-faq-title" className="home-title fl-title" data-reveal style={title(copy.faq.title)}>{copy.faq.title}</h2>
            <div className="fl-faq__list" data-reveal>
              {copy.faq.items.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
            <div className="fl-faq__contact" data-reveal>
              <a className="guard-button" href={FLEET_CONTACT}>{copy.faq.contact}</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter site="fleet" />
    </div>
  );
}
