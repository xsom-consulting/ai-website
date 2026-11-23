"use client";

import { useRef, type CSSProperties } from "react";
import { useHomeReveal } from "@/components/home/useHomeReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY, SIGNUP_URL } from "@/lib/sites";
import { SECRET_GUARD_COPY, SECRET_GUARD_LICENCES } from "./secret-guard-copy";
import { SgFlow } from "./SgFlow";
import { AparteHero } from "./AparteHero";
import { ApHeader } from "./ApHeader";
import { SgCatalog, SgExpurgation, SgFaq } from "./SgAparte";
import { SgTry } from "./demo/SgTry";

const LICENCE_URL = { detection: SECRET_GUARD_LICENCES.apache, expurgation: SECRET_GUARD_LICENCES.polyform } as const;

/**
 * La page Secret Guard (`guard.xsom.fr`), qui vend le produit en libre-service : la
 * promesse et l'inscription gratuite, ce que ça fait, comment l'installer, ce qui ne
 * quitte jamais la machine, les licences exactes, puis xSOM Fleet pour une entreprise.
 * Elle reprend l'en-tête et le style de l'accueil (`.xhome`) ; ce qui lui est propre vit
 * sous `.xsg` (`secret-guard.css`).
 */
export function SecretGuardPage() {
  const root = useRef<HTMLDivElement>(null);
  useHomeReveal(root);
  const { lang } = useT();
  const copy = SECRET_GUARD_COPY[lang];
  const chars = (text: string) => ({ "--chars": text.length }) as CSSProperties;
  return (
    <div ref={root} className="guard-landing guard-home xhome xsg">
      <ApHeader />
      <main>
        <AparteHero />

        <SgTry />

        <section id="ce-que-ca-fait" className="sg-panel" aria-labelledby="sg-does-title">
          <div className="guard-wrap">
            <header className="sg-head">
              <p className="home-kicker" data-reveal>{copy.does.kicker}</p>
              <h2 id="sg-does-title" className="home-title" data-reveal style={chars(copy.does.title)}>{copy.does.title}</h2>
              <p className="sg-head__lead" data-reveal>{copy.does.lead}</p>
            </header>
            <ul className="sg-cards">
              {copy.does.items.map((item) => (
                <li key={item.key} className="sg-card" data-key={item.key} data-reveal>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
            <figure className="sg-example" data-reveal>
              <figcaption>{copy.does.example.label}</figcaption>
              <p className="sg-code">
                <span>{copy.does.example.typed}</span>
                <code>{copy.does.example.before}<mark data-risk>{copy.does.example.value}</mark></code>
              </p>
              <p className="sg-code" data-safe>
                <span>{copy.does.example.sent}</span>
                <code className="sg-example__sent">{copy.does.example.before}<mark>{copy.does.example.substitute}</mark></code>
              </p>
            </figure>
          </div>
        </section>

        <SgExpurgation />

        <SgCatalog />

        <section id="installer" className="sg-panel sg-panel--tint" aria-labelledby="sg-install-title">
          <div className="guard-wrap">
            <header className="sg-head">
              <p className="home-kicker" data-reveal>{copy.install.kicker}</p>
              <h2 id="sg-install-title" className="home-title" data-reveal style={chars(copy.install.title)}>{copy.install.title}</h2>
            </header>
            <ol className="sg-steps">
              {copy.install.steps.map((step) => (
                <li key={step.title} data-reveal>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <ul className="sg-systems">
              {copy.install.systems.map((system) => (
                <li key={system.key} data-key={system.key} data-reveal>
                  <p className="sg-systems__tag">{system.tag}</p>
                  <h3>{system.name}</h3>
                  <p>{system.body}</p>
                </li>
              ))}
            </ul>
            <p className="sg-version" data-reveal>{copy.install.version}</p>
            <p className="sg-panel__action" data-reveal>
              <a className="guard-button" href={SIGNUP_URL}>{copy.install.action} <span aria-hidden="true">→</span></a>
            </p>
          </div>
        </section>

        <SgFlow />

        <section id="licences" className="sg-panel" aria-labelledby="sg-licences-title">
          <div className="guard-wrap">
            <header className="sg-head">
              <p className="home-kicker" data-reveal>{copy.licences.kicker}</p>
              <h2 id="sg-licences-title" className="home-title" data-reveal style={chars(copy.licences.title)}>{copy.licences.title}</h2>
            </header>
            <ul className="sg-points sg-licences">
              {copy.licences.items.map((item) => (
                <li key={item.key} data-key={item.key} data-reveal>
                  <p className="sg-licences__name">{item.name} · <code>{item.path}</code></p>
                  <h3><SiteLink to={{ href: LICENCE_URL[item.key] }}>{item.licence} <span aria-hidden="true">↗</span></SiteLink></h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
            <p className="sg-panel__action" data-reveal>
              <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="guard-button">{copy.licences.action} <span aria-hidden="true">↗</span></SiteLink>
            </p>
          </div>
        </section>

        <section id="fleet" className="sg-panel sg-panel--tint" aria-labelledby="sg-fleet-title">
          <div className="guard-wrap sg-fleet">
            <p className="home-kicker" data-reveal>{copy.fleet.kicker}</p>
            <h2 id="sg-fleet-title" className="home-title" data-reveal style={chars(copy.fleet.title)}>{copy.fleet.title}</h2>
            <p className="sg-fleet__body" data-reveal>{copy.fleet.body}</p>
            <ul className="sg-fleet__points" data-reveal>
              {copy.fleet.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <p data-reveal>
              <SiteLink to={{ site: "fleet" }} className="guard-button">{copy.fleet.action} <span aria-hidden="true">↗</span></SiteLink>
            </p>
          </div>
        </section>

        <SgFaq />
      </main>
      <SiteFooter site="guard" />
    </div>
  );
}
