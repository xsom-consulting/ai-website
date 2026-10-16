"use client";

import Link from "next/link";

import { Brand } from "@/components/site/Brand";
import { isExternal, SiteLink } from "@/components/site/SiteLink";
import { SignalPreferences } from "@/design-system/react";
import { useT } from "@/lib/i18n";
import { LinkedInMark } from "@/components/site/LinkedInMark";
import { FOOTER_TAGLINE, LEGAL_LINKS, LINKEDIN_URL, NAV, SITE_LINKS, SITE_UI } from "@/lib/site-copy";
import type { Site } from "@/lib/sites";
import "@/app/guard-footer.css";

/**
 * Le pied de page d'un site, harmonisé avec celui de www.xsom.fr : son identité, ses
 * rubriques, les sites xSOM, puis « Nous joindre » (le formulaire de demande, LinkedIn
 * et les pages légales, communes aux trois adresses). Aucune adresse email affichée :
 * le formulaire de ai.xsom.fr en tient lieu.
 */
export function SiteFooter({ site }: { site: Site }) {
  const { lang } = useT();
  const ui = SITE_UI[lang];
  return (
    <footer className="studio-footer">
      <div className="guard-wrap">
        <div className="studio-footer__grid">
          <div className="studio-footer__identity">
            <Brand site={site} />
            <p>{FOOTER_TAGLINE[site][lang]}</p>
          </div>
          <nav aria-label={ui.explore}>
            <h2>{ui.explore}</h2>
            {NAV[site][lang].filter((item) => !isExternal(item.to)).map((item) => (
              <SiteLink key={item.label} to={item.to}>{item.label}</SiteLink>
            ))}
          </nav>
          <nav aria-label={ui.sites}>
            <h2>{ui.sites}</h2>
            {SITE_LINKS[lang].map((item) => (
              <SiteLink key={item.label} to={item.to}>
                {item.label}
                {isExternal(item.to) ? " ↗" : ""}
              </SiteLink>
            ))}
          </nav>
          <nav aria-label={ui.reach}>
            <h2>{ui.reach}</h2>
            <SiteLink to={{ site: "ai", path: "/#demande" }}>{ui.write}</SiteLink>
            <a className="studio-footer__linkedin" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label={ui.linkedin}>
              <LinkedInMark />LinkedIn <span aria-hidden="true">↗</span>
            </a>
            {LEGAL_LINKS[lang].map((item) => <Link key={item.path} href={item.path}>{item.label}</Link>)}
          </nav>
        </div>
        <div className="studio-footer__bottom">
          <p>© {new Date().getFullYear()} xSOM Consulting — {ui.rights} · Bordeaux · France</p>
          <details><summary>{ui.display}</summary><SignalPreferences lang={lang} /></details>
        </div>
      </div>
    </footer>
  );
}
