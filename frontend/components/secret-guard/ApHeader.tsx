"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { MAIN_SITE_ORIGIN, SECRET_GUARD_REPOSITORY, SIGNUP_URL } from "@/lib/sites";
import { SITE_UI } from "@/lib/site-copy";
import { APARTE_COPY } from "./aparte-copy";

/** Le logo d'Aparté : un chevron, puis le bandeau bleu qui masque. */
export function ApMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M3.5 10.5L13 16L3.5 21.5" fill="none" stroke="currentColor" strokeWidth="3.6" />
      <rect x="16.5" y="13.6" width="12.5" height="4.8" rx="1" fill="#015fce" />
    </svg>
  );
}

/**
 * L'en-tête d'Aparté : le logo, le menu, xSOM Consulting, et « Télécharger · 0 € » toujours
 * visible. Sous 1040 px, le menu passe dans un tiroir ouvert par le bouton à trois traits.
 */
export function ApHeader() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].header;
  const hero = APARTE_COPY[lang].hero;
  const [open, setOpen] = useState(false);
  const links = (
    <>
      {copy.nav.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a href={SECRET_GUARD_REPOSITORY}>{copy.docs}</a>
      <a className="ap-top__xsom" href={MAIN_SITE_ORIGIN}>{copy.xsom} <span aria-hidden="true">↗</span></a>
    </>
  );
  return (
    <header className="ap-top">
      <div className="ap-wrap ap-top__bar">
        <a className="ap-brand" href="#" aria-label={copy.home}>
          <ApMark />
          <b>Aparté</b>
          <small>{copy.by}</small>
        </a>
        <nav className="ap-top__nav" aria-label={SITE_UI[lang].mainNav}>{links}</nav>
        <span className="ap-top__end">
          <a className="ap-btn ap-btn--sm" href={SIGNUP_URL}>{hero.download} <span className="ap-price">{hero.perks.free.big}</span></a>
          <button className="ap-burger" type="button" aria-label={copy.menu} aria-expanded={open} aria-controls="ap-mnav" onClick={() => setOpen(!open)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </span>
      </div>
      <nav id="ap-mnav" className="ap-mnav" data-open={open || undefined} aria-label={copy.menu}>{links}</nav>
    </header>
  );
}
