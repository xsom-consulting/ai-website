"use client";

import { useRef, type CSSProperties } from "react";
import { XsomMark } from "@/components/brand";
import { HomeFilm } from "@/components/home/HomeFilm";
import { ActivityIcon, CodeIcon, ServerIcon, ShieldCheckIcon, SlidersIcon, TerminalIcon } from "@/components/home/icons";
import { glideTo } from "@/components/home/motion";
import { useHomeReveal } from "@/components/home/useHomeReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { FLEET_CONTACT, FLEET_COPY, FLEET_HERO_MEDIA, FLEET_SIMULATION_CONTACT, fleetStepMedia } from "./fleet-copy";
import { LoopFilm } from "./LoopFilm";

const MODULE_ICONS = [SlidersIcon, ShieldCheckIcon, ServerIcon];
const WHY_ICONS = [ActivityIcon, SlidersIcon, ShieldCheckIcon];
const COMMITMENT_ICONS = [CodeIcon, ServerIcon, TerminalIcon, ShieldCheckIcon, ServerIcon, ActivityIcon];

/**
 * La page xSOM Fleet, servie à la racine de `fleet.xsom.fr`. Le film d'ouverture plein
 * cadre (`HomeFilm`), la promesse, la définition de la plateforme et ses trois modules,
 * « Pourquoi choisir xSOM Fleet » en trois cartes, les films « Comment ça marche », les
 * licences, sources et engagements, puis les questions fréquentes et le contact.
 * En-tête et style de l'accueil (`.xhome`) ; ce qui est propre à Fleet vit sous `.xfl`.
 */
export function FleetPage() {
  const root = useRef<HTMLDivElement>(null);
  useHomeReveal(root);
  const { lang } = useT();
  const copy = FLEET_COPY[lang];
  const title = (text: string) => ({ "--chars": text.length }) as CSSProperties;

  return (
    <div ref={root} className="guard-landing xhome xfl">
      <SiteHeader site="fleet" />
      <main>
        {/* Le film d'ouverture reste celui-ci jusqu'au rendu du nouveau scénario. */}
        <HomeFilm
          media={FLEET_HERO_MEDIA}
          next="#promesse"
          fallback={<><XsomMark className="fl-mark" /><p>xSOM Fleet</p><span>{copy.film.fallback}</span></>}
        />

        <section id="promesse" className="fl-hero" aria-labelledby="fl-title">
          <div className="guard-wrap fl-hero__inner">
            <p className="home-kicker">{copy.hero.kicker}</p>
            <h1 id="fl-title" className="fl-hero__title">
              {copy.hero.title[0]} <span>{copy.hero.title[1]}</span>
            </h1>
            <p className="fl-hero__lead">{copy.hero.lead}</p>
            <div className="fl-hero__actions">
              <a className="guard-button" href={FLEET_CONTACT}>{copy.hero.contact}</a>
              <a className="fl-hero__how" href="#fonctionnement" onClick={glideTo}>{copy.hero.how}</a>
            </div>
            <div className="fl-hero__hosts">
              <p>{copy.hero.hosts}</p>
              <ul>{copy.hero.hostList.map((host) => <li key={host}>{host}</li>)}</ul>
            </div>
          </div>
        </section>

        <section id="modules" className="fl-section" aria-labelledby="fl-platform-title">
          <div className="guard-wrap">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.platform.kicker}</p>
              <h2 id="fl-platform-title" className="fl-definition" data-reveal>
                {copy.platform.definition[0]} <span>{copy.platform.definition[1]}</span>
              </h2>
              <p className="fl-definition__next" data-reveal>{copy.platform.next}</p>
            </header>
            <ul className="fl-modules">
              {copy.platform.items.map((module, index) => {
                const Glyph = MODULE_ICONS[index];
                return (
                  <li key={module.name} className="fl-module" data-reveal>
                    <span className="fl-card__icon" aria-hidden="true"><Glyph /></span>
                    <p className="fl-module__status">{module.badge}</p>
                    <h3>{module.name}</h3>
                    <p className="fl-module__lead">{module.lead}</p>
                    <ul className="fl-ticks">{module.points.map((point) => <li key={point}>{point}</li>)}</ul>
                    {"engine" in module && module.engine ? (
                      <SiteLink to={{ site: "guard" }} className="fl-module__link">{module.engine} <span aria-hidden="true">↗</span></SiteLink>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <p className="fl-split" data-reveal>{copy.platform.note}</p>
          </div>
        </section>

        <section id="pourquoi" className="fl-section fl-section--tint" aria-labelledby="fl-why-title">
          <div className="guard-wrap">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.why.kicker}</p>
              <h2 id="fl-why-title" className="home-title" data-reveal style={title(copy.why.title)}>{copy.why.title}</h2>
            </header>
            <ul className="fl-why">
              {copy.why.items.map((item, index) => {
                const Glyph = WHY_ICONS[index];
                return (
                  <li key={item.id} className="fl-why__card" data-why={item.id} data-reveal>
                    <span className="fl-card__icon" aria-hidden="true"><Glyph /></span>
                    <h3>{item.name}</h3>
                    <p className="fl-why__lead">{item.lead}</p>
                    <ul className="fl-ticks">{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                    {"action" in item && item.action ? (
                      <div className="fl-why__action">
                        <a className="guard-button" href={FLEET_SIMULATION_CONTACT}>{item.action}</a>
                        <p>{item.actionNote}</p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Comment ça marche : cinq films courts pour l'instant. Un film unique les
            remplacera ; son emplacement sera ici, au-dessus de la liste, avec le même
            lecteur (`LoopFilm`) et la même mention « Démonstration · données
            illustratives ». Aucun lecteur n'est dessiné tant que le rendu n'existe pas. */}
        <section id="fonctionnement" className="fl-section" aria-labelledby="fl-how-title">
          <div className="guard-wrap">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.how.kicker}</p>
              <h2 id="fl-how-title" className="home-title" data-reveal style={title(copy.how.title)}>{copy.how.title}</h2>
            </header>
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
                      <p>{step.body[0]}</p>
                      <p>{step.body[1]}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section id="engagements" className="fl-section fl-section--ink" aria-labelledby="fl-commitments-title">
          <div className="guard-wrap">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.commitments.kicker}</p>
              <h2 id="fl-commitments-title" className="home-title" data-reveal style={title(copy.commitments.title)}>{copy.commitments.title}</h2>
              <p className="home-lead" data-reveal>{copy.commitments.lead}</p>
            </header>
            <ul className="fl-commitments">
              {copy.commitments.items.map((item, index) => {
                const Glyph = COMMITMENT_ICONS[index];
                return (
                  <li key={item.name} data-reveal>
                    <span className="fl-card__icon" aria-hidden="true"><Glyph /></span>
                    <h3>{item.name}</h3>
                    <p>{item.body}</p>
                    {"link" in item && item.link ? (
                      <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="fl-commitments__link">
                        {item.link} <span aria-hidden="true">↗</span>
                      </SiteLink>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <p className="fl-split" data-reveal>{copy.commitments.note}</p>
          </div>
        </section>

        <section id="questions" className="fl-section fl-section--tint" aria-labelledby="fl-faq-title">
          <div className="guard-wrap fl-faq">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.faq.kicker}</p>
              <h2 id="fl-faq-title" className="home-title" data-reveal style={title(copy.faq.title)}>{copy.faq.title}</h2>
            </header>
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
