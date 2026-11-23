"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useT } from "@/lib/i18n";
import { SIGNUP_URL } from "@/lib/sites";
import { APARTE_COPY } from "../aparte-copy";
import { loadEngine } from "./engine";
import { Desktop } from "./os";
import "@/app/aparte-demo.css";

const chars = (text: string) => ({ "--chars": text.length }) as CSSProperties;

/**
 * La démonstration : un poste macOS manipulable dans le navigateur. Le capot se lève quand le
 * Mac arrive à l'écran ; ensuite, Dock, fenêtres déplaçables, saisie. Chaque envoi passe par
 * le moteur d'Aparté (WebAssembly), chargé à l'arrivée sur la section.
 */
export function SgTry() {
  const { lang } = useT();
  const copy = APARTE_COPY[lang].tryIt;
  const mac = useRef<HTMLDivElement>(null);
  const desk = useRef<HTMLDivElement>(null);
  const desktop = useRef<Desktop | null>(null);
  const started = useRef(false);

  const start = () => {
    if (started.current || !desktop.current) return;
    started.current = true;
    void loadEngine().catch(() => undefined);
    desktop.current.open("notes");
    desktop.current.open("vscode");
  };

  useEffect(() => {
    const el = mac.current;
    if (!el || !desk.current) return;
    desktop.current = new Desktop(desk.current);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.75)));
      el.style.setProperty("--open", String(p));
      el.classList.toggle("opened", p >= 1);
      if (p > 0.2) start();
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);

  const run = (name: string) => {
    start();
    mac.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    desktop.current?.run(name);
  };

  return (
    <section id="essayer" className="sg-panel ap-try" aria-labelledby="sg-try-title">
      <div className="guard-wrap">
        <header className="sg-head">
          <p className="home-kicker" data-reveal>{copy.kicker}</p>
          <h2 id="sg-try-title" className="home-title" data-reveal style={chars(copy.title)}>{copy.title}</h2>
          <p className="sg-head__lead" data-reveal>{copy.lead}</p>
        </header>
        <div className="mac3d" ref={mac}>
          <div className="hinge">
            <div className="lid">
              <div className="face front"><div className="screen"><div className="desk" ref={desk} /></div></div>
              <div className="face back" aria-hidden="true" />
            </div>
          </div>
          <div className="deckwrap" aria-hidden="true"><div className="deck" /></div>
        </div>
        <div className="ap-tries" role="group" aria-label={copy.guided}>
          <span>{copy.guided}</span>
          {copy.tries.map(([key, label]) => <button key={key} type="button" onClick={() => run(key)}>{label}</button>)}
        </div>
        <p className="sg-panel__action ap-after">
          <span>{copy.after}</span>
          <a className="guard-button" href={SIGNUP_URL}>{copy.cta} <span aria-hidden="true">→</span></a>
        </p>
      </div>
    </section>
  );
}

