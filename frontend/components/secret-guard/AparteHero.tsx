"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/lib/i18n";
import { APARTE_COPY } from "./aparte-copy";
import { SECRET_GUARD_COPY } from "./secret-guard-copy";
import { SgSignup } from "./SgSignup";

/**
 * L'ouverture d'Aparté, sur fond clair : ce que fait le produit en une phrase, l'inscription
 * réelle (plateforme.xsom.fr), les trois étapes d'installation, et à droite l'exemple vivant :
 * ce que vous écrivez, puis ce que reçoit l'IA. La valeur d'exemple est visiblement inventée.
 */
export function AparteHero() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].hero;
  const card = useRef<HTMLDivElement>(null);

  // Le bandeau recouvre la valeur, puis la ligne « L'IA reçoit » apparaît ; en boucle, sauf
  // si le mouvement est réduit (l'état final s'affiche alors directement).
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.dataset.state = "sent"; return; }
    let timer = 0;
    const states = ["typed", "masked", "sent"] as const;
    let i = 0;
    const tick = () => {
      el.dataset.state = states[i];
      timer = window.setTimeout(() => { i = (i + 1) % states.length; tick(); }, states[i] === "sent" ? 4200 : 1400);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="inscription" className="ap-hero" aria-labelledby="ap-title">
      <div className="guard-wrap ap-hero__inner">
        <div className="ap-hero__text">
          <p className="home-kicker">{copy.kicker}</p>
          <h1 id="ap-title" className="ap-hero__title">{copy.title}</h1>
          <p className="ap-hero__lead">{copy.lead}</p>
          <SgSignup />
          <ol className="ap-hero__steps">
            {copy.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className="ap-hero__systems">{copy.systems}</p>
          <p className="ap-hero__trademarks">{SECRET_GUARD_COPY[lang].hero.trademarks}</p>
        </div>
        <div className="ap-hero__card" ref={card} data-state="typed" aria-label={`${copy.typed} / ${copy.sent}`}>
          <p className="ap-hero__label">{copy.typed}</p>
          <p className="ap-hero__line"><code>{copy.before}<span className="ap-hero__secret"><span>{copy.value}</span><i aria-hidden="true" /></span></code></p>
          <p className="ap-hero__label ap-hero__label--sent">{copy.sent}</p>
          <p className="ap-hero__line ap-hero__line--sent"><code>{copy.before}<mark>{copy.substitute}</mark></code></p>
          <p className="ap-hero__local">{copy.local}</p>
        </div>
      </div>
    </section>
  );
}
