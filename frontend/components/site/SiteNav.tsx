"use client";

import { isExternal, SiteLink } from "@/components/site/SiteLink";
import { LanguageToggle, useT } from "@/lib/i18n";
import { NAV, SITE_UI } from "@/lib/site-copy";
import type { Site } from "@/lib/sites";

/** Le menu d'un site, suivi du sélecteur de langue. */
export function SiteNav({ site }: { site: Site }) {
  const { lang } = useT();
  return (
    <div className="guard-nav-shell">
      <nav aria-label={SITE_UI[lang].mainNav}>
        {NAV[site][lang].filter((item) => "site" in item.to && item.to.site === site).map((item) => (
          <SiteLink key={item.label} to={item.to} className="guard-nav__link">
            {item.label}
            {isExternal(item.to) ? <span aria-hidden="true">↗</span> : null}
          </SiteLink>
        ))}
      </nav>
      <LanguageToggle />
    </div>
  );
}
