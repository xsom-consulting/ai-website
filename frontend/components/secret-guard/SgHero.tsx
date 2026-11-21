"use client";

import { useEffect, useRef } from "react";
import { glideTo, motionReduced } from "@/components/home/motion";
import { useT } from "@/lib/i18n";
import { SECRET_GUARD_COPY, SECRET_GUARD_DEMO_MEDIA, SECRET_GUARD_HERO_MEDIA } from "./secret-guard-copy";
import { SgDemoVideo } from "./SgDemoVideo";
import { SgSignup } from "./SgSignup";

/**
 * L'ouverture : la promesse, l'inscription gratuite, les assistants pris en charge, et
 * la place de la vidéo de démonstration. La vidéo d'ambiance ne joue que si le mouvement
 * n'est pas réduit ; sinon, son affiche suffit et rien n'est téléchargé.
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
    <section id="inscription" className="sg-hero" aria-labelledby="sg-title" data-demo={SECRET_GUARD_DEMO_MEDIA.available}>
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
        <div className="sg-hero__text">
          <p className="home-kicker">{copy.kicker}</p>
          <h1 id="sg-title" className="sg-hero__title">
            {copy.title[0]}{" "}<br /><span>{copy.title[1]}</span>
          </h1>
          <p className="sg-hero__lead">{copy.lead}</p>
          <SgSignup />
          <p className="sg-hero__assistants">{copy.assistants}</p>
          <p className="sg-hero__actions">
            <a className="sg-hero__how" href="#ce-que-ca-fait" onClick={glideTo}>{copy.how}</a>
          </p>
          <p className="sg-hero__trademarks">{copy.trademarks}</p>
        </div>
        <SgDemoVideo />
      </div>
    </section>
  );
}
