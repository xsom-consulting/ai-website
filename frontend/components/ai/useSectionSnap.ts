"use client";

import { useEffect } from "react";
import { motionReduced } from "@/components/home/motion";

/** Là où le défilement aimanté s'applique : un écran d'ordinateur assez haut (voir `ai-home.css`). */
const DESKTOP = "(min-width: 1001px) and (min-height: 640px)";
/** Le temps d'un passage d'une section à l'autre, puis le calme demandé avant le suivant. */
const TRAVEL_MS = 750;
const QUIET_MS = 180;

/**
 * Une section par geste de molette ou de pavé tactile. Le CSS aimante déjà la page
 * (`scroll-snap-type`) pour le clavier, la barre de défilement et le doigt ; mais un
 * petit cran de molette retombe sur la section de départ dans Chrome. Ici, un geste
 * vertical mène à la section suivante ou précédente, et l'inertie d'un pavé tactile ne
 * fait pas sauter deux sections. Une section plus haute que l'écran se lit d'abord en
 * entier ; un geste horizontal (le carrousel) et le zoom (Ctrl) restent au navigateur.
 */
export function useSectionSnap() {
  useEffect(() => {
    const desktop = matchMedia(DESKTOP);
    let lockedUntil = 0;
    let lastWheel = 0;

    const stops = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>(".xai main > section"));
      const tops = sections.map((section) => section.getBoundingClientRect().top + window.scrollY);
      const end = document.documentElement.scrollHeight - window.innerHeight;
      return { sections, tops: [...tops, end] };
    };

    const onWheel = (event: WheelEvent) => {
      if (!desktop.matches || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (Math.abs(event.deltaY) < 2) return;
      const now = performance.now();
      const locked = now < lockedUntil || now - lastWheel < QUIET_MS;
      lastWheel = now;
      if (locked) {
        event.preventDefault();
        return;
      }
      const { sections, tops } = stops();
      const y = window.scrollY;
      const down = event.deltaY > 0;
      const current = tops.reduce((best, top, index) => (Math.abs(top - y) < Math.abs(tops[best] - y) ? index : best), 0);
      // Une section plus haute que l'écran se parcourt d'abord normalement.
      const section = sections[current];
      if (section) {
        const box = section.getBoundingClientRect();
        if (down && box.bottom > window.innerHeight + 8) return;
        if (!down && box.top < -8) return;
      }
      const target = current + (down ? 1 : -1);
      if (target < 0 || target >= tops.length) return;
      event.preventDefault();
      lockedUntil = now + TRAVEL_MS;
      window.scrollTo({ top: tops[target], behavior: motionReduced() ? "auto" : "smooth" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
}
