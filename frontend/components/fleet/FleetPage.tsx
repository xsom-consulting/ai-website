"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { XsomMark } from "@/components/brand";
import { HomeFilm } from "@/components/home/HomeFilm";
import { glideTo } from "@/components/home/motion";
import { useHomeReveal } from "@/components/home/useHomeReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { CountUp } from "./CountUp";
import {
  FLEET_CONTACT,
  FLEET_COPY,
  FLEET_DEMO_FIGURES,
  FLEET_HERO_MEDIA,
  FLEET_PRICE_CONTACT,
  FLEET_SIMULATION_CONTACT,
  fleetStepMedia,
} from "./fleet-copy";
import { FleetHeroVisual } from "./FleetHeroVisual";
import { HOSTS } from "./hosts";
import { LoopFilm } from "./LoopFilm";

/** Longueur de l'arc de la jauge des Sièges (demi-cercle de rayon 80). */
const GAUGE_LENGTH = Math.PI * 80;

/**
 * La page xSOM Fleet, servie à la racine de `fleet.xsom.fr`. La promesse et son
 * illustration animée (`FleetHeroVisual`), la phrase qui définit la plateforme et ses
 * trois modules, le film d'ouverture, « Pourquoi choisir xSOM Fleet » en grille, les
 * films « Comment ça marche », les licences et engagements en badges, puis les
 * questions et le contact. En-tête et style de l'accueil (`.xhome`) ; ce qui est
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
              <div className="fl-hero__hosts">
                <p>{copy.hero.hosts}</p>
                <ul>
                  {HOSTS.map((host) => (
                    <li key={host.id}>
                      <span className="fl-logo" data-host={host.id}><Image src={host.logo} alt="" width={44} height={44} /></span>
                      {host.name}
                    </li>
                  ))}
                  <li><span className="fl-logo fl-logo--api" aria-hidden="true">API</span>{copy.hero.apps}</li>
                </ul>
              </div>
            </div>
            <FleetHeroVisual labels={copy.hero.visual} />
          </div>
        </section>

        <section id="modules" className="fl-platform" aria-labelledby="fl-platform-title">
          <div className="guard-wrap">
            <h2 id="fl-platform-title" className="fl-platform__punch" data-reveal>{copy.platform.punch}</h2>
            <p className="fl-platform__sub" data-reveal>{copy.platform.sub}</p>
            <ul className="fl-modules">
              {copy.platform.modules.map((module) => (
                <li key={module.name} className="fl-module" data-reveal>
                  <p className="fl-module__status">{copy.platform.badge}</p>
                  <h3>{module.name}</h3>
                  <p>{module.line}</p>
                  {"engine" in module && module.engine ? (
                    <SiteLink to={{ site: "guard" }} className="fl-module__link">{module.engine} <span aria-hidden="true">↗</span></SiteLink>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Le film d'ouverture reste celui-ci jusqu'au rendu du nouveau scénario. */}
        <HomeFilm
          media={FLEET_HERO_MEDIA}
          next="#pourquoi"
          fallback={<><XsomMark className="fl-mark" /><p>xSOM Fleet</p><span>{copy.film.fallback}</span></>}
        />

        <section id="pourquoi" className="fl-section" aria-labelledby="fl-why-title">
          <div className="guard-wrap">
            <h2 id="fl-why-title" className="home-title fl-title" data-reveal style={title(copy.why.title)}>{copy.why.title}</h2>
            <div className="fl-bento">
              <article className="fl-tile fl-tile--cost" data-reveal>
                <div className="fl-tile__text">
                  <h3>{copy.why.cost.name}</h3>
                  <p className="fl-tile__line">{copy.why.cost.line}</p>
                  <div className="fl-tile__action">
                    <a className="guard-button" href={FLEET_SIMULATION_CONTACT}>{copy.why.cost.action}</a>
                    <p>{copy.why.cost.actionNote}</p>
                  </div>
                </div>
                <figure className="fl-gauge">
                  <svg viewBox="0 0 180 100" aria-hidden="true">
                    <path className="fl-gauge__track" d="M10 90 A80 80 0 0 1 170 90" />
                    <path className="fl-gauge__fill" d="M10 90 A80 80 0 0 1 170 90" style={{ strokeDasharray: GAUGE_LENGTH }} />
                  </svg>
                  <p className="fl-gauge__value">
                    <CountUp value={FLEET_DEMO_FIGURES.seatCap} locale={locale} />
                    <span>/{FLEET_DEMO_FIGURES.seatCap}</span>
                  </p>
                  <figcaption>{copy.why.cost.gauge}</figcaption>
                  <p className="fl-demo">{copy.why.demo}</p>
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
                    <i style={{ "--w": "58%" } as CSSProperties} />
                  </div>
                  <div className="fl-bars__row" data-bar="estimate">
                    <span>{copy.why.finops.estimate} <em>{copy.why.finops.estimateTag}</em></span>
                    <i style={{ "--w": "100%" } as CSSProperties} />
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

        {/* Comment ça marche : cinq films courts pour l'instant. Un film unique les
            remplacera ; son emplacement sera ici, au-dessus de la liste, avec le même
            lecteur (`LoopFilm`) et la même mention « Démonstration · données
            illustratives ». Aucun lecteur n'est dessiné tant que le rendu n'existe pas. */}
        <section id="fonctionnement" className="fl-section fl-section--tint" aria-labelledby="fl-how-title">
          <div className="guard-wrap">
            <h2 id="fl-how-title" className="home-title fl-title" data-reveal style={title(copy.how.title)}>{copy.how.title}</h2>
            <ol className="fl-how">
              {copy.how.steps.map((step, index) => {
                const number = String(index + 1).padStart(2, "0");
                return (
                  <li key={step.id} id={`etape-${step.id}`} className="fl-how__step" data-reveal>
                    <figure className="fl-how__media">
                      <LoopFilm
                        media={{ ...fleetStepMedia(step.id, lang), label: step.film }}
                        play={`${copy.how.play} · ${step.title}`}
                        pause={`${copy.how.pause} · ${step.title}`}
                        fallback={<span>{number}</span>}
                      />
                      <figcaption>{copy.how.demo}</figcaption>
                    </figure>
                    <div className="fl-how__text">
                      <span className="fl-how__index" aria-hidden="true">{number}</span>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
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
