"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { FLEET_CONSOLE } from "./fleet-copy";

type Shot = (typeof FLEET_CONSOLE)[keyof typeof FLEET_CONSOLE];
type Mark = { readonly label: string; readonly box: readonly [number, number, number, number]; readonly dashed?: boolean };
type Tab = { readonly id: string; readonly label: string; readonly shot: Shot; readonly alt: string; readonly marks: readonly Mark[]; readonly side: ReactNode };

/** Une capture dans un cadre de navigateur, avec la mention de démonstration et l'encadré de lecture. */
function Frame({ shot, alt, marks, demo }: { shot: Shot; alt: string; marks: readonly Mark[]; demo: string }) {
  return (
    <figure className="fl-frame">
      <figcaption className="fl-frame__bar">
        <span className="fl-frame__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="fl-frame__url">{shot.url}</span>
        <span className="xp-pill xp-pill--demo">{demo}</span>
      </figcaption>
      <div className="fl-frame__shot">
        <Image src={shot.src} alt={alt} width={shot.width} height={shot.height} sizes="(max-width: 1100px) 100vw, 860px" />
        {marks.map((mark) => {
          const [left, top, width, height] = mark.box;
          const style = { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` } as CSSProperties;
          return <span key={mark.label} className="fl-frame__mark" data-dashed={mark.dashed ? "" : undefined} style={style} aria-hidden="true"><em>{mark.label}</em></span>;
        })}
      </div>
    </figure>
  );
}

/**
 * La console en onglets (Coûts, Sièges) : des onglets ARIA, flèches gauche et droite,
 * Début et Fin. Chaque capture porte « Démonstration · données illustratives ».
 */
export function FleetConsole({ tabs, label, demo }: { tabs: readonly Tab[]; label: string; demo: string }) {
  const [current, setCurrent] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1;
    const next = { ArrowRight: current === last ? 0 : current + 1, ArrowLeft: current === 0 ? last : current - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setCurrent(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className="fl-console">
      <div className="fl-console__tabs" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => { buttons.current[index] = node; }}
            type="button"
            role="tab"
            id={`fl-tab-${tab.id}`}
            aria-selected={index === current}
            aria-controls={`fl-panel-${tab.id}`}
            tabIndex={index === current ? 0 : -1}
            onClick={() => setCurrent(index)}
            onKeyDown={onKey}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div key={tab.id} className="fl-console__panel" role="tabpanel" id={`fl-panel-${tab.id}`} aria-labelledby={`fl-tab-${tab.id}`} hidden={index !== current}>
          <Frame shot={tab.shot} alt={tab.alt} marks={tab.marks} demo={demo} />
          <div className="fl-console__side">{tab.side}</div>
        </div>
      ))}
    </div>
  );
}
