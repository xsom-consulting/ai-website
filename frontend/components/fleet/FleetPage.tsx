"use client";

import Image from "next/image";
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
import { FLEET_CONTACT, FLEET_COPY, FLEET_HERO_MEDIA, fleetStepMedia } from "./fleet-copy";
import { HOSTS } from "./hosts";
import { LoopFilm } from "./LoopFilm";

const NEVER_ICONS = [TerminalIcon, ShieldCheckIcon, ActivityIcon, CodeIcon];
const DEPLOY_ICONS = [ServerIcon, ShieldCheckIcon, SlidersIcon];
const MODULE_ICONS = [SlidersIcon, ShieldCheckIcon, ServerIcon];

/**
 * La page xSOM Fleet, servie à la racine de `fleet.xsom.fr`. Le film d'ouverture
 * plein cadre (`HomeFilm`), la promesse, la plateforme et ses trois modules, le
 * constat des deux factures, cinq films « Comment ça marche », les limites que xSOM
 * s'impose, les preuves, le déploiement, les questions fréquentes et l'appel final.
 * En-tête et style de l'accueil (`.xhome`), tuiles de logos des assistants ; ce qui est
 * propre à Fleet vit sous `.xfl`.
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
              <ul>
                {HOSTS.map((host) => (
                  <li key={host.id}>
                    <span className="fl-logo" data-host={host.id}><Image src={host.logo} alt="" width={44} height={44} /></span>
                    {host.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="modules" className="fl-section" aria-labelledby="fl-modules-title">
          <div className="guard-wrap">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.modules.kicker}</p>
              <h2 id="fl-modules-title" className="home-title" data-reveal style={title(copy.modules.title)}>{copy.modules.title}</h2>
              <p className="home-lead" data-reveal>{copy.modules.lead}</p>
            </header>
            <ul className="fl-modules">
              {copy.modules.items.map((module, index) => {
                const Glyph = MODULE_ICONS[index];
                return (
                  <li key={module.name} className="fl-module" data-status={module.status} data-reveal>
                    <span className="fl-card__icon" aria-hidden="true"><Glyph /></span>
                    <p className="fl-module__status">{module.badge}</p>
                    <h3>{module.name}</h3>
                    <p className="fl-module__lead">{module.lead}</p>
                    <ul>{module.points.map((point) => <li key={point}>{point}</li>)}</ul>
                    {"engine" in module && module.engine ? (
                      <SiteLink to={{ site: "guard" }} className="fl-module__link">{module.engine} <span aria-hidden="true">↗</span></SiteLink>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <p className="fl-split" data-reveal>{copy.modules.note}</p>
          </div>
        </section>

        <section className="fl-section" aria-labelledby="fl-cost-title">
          <div className="guard-wrap">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.cost.kicker}</p>
              <h2 id="fl-cost-title" className="home-title" data-reveal style={title(copy.cost.title)}>{copy.cost.title}</h2>
            </header>
            <div className="fl-bills" data-reveal>
              {([["api", copy.cost.api], ["seat", copy.cost.seat]] as const).map(([id, bill]) => (
                <article key={id} className="fl-bill" data-bill={id}>
                  <p className="fl-bill__label">{bill.label}</p>
                  <p className="fl-bill__value">{bill.value}</p>
                  <p className="fl-bill__unit">{bill.unit}</p>
                  <p className="fl-bill__source">{bill.source}</p>
                </article>
              ))}
            </div>
            <p className="fl-note" data-reveal>{copy.cost.note}</p>
            <p className="fl-split" data-reveal>{copy.cost.split}</p>
          </div>
        </section>

        <section id="fonctionnement" className="fl-section fl-section--tint" aria-labelledby="fl-how-title">
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

        <section className="fl-section" aria-labelledby="fl-never-title">
          <div className="guard-wrap">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.never.kicker}</p>
              <h2 id="fl-never-title" className="home-title" data-reveal style={title(copy.never.title)}>{copy.never.title}</h2>
            </header>
            <ul className="fl-grid">
              {copy.never.items.map(([name, body], index) => {
                const Glyph = NEVER_ICONS[index];
                return (
                  <li key={name} className="fl-card" data-reveal>
                    <span className="fl-card__icon" aria-hidden="true"><Glyph /></span>
                    <h3>{name}</h3>
                    <p>{body}</p>
                  </li>
                );
              })}
            </ul>
            <p className="fl-split" data-reveal>{copy.never.sent}</p>
          </div>
        </section>

        <section id="preuves" className="fl-section fl-section--ink" aria-labelledby="fl-proof-title">
          <div className="guard-wrap">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.proof.kicker}</p>
              <h2 id="fl-proof-title" className="home-title" data-reveal style={title(copy.proof.title)}>{copy.proof.title}</h2>
              <p className="home-lead" data-reveal>{copy.proof.lead}</p>
            </header>
            <ol className="fl-pieces">
              {copy.proof.items.map(([name, body], index) => (
                <li key={name} data-reveal>
                  <span className="fl-pieces__index" aria-hidden="true">{index + 1}</span>
                  <h3>{name}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
            <p className="fl-split" data-reveal>{copy.proof.note}</p>
          </div>
        </section>

        <section className="fl-section" aria-labelledby="fl-deploy-title">
          <div className="guard-wrap">
            <header className="fl-head">
              <p className="home-kicker" data-reveal>{copy.deploy.kicker}</p>
              <h2 id="fl-deploy-title" className="home-title" data-reveal style={title(copy.deploy.title)}>{copy.deploy.title}</h2>
            </header>
            <ul className="fl-principles">
              {copy.deploy.items.map(([name, body], index) => {
                const Glyph = DEPLOY_ICONS[index];
                return (
                  <li key={name} data-reveal>
                    <span className="fl-card__icon" aria-hidden="true"><Glyph /></span>
                    <h3>{name}</h3>
                    <p>{body}</p>
                  </li>
                );
              })}
            </ul>
            <h3 className="fl-subtitle" data-reveal>{copy.deploy.stepsTitle}</h3>
            <ol className="fl-steps">
              {copy.deploy.steps.map(([name, body], index) => (
                <li key={name} data-reveal>
                  <span className="fl-steps__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h4>{name}</h4>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
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
          </div>
        </section>

        <section className="fl-cta" aria-labelledby="fl-cta-title">
          <div className="guard-wrap fl-cta__inner" data-reveal>
            <h2 id="fl-cta-title">{copy.cta.title}</h2>
            <p>{copy.cta.body}</p>
            <a className="guard-button" href={FLEET_CONTACT}>{copy.cta.button}</a>
          </div>
        </section>
      </main>
      <SiteFooter site="fleet" />
    </div>
  );
}
