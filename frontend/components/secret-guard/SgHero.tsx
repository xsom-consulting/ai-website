"use client";

import { useEffect, useRef } from "react";
import { glideTo, motionReduced } from "@/components/home/motion";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_REPOSITORY } from "@/lib/sites";
import { SECRET_GUARD_COPY, SECRET_GUARD_HERO_MEDIA } from "./secret-guard-copy";

/**
 * L'ouverture : la promesse en deux lignes, le lien vers le code, la façon de lire la
 * page. La vidéo d'ambiance ne joue que si le mouvement n'est pas réduit ; sinon, son
 * affiche suffit et rien n'est téléchargé.
 */
export function SgHero() {
  const { lang } = useT();
  const copy = SECRET_GUARD_COPY[lang].hero;
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = video.current;
    if (media && !motionReduced()) void media.play().catch(() => undefined);
  }, []);

  return (
    <section className="sg-hero" aria-labelledby="sg-title">
      <video
        ref={video}
        className="sg-hero__video"
        src={SECRET_GUARD_HERO_MEDIA.webm}
        poster={SECRET_GUARD_HERO_MEDIA.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={copy.video}
      />
      <div className="guard-wrap sg-hero__inner">
        <p className="home-kicker">{copy.kicker}</p>
        <h1 id="sg-title" className="sg-hero__title">
          {copy.title[0]}<br /><span>{copy.title[1]}</span>
        </h1>
        <p className="sg-hero__lead">{copy.lead}</p>
        <div className="sg-hero__actions">
          <SiteLink to={{ href: SECRET_GUARD_REPOSITORY }} className="guard-button">{copy.source} <span aria-hidden="true">↗</span></SiteLink>
          <a className="sg-hero__how" href="#fonctionnement" onClick={glideTo}>{copy.how}</a>
        </div>
      </div>
    </section>
  );
}
