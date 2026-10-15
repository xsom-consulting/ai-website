"use client";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/site/Brand";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteLink } from "@/components/site/SiteLink";
import { useT } from "@/lib/i18n";
import { SITE_UI, CONTACT_EMAIL } from "@/lib/site-copy";
import { MAIN_SITE_ORIGIN, type Site } from "@/lib/sites";

/** Shared navigation; the mobile menu is an inline disclosure, not a modal. */
export function SiteHeader({ site }: { site: Site }) {
  const { lang } = useT();
  const copy = SITE_UI[lang];
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <a className="web-skip" href="#main">
        {lang === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <div className="web-family">
        <div className="guard-wrap web-family__inner">
          <span>xSOM Consulting</span>
          <nav aria-label={lang === "fr" ? "Les sites xSOM" : "xSOM websites"}>
            <a href={`${MAIN_SITE_ORIGIN}${lang === "en" ? "/en/" : "/"}`}>
              {lang === "fr" ? "Le cabinet" : "Consulting"}
            </a>
            <SiteLink
              to={{ site: "ai" }}
              aria-current={site === "ai" ? "true" : undefined}
            >
              {lang === "fr"
                ? "Conseil & produits IA"
                : "AI services & products"}
            </SiteLink>
            <SiteLink
              to={{ site: "fleet" }}
              aria-current={site === "fleet" ? "true" : undefined}
            >
              xSOM Fleet
            </SiteLink>
          </nav>
        </div>
      </div>
      <header className="guard-header web-header">
        <div className="guard-wrap web-header__inner">
          <Brand site={site} />
          <button
            ref={toggle}
            type="button"
            className="web-toggle"
            aria-expanded={open}
            aria-controls="home-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? copy.closeMenu : copy.menu}
          </button>
          <div
            id="home-menu"
            className="web-menu"
            data-open={open}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            <SiteNav site={site} />
            <a
              className="web-button"
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(site === "fleet" ? "Démonstration xSOM Fleet" : "Projet IA")}`}
            >
              {lang === "fr"
                ? site === "fleet"
                  ? "Demander une démo"
                  : "Contact"
                : site === "fleet"
                  ? "Request a demo"
                  : "Contact"}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
