"use client";

import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { FleetCapture } from "./FleetCapture";
import { FleetConsole } from "./FleetConsole";
import { FleetGuardDemo } from "./FleetGuardDemo";
import { FleetHowFilm } from "./FleetHowFilm";
import {
  FLEET_CONSOLE,
  FLEET_CONSOLE_URL,
  FLEET_CONTACT,
  FLEET_COPY,
  FLEET_GUARD_DEMO_MEDIA,
  FLEET_MEASUREMENT,
  FLEET_PRICE_CONTACT,
  FLEET_SIMULATION_CONTACT,
  fleetHowMedia,
} from "./fleet-copy";
import { FLEET_PRODUCT_COPY, type FLEET_SECTIONS } from "./fleet-product-copy";

type SectionId = (typeof FLEET_SECTIONS)[number];

/** Une section : un repère, un titre court, une phrase, puis sa preuve. */
function Section({ id, kicker, title, lead, children, tint = false }: { id: SectionId; kicker: string; title: string; lead?: string; children: ReactNode; tint?: boolean }) {
  return (
    <section id={id} className={`fp-section${tint ? " fp-section--tint" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="guard-wrap">
        <header className="fp-head">
          <p className="fp-kicker reveal">{kicker}</p>
          <h2 id={`${id}-title`} className="fp-title reveal" data-delay="1">{title}</h2>
          {lead ? <p className="fp-lead reveal" data-delay="2">{lead}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}

/**
 * La page produit de xSOM Fleet, servie à la racine de `fleet.xsom.fr` : la promesse et
 * ses deux appels, puis une section par Module (Sécurité, FinOps, Stratégie), les preuves
 * pour l'audit, le déploiement en trois étapes, la démo vidéo, les questions et l'appel
 * final. Chaque section porte une preuve concrète (capture réelle, mesure datée,
 * exemple) ; le détail technique est rangé sur `/details` ou dans un élément repliable.
 * Charte : celle de `ai.xsom.fr` (`pitch.css`), ce qui est propre ici vit sous `.fp`
 * (`fleet-product.css`).
 */
export function FleetProductPage() {
  const { lang } = useT();
  const copy = FLEET_PRODUCT_COPY[lang];
  const base = FLEET_COPY[lang];
  const hero = copy.hero;
  const consoleCopy = base.finops.console;
  const measure = base.finops.measure;

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
    <div className="guard-landing xhome xp xfl fp">
      <SiteHeader
        site="fleet"
        actions={[
          { label: base.signIn, href: FLEET_CONSOLE_URL, variant: "ghost" },
          { label: hero.demo, href: FLEET_CONTACT, variant: "solid" },
        ]}
      />
      <main>
        {/* La promesse, ses deux appels, et un exemple concret de ce que fait le produit. */}
        <section id="promesse" className="fp-hero" aria-labelledby="fp-title">
          <div className="guard-wrap fp-hero__grid">
            <div className="fp-hero__text">
              <p className="fp-kicker reveal">{hero.kicker}</p>
              <h1 id="fp-title" className="fp-hero__title reveal" data-delay="1">{hero.title}</h1>
              <p className="fp-hero__lead reveal" data-delay="2">{hero.lead}</p>
              <div className="xp-actions reveal" data-delay="3">
                <a className="xp-btn" href={FLEET_CONTACT}>{hero.demo}</a>
                <SiteLink to={{ site: "guard" }} className="xp-btn xp-btn--ghost fl-try-guard">{hero.guard} <span aria-hidden="true">→</span></SiteLink>
              </div>
              <p className="fp-hero__note reveal" data-delay="3">{hero.guardNote}</p>
            </div>
            <figure className="fp-example reveal" data-delay="2">
              <figcaption>{hero.example.label}</figcaption>
              <div className="fp-example__row">
                <span>{hero.example.typed}</span>
                <code>{hero.example.before}<mark data-risk="">{hero.example.value}</mark></code>
              </div>
              <div className="fp-example__row" data-safe="">
                <span>{hero.example.sent}</span>
                <code>{hero.example.before}<mark>{hero.example.substitute}</mark></code>
              </div>
              <p className="fp-example__note">{hero.example.note}</p>
            </figure>
          </div>
          <div className="guard-wrap fp-supported reveal" data-delay="4">
            <p className="fp-supported__label">{copy.supported.label}</p>
            <ul>
              {copy.supported.items.map((item) => (
                <li key={item.name}>{item.name}{"detail" in item ? <small>{item.detail}</small> : null}</li>
              ))}
            </ul>
            <p className="fp-supported__note">{copy.supported.trademarks}</p>
          </div>
        </section>

        {/* Sécurité : Fleet Guard, les deux captures vidéo réelles. */}
        <Section id="securite" kicker={copy.security.kicker} title={copy.security.title} lead={copy.security.lead}>
          <ul className="fp-points">
            {copy.security.points.map((point, index) => (
              <li key={point.title} className="reveal" data-delay={String(index + 1)}>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </li>
            ))}
          </ul>
          <div className="reveal"><FleetGuardDemo labels={base.guard.demo} media={FLEET_GUARD_DEMO_MEDIA} /></div>
          <p className="fp-more reveal"><SiteLink to={{ site: "fleet", path: "/details#securite" }} className="xp-link">{copy.security.more} <span aria-hidden="true">→</span></SiteLink></p>
        </Section>

        {/* FinOps : Fleet Sièges, la mesure réelle datée, puis la console. */}
        <Section id="finops" kicker={copy.finops.kicker} title={copy.finops.title} lead={copy.finops.lead} tint>
          <div className="fp-measure">
            <figure className="fp-measure__card reveal">
              <p className="fp-measure__top"><span className="xp-pill xp-pill--ok">{copy.finops.tag}</span><span>{copy.finops.when}</span></p>
              <p className="fp-measure__ratio"><strong>{copy.finops.ratio}</strong><span>{copy.finops.ratioLine}</span></p>
              <figcaption className="fp-measure__source">{copy.finops.source}</figcaption>
            </figure>
            <div className="fp-measure__capture reveal" data-delay="1">
              <FleetCapture image={FLEET_MEASUREMENT.capture} alt={measure.captureAlt} open={measure.capture} close={measure.captureClose} />
            </div>
          </div>
          <h3 className="fp-subtitle reveal">{copy.finops.console}</h3>
          {consoleCopy.consoleLanguage ? <p className="xp-caption">{consoleCopy.consoleLanguage}</p> : null}
          <div className="reveal"><FleetConsole tabs={consoleTabs} label={consoleCopy.tabs} demo={base.demo} /></div>
        </Section>

        {/* Stratégie : Fleet Gateway, trois canaux à comparer. */}
        <Section id="strategie" kicker={copy.strategy.kicker} title={copy.strategy.title} lead={copy.strategy.lead}>
          <p className="reveal"><span className="xp-pill xp-pill--pilot">{copy.strategy.pilot}</span></p>
          <ul className="fp-channels">
            {copy.strategy.channels.map((channel, index) => (
              <li key={channel.name} className="reveal" data-delay={String(index + 1)}>
                <h3>{channel.name}</h3>
                <p>{channel.body}</p>
                <small>{channel.proof}</small>
              </li>
            ))}
          </ul>
          <div className="fp-actions reveal">
            <a className="xp-btn xp-btn--ghost" href={FLEET_SIMULATION_CONTACT}>{copy.strategy.action}</a>
            <SiteLink to={{ site: "fleet", path: "/details#finops" }} className="xp-link">{copy.strategy.more} <span aria-hidden="true">→</span></SiteLink>
            <span className="xp-pill xp-pill--sim">{base.simulation}</span>
          </div>
        </Section>

        {/* Preuves pour l'audit : ce qui remonte, et ce qui ne quitte jamais le Poste. */}
        <Section id="audit" kicker={copy.audit.kicker} title={copy.audit.title} lead={copy.audit.lead} tint>
          <ul className="fp-points">
            {copy.audit.items.map((item, index) => (
              <li key={item.title} className="reveal" data-delay={String(index + 1)}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
          <details className="fp-fold reveal">
            <summary>{copy.audit.event}</summary>
            <pre className="fl-json">{"{\n  "}<span>&quot;ruleId&quot;</span>: <em>&quot;aws_access_key_id&quot;</em>,{"\n  "}<span>&quot;localFingerprint&quot;</span>: <em>&quot;9f2c…e41a&quot;</em>,{"\n  "}<span>&quot;decision&quot;</span>: <em>&quot;block&quot;</em>{"\n}"}</pre>
            <p className="xp-caption">{copy.audit.eventNote}</p>
          </details>
          <p className="fp-licences reveal">
            <span>{copy.audit.licences}</span>
            <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="xp-link">{copy.audit.source} <span aria-hidden="true">↗</span></SiteLink>
          </p>
        </Section>

        {/* Déploiement : trois étapes concrètes. */}
        <Section id="deploiement" kicker={copy.deploy.kicker} title={copy.deploy.title}>
          <ol className="fp-steps">
            {copy.deploy.steps.map((step, index) => (
              <li key={step.title} className="reveal" data-delay={String(index + 1)}>
                <span className="fp-steps__n" aria-hidden="true">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="fp-note reveal">{copy.deploy.pilot}</p>
        </Section>

        {/* La démo vidéo, plus bas : la page tient sans elle. */}
        <Section id="film" kicker={copy.film.kicker} title={base.film.title} lead={base.film.lead} tint>
          <div className="reveal">
            <FleetHowFilm key={lang} media={fleetHowMedia(lang)} chapters={base.film.steps} labels={{ ...base.film, demo: base.demo }} />
          </div>
        </Section>

        <section id="questions" className="fp-section" aria-labelledby="questions-title">
          <div className="guard-wrap fp-faq">
            <h2 id="questions-title" className="fp-title reveal">{copy.faq.title}</h2>
            <div className="fl-faq__list reveal" data-delay="1">
              {copy.faq.items.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="xp-final fp-final" aria-labelledby="fl-final-title">
          <div className="guard-wrap xp-final__inner reveal">
            <h2 id="fl-final-title">{copy.final.title}</h2>
            <p>{copy.final.lead}</p>
            <div className="xp-actions xp-actions--center">
              <a className="xp-btn" href={FLEET_CONTACT}>{copy.final.demo}</a>
              <a className="xp-btn xp-btn--ghost" href={FLEET_PRICE_CONTACT}>{copy.final.price}</a>
            </div>
            <p className="fp-final__more"><SiteLink to={{ site: "fleet", path: "/details" }} className="xp-link">{copy.final.details} <span aria-hidden="true">→</span></SiteLink></p>
          </div>
        </section>
      </main>
      <SiteFooter site="fleet" />
    </div>
  );
}
