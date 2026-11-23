"use client";

import { useRef } from "react";
import { useHomeReveal } from "@/components/home/useHomeReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY, SIGNUP_URL } from "@/lib/sites";
import { SECRET_GUARD_COPY, SECRET_GUARD_LICENCES } from "./secret-guard-copy";
import { AparteHero } from "./AparteHero";
import { ApHeader } from "./ApHeader";
import { SgCatalog, SgClients, SgEnd, SgExpurgation, SgFaq, SgProof } from "./SgAparte";
import { SgTry } from "./demo/SgTry";

const LICENCE_URL = { detection: SECRET_GUARD_LICENCES.apache, expurgation: SECRET_GUARD_LICENCES.polyform } as const;

/**
 * La page d'Aparté (`guard.xsom.fr`), dans l'identité de la maquette du 23/11 : la promesse et
 * le téléchargement à 0 €, le Mac à essayer, l'expurgation, les mesures, ce qui est protégé, ce
 * que l'on montre à ses clients, l'installation, xSOM Fleet pour une entreprise, puis le bandeau
 * 0 €, les licences exactes et les questions. Tout vit sous `.xsg` (`aparte.css`).
 */
export function SecretGuardPage() {
  const root = useRef<HTMLDivElement>(null);
  useHomeReveal(root);
  const { lang } = useT();
  const copy = SECRET_GUARD_COPY[lang];
  return (
    <div ref={root} className="guard-landing guard-home xhome xsg">
      <ApHeader />
      <main>
        <AparteHero />
        <SgTry />
        <SgExpurgation />
        <SgProof />
        <SgCatalog />
        <SgClients />

        <section id="installer" className="ap-block" aria-labelledby="ap-install-title">
          <div className="ap-wrap">
            <div className="ap-head"><h2 id="ap-install-title">{copy.install.title}</h2></div>
            <ol className="sg-steps ap-steps">
              {copy.install.steps.map((step, i) => (
                <li key={step.title}>
                  <span className="ap-exp__n">{String(i + 1).padStart(2, "0")}</span>
                  <b>{step.title}</b>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <ul className="sg-systems ap-systems">
              {copy.install.systems.map((system) => (
                <li key={system.key} data-key={system.key}>
                  <em>{system.tag}</em>
                  <h3>{system.name}</h3>
                  <p>{system.body}</p>
                </li>
              ))}
            </ul>
            <p className="sg-version ap-where">{copy.install.version}</p>
            <p className="ap-center"><a className="ap-btn ap-btn--big" href={SIGNUP_URL}>{copy.install.action}</a></p>
          </div>
        </section>

        <section id="fleet" className="ap-block" aria-labelledby="ap-fleet-title">
          <div className="ap-wrap">
            <div className="ap-fleet">
              <div>
                <h2 id="ap-fleet-title">{copy.fleet.title}</h2>
                <p className="ap-lede">{copy.fleet.body}</p>
              </div>
              <div>
                <ul>{copy.fleet.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <SiteLink to={{ site: "fleet" }} className="ap-btn ap-btn--ghost">{copy.fleet.action} <span aria-hidden="true">↗</span></SiteLink>
              </div>
            </div>
          </div>
        </section>

        <SgEnd />

        <section id="licences" className="ap-block" aria-labelledby="ap-licences-title">
          <div className="ap-wrap">
            <div className="ap-head"><h2 id="ap-licences-title">{copy.licences.title}</h2></div>
            <ul className="ap-licences">
              {copy.licences.items.map((item) => (
                <li key={item.key} data-key={item.key}>
                  <span className="ap-exp__n">{item.name} · <code>{item.path}</code></span>
                  <h3><SiteLink to={{ href: LICENCE_URL[item.key] }}>{item.licence} <span aria-hidden="true">↗</span></SiteLink></h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
            <p className="ap-center">
              <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="ap-btn ap-btn--ghost">{copy.licences.action} <span aria-hidden="true">↗</span></SiteLink>
            </p>
          </div>
        </section>

        <SgFaq />
      </main>
      <SiteFooter site="guard" />
    </div>
  );
}
