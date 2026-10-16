"use client";

import { glideTo } from "@/components/home/motion";
import { useFilmPlayback } from "@/components/home/useFilmPlayback";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { AI_CONTACT, AI_COPY, AI_HERO_FILM } from "./ai-copy";
import { AiProducts } from "./AiProducts";

/**
 * La page d'accueil de la division IA (`ai.xsom.fr`), dans la charte de fleet.xsom.fr
 * (`.xp`, `app/pitch.css`) : qui nous sommes, nos produits (xSOM Fleet en vedette, puis
 * Secret Guard), nos prestations de conseil IA en quelques lignes, le contact. La
 * couverture reprend celle de www.xsom.fr : un film plein cadre et ses deux portes,
 * produits et prestations, les deux premières entrées du menu.
 */
export function AiHome() {
  const { lang } = useT();
  const copy = AI_COPY[lang];

  return (
    <div className="guard-landing xhome xp xai">
      <SiteHeader site="ai" actions={[{ label: copy.hero.contact, href: AI_CONTACT, variant: "solid" }]} />
      <main>
        <section id="intro" className="ai-hero" aria-labelledby="ai-title">
          <HeroFilm pause={copy.hero.pause} play={copy.hero.play} />
          <div className="guard-wrap ai-hero__inner">
            <span className="ai-hero__rule reveal" aria-hidden="true" />
            <p className="ai-hero__kicker reveal">{copy.hero.kicker}</p>
            <h1 id="ai-title" className="ai-hero__title reveal" data-delay="1">{copy.hero.title}</h1>
            <p className="ai-hero__lead reveal" data-delay="2">{copy.hero.lead}</p>
            <div className="xp-actions reveal" data-delay="3">
              <a className="xp-btn ai-hero__primary" href="#produits" onClick={glideTo}>{copy.hero.products}</a>
              <a className="xp-btn xp-btn--ghost ai-hero__ghost" href="#prestations" onClick={glideTo}>{copy.hero.services}</a>
            </div>
          </div>
          <a className="ai-hero__next" href="#produits" onClick={glideTo} aria-label={copy.hero.next}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 9 8 7 8-7" /></svg>
          </a>
        </section>

        <AiProducts copy={copy.products} />

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

/**
 * Le film de la couverture, sous un voile qui garde le titre lisible. Il ne joue que
 * visible et jamais quand le mouvement est réduit (`useFilmPlayback`) : l'affiche reste
 * alors en place. Le bouton de pause le contrôle à tout moment.
 */
function HeroFilm({ pause, play }: { pause: string; play: string }) {
  const { video, playing, broken, toggle, events } = useFilmPlayback(AI_HERO_FILM.mp4, 0.2);
  return (
    <>
      <div className="ai-hero__media" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- l'affiche, servie telle quelle avant la vidéo */}
        <img src={AI_HERO_FILM.poster} width={1920} height={1080} alt="" fetchPriority="high" />
        <video
          ref={video}
          src={AI_HERO_FILM.mp4}
          poster={AI_HERO_FILM.poster}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          data-playing={playing}
          {...events}
        />
      </div>
      {broken ? null : (
        <button type="button" className="ai-hero__toggle" onClick={toggle} aria-label={playing ? pause : play} title={playing ? pause : play}>
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3" /></svg>
          )}
        </button>
      )}
    </>
  );
}
