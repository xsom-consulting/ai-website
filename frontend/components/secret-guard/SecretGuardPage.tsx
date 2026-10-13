"use client";

import { useRef } from "react";
import { useHomeReveal } from "@/components/home/useHomeReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { SECRET_GUARD_COPY } from "./secret-guard-copy";
import { SgFlow } from "./SgFlow";
import { SgHero } from "./SgHero";

/**
 * La page Secret Guard (`guard.xsom.fr`), droit au but : ce que c'est, comment ça
 * marche, le code ouvert, où le moteur sert dans xSOM Fleet, et l'extension VS Code en
 * préparation. Elle reprend l'en-tête et le style de l'accueil (`.xhome`) ; ce qui lui
 * est propre vit sous `.xsg` (`secret-guard.css`).
 */
export function SecretGuardPage() {
  const root = useRef<HTMLDivElement>(null);
  useHomeReveal(root);
  const { lang } = useT();
  const copy = SECRET_GUARD_COPY[lang];
  return (
    <div ref={root} className="guard-landing xhome xsg">
      <SiteHeader site="guard" />
      <main>
        <SgHero />
        <SgFlow />

        <section id="open-source" className="sg-panel" aria-labelledby="sg-open-title">
          <div className="guard-wrap">
            <header className="sg-head">
              <p className="home-kicker" data-reveal>{copy.open.kicker}</p>
              <h2 id="sg-open-title" className="home-title" data-reveal style={{ "--chars": copy.open.title.length } as React.CSSProperties}>{copy.open.title}</h2>
            </header>
            <ul className="sg-points">
              {copy.open.points.map(([name, body]) => (
                <li key={name} data-reveal>
                  <h3>{name}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ul>
            <p className="sg-panel__action" data-reveal>
              <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="guard-button">{copy.open.action} <span aria-hidden="true">↗</span></SiteLink>
            </p>
          </div>
        </section>

        <section id="fleet" className="sg-panel sg-panel--tint" aria-labelledby="sg-fleet-title">
          <div className="guard-wrap sg-fleet">
            <p className="home-kicker" data-reveal>{copy.fleet.kicker}</p>
            <h2 id="sg-fleet-title" className="home-title" data-reveal style={{ "--chars": copy.fleet.title.length } as React.CSSProperties}>{copy.fleet.title}</h2>
            <p className="sg-fleet__body" data-reveal>{copy.fleet.body}</p>
            <p data-reveal>
              <SiteLink to={{ site: "fleet", path: "/#modules" }} className="guard-button">{copy.fleet.action} <span aria-hidden="true">↗</span></SiteLink>
            </p>
          </div>
        </section>

        <section className="sg-extension" aria-labelledby="sg-extension-title">
          <div className="guard-wrap">
            <h2 id="sg-extension-title" className="home-kicker">{copy.extension.kicker}</h2>
            <p>{copy.extension.body}</p>
          </div>
        </section>
      </main>
      <SiteFooter site="guard" />
    </div>
  );
}
