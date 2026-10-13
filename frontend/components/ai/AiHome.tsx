"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { XsomMark } from "@/components/brand";
import { HomeExposure } from "@/components/home/HomeExposure";
import { HomeFilm } from "@/components/home/HomeFilm";
import { glideTo } from "@/components/home/motion";
import { useHomeReveal } from "@/components/home/useHomeReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { AI_CONTACT, AI_COPY, AI_HERO_MEDIA } from "./ai-copy";

/**
 * La page d'accueil de la division IA (`ai.xsom.fr`) : le film d'ouverture, ce que
 * xSOM est, ses prestations IA, ses deux produits, les équipes face à l'IA et le
 * contact. En-tête et style de l'accueil historique (`.xhome`) ; ce qui est propre à
 * cette page vit sous `.xai` (`app/ai.css`).
 */
export function AiHome() {
  const root = useRef<HTMLDivElement>(null);
  useHomeReveal(root);
  const { lang } = useT();
  const copy = AI_COPY[lang];
  const title = (text: string) => ({ "--chars": text.length }) as CSSProperties;

  return (
    <div ref={root} className="guard-landing xhome xai">
      <SiteHeader site="ai" />
      <main>
        <HomeFilm
          media={AI_HERO_MEDIA}
          next="#intro"
          fallback={<><XsomMark className="ai-mark" /><p>xSOM · {lang === "fr" ? "IA" : "AI"}</p><span>{copy.film.fallback}</span></>}
        />

        <section id="intro" className="ai-intro" aria-labelledby="ai-title">
          <div className="guard-wrap ai-intro__inner">
            <p className="home-kicker">{copy.intro.kicker}</p>
            <h1 id="ai-title" className="ai-intro__title">{copy.intro.title}</h1>
            <p className="ai-intro__lead">{copy.intro.lead}</p>
            <div className="ai-intro__actions">
              <a className="guard-button" href="#prestations" onClick={glideTo}>{copy.intro.services}</a>
              <a className="ai-intro__link" href="#produits" onClick={glideTo}>{copy.intro.products}</a>
            </div>
          </div>
        </section>

        <section id="prestations" className="ai-section" aria-labelledby="ai-services-title">
          <div className="guard-wrap">
            <header className="ai-head">
              <p className="home-kicker" data-reveal>{copy.services.kicker}</p>
              <h2 id="ai-services-title" className="home-title" data-reveal style={title(copy.services.title)}>{copy.services.title}</h2>
              <p className="home-lead" data-reveal>{copy.services.lead}</p>
            </header>
            <ul className="ai-cards">
              {copy.services.items.map((item) => (
                <li key={item.name} className="ai-card" data-reveal>
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                  <ul className="ai-tags">{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </li>
              ))}
            </ul>
            <div className="ai-more" data-reveal>
              <a className="guard-button" href={copy.services.moreHref} target="_blank" rel="noreferrer">{copy.services.more} <span aria-hidden="true">↗</span></a>
              <a className="ai-intro__link" href={AI_CONTACT}>{copy.services.contact}</a>
            </div>
          </div>
        </section>

        <section id="produits" className="ai-section ai-section--tint" aria-labelledby="ai-products-title">
          <div className="guard-wrap">
            <header className="ai-head">
              <p className="home-kicker" data-reveal>{copy.products.kicker}</p>
              <h2 id="ai-products-title" className="home-title" data-reveal style={title(copy.products.title)}>{copy.products.title}</h2>
              <p className="home-lead" data-reveal>{copy.products.lead}</p>
            </header>
            <div className="ai-products">
              <article className="ai-product" data-reveal>
                <p className="ai-product__badge">{copy.products.fleet.badge}</p>
                <h3>{copy.products.fleet.name}</h3>
                <p>{copy.products.fleet.body}</p>
                <ul className="ai-modules">
                  {copy.products.fleet.modules.map(([name, detail]) => (
                    <li key={name}><strong>{name}</strong><span>{detail}</span></li>
                  ))}
                </ul>
                <SiteLink to={{ site: "fleet" }} className="guard-button">{copy.products.fleet.action} <span aria-hidden="true">↗</span></SiteLink>
              </article>
              <article className="ai-product" data-reveal>
                <p className="ai-product__badge">{copy.products.guard.badge}</p>
                <h3>{copy.products.guard.name}</h3>
                <p>{copy.products.guard.body}</p>
                <ul className="ai-points">
                  {copy.products.guard.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
                <div className="ai-product__actions">
                  <SiteLink to={{ site: "guard" }} className="guard-button">{copy.products.guard.action} <span aria-hidden="true">↗</span></SiteLink>
                  <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="ai-intro__link">{copy.products.guard.source} ↗</SiteLink>
                </div>
              </article>
            </div>
          </div>
        </section>

        <HomeExposure />

        <aside className="guard-glossary-link guard-wrap reveal">
          <span className="guard-glossary-link__icon" aria-hidden="true">Aa</span>
          <div><h3>{copy.glossary.title}</h3><p>{copy.glossary.body}</p></div>
          <Link href="/menaces">{copy.glossary.action} ↗</Link>
        </aside>

        <section className="ai-contact" aria-labelledby="ai-contact-title">
          <div className="guard-wrap ai-contact__inner" data-reveal>
            <h2 id="ai-contact-title">{copy.contact.title}</h2>
            <p>{copy.contact.body}</p>
            <div className="ai-contact__actions">
              <a className="guard-button" href={AI_CONTACT}>{copy.contact.button}</a>
              <SiteLink to={{ href: "https://www.xsom.fr" }} className="ai-contact__main">{copy.contact.main} ↗</SiteLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter site="ai" />
    </div>
  );
}
