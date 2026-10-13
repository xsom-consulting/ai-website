"use client";

import Link from "next/link";

import { Brand } from "@/components/site/Brand";
import { isExternal, SiteLink } from "@/components/site/SiteLink";
import { SignalPreferences } from "@/design-system/react";
import { useT } from "@/lib/i18n";
import { CONTACT_EMAIL, FOOTER_TAGLINE, LEGAL_LINKS, NAV, SITE_LINKS, SITE_UI, brandName } from "@/lib/site-copy";
import type { Site } from "@/lib/sites";
import "@/app/guard-footer.css";

/**
 * Le pied de page d'un site : son identité, ses rubriques, les quatre sites xSOM
 * (dont le site de conseil) et les pages légales, communes aux trois adresses.
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
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} ↗</a>
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
          <nav aria-label={ui.legal}>
            <h2>{ui.legal}</h2>
            {LEGAL_LINKS[lang].map((item) => <Link key={item.path} href={item.path}>{item.label}</Link>)}
          </nav>
        </div>
        <div className="studio-footer__bottom">
          <p>© {new Date().getFullYear()} xSOM Consulting · {brandName(site, lang)}</p>
          <details><summary>{ui.display}</summary><SignalPreferences lang={lang} /></details>
        </div>
      </div>
    </footer>
  );
}
