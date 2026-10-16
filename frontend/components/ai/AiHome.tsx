"use client";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { AI_CONTACT, AI_COPY } from "./ai-copy";

/**
 * La page d'accueil de la division IA (`ai.xsom.fr`), dans la charte de fleet.xsom.fr
 * (`.xp`, `app/pitch.css`) : qui nous sommes, nos produits (xSOM Fleet en vedette, puis
 * Secret Guard), nos prestations de conseil IA en quelques lignes, le contact.
 */
export function AiHome() {
  const { lang } = useT();
  const copy = AI_COPY[lang];
  const fleet = copy.products.fleet;
  const guard = copy.products.guard;

  return (
    <div className="guard-landing xhome xp xai">
      <SiteHeader site="ai" actions={[{ label: copy.hero.contact, href: AI_CONTACT, variant: "solid" }]} />
      <main>
        <section id="intro" className="xp-cover ai-cover" aria-labelledby="ai-title">
          <div className="xp-cover__grid" aria-hidden="true" />
          <div className="guard-wrap">
            <h1 id="ai-title" className="xp-cover__title ai-cover__title reveal">{copy.hero.title}</h1>
            <p className="xp-cover__lead reveal" data-delay="1">{copy.hero.lead}</p>
            <div className="xp-actions reveal" data-delay="2">
              <SiteLink to={{ site: "fleet" }} className="xp-btn">{copy.hero.fleet}</SiteLink>
              <a className="xp-btn xp-btn--ghost" href={AI_CONTACT}>{copy.hero.contact}</a>
            </div>
          </div>
        </section>

        <section id="produits" className="xp-chapter" aria-labelledby="ai-products-title">
          <div className="xp-screen guard-wrap">
            <header className="xp-head">
              <p className="xp-mark reveal"><span className="xp-mark__n">{copy.products.name}</span></p>
              <h2 id="ai-products-title" className="xp-head__title reveal" data-delay="1">{copy.products.title}</h2>
            </header>
            <div className="ai-products">
              <article className="ai-product ai-product--fleet reveal" data-delay="2">
                <p className="xp-pill xp-pill--pilot">{fleet.tag}</p>
                <h3>{fleet.name}</h3>
                <p className="ai-product__line">{fleet.line}</p>
                <ul className="ai-modules">
                  {fleet.modules.map((module) => (
                    <li key={module.name}>
                      <span className="ai-modules__tag">{module.tag}</span>
                      <span><strong>{module.name}</strong><small>{module.detail}</small></span>
                    </li>
                  ))}
                </ul>
                <SiteLink to={{ site: "fleet" }} className="xp-btn">{fleet.action}</SiteLink>
              </article>
              <article className="ai-product ai-product--guard reveal" data-delay="3">
                <p className="xp-pill xp-pill--ok">{guard.tag}</p>
                <h3>{guard.name}</h3>
                <p className="ai-product__line">{guard.line}</p>
                <ul className="ai-points">{guard.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <div className="ai-product__actions">
                  <SiteLink to={{ site: "guard" }} className="xp-btn xp-btn--ghost">{guard.action}</SiteLink>
                  <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="xp-link">{guard.source} <span aria-hidden="true">↗</span></SiteLink>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="prestations" className="xp-chapter" aria-labelledby="ai-services-title">
          <div className="xp-screen guard-wrap ai-services">
            <header className="xp-head">
              <p className="xp-mark reveal"><span className="xp-mark__n">{copy.services.name}</span></p>
              <h2 id="ai-services-title" className="xp-head__title reveal" data-delay="1">{copy.services.title}</h2>
              <p className="xp-head__lead reveal" data-delay="2">{copy.services.lead}</p>
            </header>
            <ul className="ai-services__list">
              {copy.services.items.map((item, index) => (
                <li key={item.name} className="ai-service reveal" data-delay={String(index + 2)}>
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
            <p className="reveal" data-delay="4">
              <SiteLink to={{ href: copy.services.moreHref }} className="xp-link">{copy.services.more} <span aria-hidden="true">↗</span></SiteLink>
            </p>
          </div>
        </section>

        <section id="contact" className="xp-final" aria-labelledby="ai-contact-title">
          <div className="xp-cover__grid" aria-hidden="true" />
          <div className="guard-wrap xp-final__inner reveal">
            <h2 id="ai-contact-title">{copy.contact.title}</h2>
            <p>{copy.contact.body}</p>
            <div className="xp-actions xp-actions--center">
              <a className="xp-btn" href={AI_CONTACT}>{copy.contact.button}</a>
              <SiteLink to={{ href: "https://www.xsom.fr" }} className="xp-btn xp-btn--ghost">{copy.contact.main} <span aria-hidden="true">↗</span></SiteLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter site="ai" />
    </div>
  );
}
