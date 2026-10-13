"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/components/site/Brand";
import { SiteNav } from "@/components/site/SiteNav";
import { useT } from "@/lib/i18n";
import { SITE_UI } from "@/lib/site-copy";
import type { Site } from "@/lib/sites";

type HeaderState = { solid: boolean; hidden: boolean };

/**
 * L'en-tête d'un site, posé sur le film d'ouverture sans le masquer : il devient opaque
 * dès qu'on défile, s'efface quand on descend au-delà du film et revient dès qu'on
 * remonte. La marque et le menu sont ceux du site (`Brand`, `SiteNav`).
 */
export function SiteHeader({ site }: { site: Site }) {
  const { lang } = useT();
  const copy = SITE_UI[lang];
  const [state, setState] = useState<HeaderState>({ solid: false, hidden: false });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const film = document.getElementById("home-film")?.offsetHeight ?? window.innerHeight;
      const delta = y - last;
      last = y;
      setState((previous) => {
        const solid = y > 24;
        const hidden = y < film * 0.8 ? false : Math.abs(delta) < 4 ? previous.hidden : delta > 0;
        return previous.solid === solid && previous.hidden === hidden ? previous : { solid, hidden };
      });
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    update();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header
      className="guard-header home-header"
      data-solid={state.solid || open}
      data-hidden={state.hidden && !open}
    >
      <div className="guard-wrap guard-header__inner home-header__inner">
        <Brand site={site} />
        <button
          type="button"
          className="home-header__toggle"
          aria-expanded={open}
          aria-controls="home-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? copy.closeMenu : copy.menu}
        </button>
        <div
          id="home-menu"
          className="home-header__menu"
          data-open={open}
          onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}
        >
          <SiteNav site={site} />
        </div>
      </div>
    </header>
  );
}
