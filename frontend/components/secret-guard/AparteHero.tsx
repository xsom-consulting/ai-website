"use client";

import { useT } from "@/lib/i18n";
import { MAIN_SITE_ORIGIN, SIGNUP_URL } from "@/lib/sites";
import { APARTE_COPY } from "./aparte-copy";
import { SECRET_GUARD_COPY } from "./secret-guard-copy";

/**
 * L'ouverture d'Aparté : la promesse en deux lignes, la phrase qui dit ce que fait le produit,
 * « Télécharger · 0 € » (l'inscription sur plateforme.xsom.fr, qui mène au téléchargement) et
 * l'essai sur le Mac de la page, puis quatre cartes : le prix, xSOM, la France, rien chez xSOM.
 */
export function AparteHero() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].hero;
  const { perks } = copy;
  return (
    <section id="inscription" className="ap-hero" aria-labelledby="ap-hero-title">
      <div className="ap-wrap">
        <h1 id="ap-hero-title">{copy.title[0]}<br /><span>{copy.title[1]}</span></h1>
        <p className="ap-lead">{copy.lead}</p>
        <div className="ap-cta">
          <a className="ap-btn ap-btn--big" href={SIGNUP_URL}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" /></svg>
            {copy.download} <span className="ap-price">{perks.free.big}</span>
          </a>
          <a className="ap-btn ap-btn--ghost ap-btn--big" href="#essayer">{copy.try}</a>
        </div>
        <p className="ap-sub">{copy.sub}</p>
        <div className="ap-perks">
          <div className="ap-perk ap-perk--zero"><span className="ap-bigp">{perks.free.big}</span><b>{perks.free.title}</b><span>{perks.free.body}</span></div>
          <a className="ap-perk" href={MAIN_SITE_ORIGIN}><span className="ap-em" aria-hidden="true">🛡️</span><b>{perks.xsom.title}</b><span>{perks.xsom.body}</span></a>
          <div className="ap-perk"><span className="ap-em" aria-hidden="true">🇫🇷</span><b>{perks.france.title}</b><span>{perks.france.body}</span></div>
          <div className="ap-perk"><span className="ap-em" aria-hidden="true">🔒</span><b>{perks.local.title}</b><span>{perks.local.body}</span></div>
        </div>
        <p className="ap-trademarks">{SECRET_GUARD_COPY[lang].hero.trademarks}</p>
      </div>
    </section>
  );
}
