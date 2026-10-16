"use client";

import { useEffect, useRef, useState } from "react";
import { glideTo } from "@/components/home/motion";

type Chapter = { readonly id: string; readonly n: string; readonly name: string };

/**
 * L'indicateur de progression : sur ordinateur, un rail discret à droite (numéro du
 * chapitre, son nom au survol et pour le chapitre en cours) ; sur téléphone, un trait
 * en haut de l'écran. Il apparaît après la couverture. Le défilement lu par
 * `requestAnimationFrame` ne modifie qu'une propriété CSS : aucun recalcul de mise en page.
 */
export function PitchProgress({ chapters, label }: { chapters: readonly Chapter[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = chapters.map((c) => document.getElementById(c.id)).filter((s): s is HTMLElement => s !== null);
    const cover = document.getElementById("promesse");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(entry.target.id === "promesse" ? null : entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    if (cover) observer.observe(cover);

    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      root.current?.style.setProperty("--xp-read", ratio.toFixed(4));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(paint); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    paint();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [chapters]);

  return (
    <div ref={root} className="xp-progress" data-visible={active !== null}>
      <span className="xp-progress__line" aria-hidden="true" />
      <nav className="xp-progress__rail" aria-label={label}>
        <ol>
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`} onClick={glideTo} aria-current={active === chapter.id ? "step" : undefined}>
                <span className="xp-progress__n">{chapter.n}</span>
                <span className="xp-progress__name">{chapter.name}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
