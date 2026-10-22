"use client";

import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import type { Lang } from "@/lib/i18n";
import {
  ZONE_ORDER,
  isProduct,
  natureLabel,
  optionsOf,
  sourcesOf,
  stateDescription,
  stateLabel,
  zoneLabel,
  zoneSummary,
  type CatalogueOption,
  type ZoneId,
} from "./fleet-catalogue";

export type MapLabels = {
  readonly map: string;
  readonly zones: string;
  readonly group: string;
  readonly overview: string;
  readonly zoom: string;
  readonly hint: string;
  readonly count: (n: number) => string;
  readonly details: Readonly<Record<ZoneId, string>>;
  readonly flows: { readonly prompts: string; readonly bypass: string; readonly api: string; readonly hooks: string; readonly apiHooks: string; readonly events: string };
  readonly product: { readonly title: string; readonly hint: string };
  readonly consulting: { readonly title: string; readonly hint: string };
  readonly none: string;
  readonly more: string;
  readonly fields: { readonly covers: string; readonly limits: string; readonly prerequisites: string; readonly productPart: string; readonly consultingPart: string; readonly state: string; readonly module: string; readonly sources: string; readonly read: string };
  readonly inMatrix: string;
  readonly compare: string;
};

type Box = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
type Edge = { readonly d: string; readonly kind?: "bypass" | "hooks" | "events"; readonly both?: boolean; readonly label?: { readonly key: keyof MapLabels["flows"]; readonly x: number; readonly y: number; readonly anchor?: "start" | "middle" | "end"; readonly stack?: boolean } };
type Layout = {
  readonly box: readonly [number, number, number, number];
  readonly group: Box;
  readonly groupLabel: { readonly x: number; readonly y: number; readonly anchor: "start" | "end" };
  readonly zones: Readonly<Record<ZoneId, Box>>;
  readonly edges: readonly Edge[];
  readonly zoom: number;
};

/**
 * Deux mises en page du même schéma : large (bureau) et étroite (téléphone, 360 px de
 * large sans défilement horizontal). Le Groupe entoure ce qui est chez lui ; les Externes,
 * le cloud des Fournisseurs et la console sont dehors. Coordonnées en unités du viewBox.
 */
const WIDE: Layout = {
  box: [0, -18, 1012, 560],
  group: { x: 200, y: 24, w: 520, h: 512 },
  groupLabel: { x: 214, y: 41, anchor: "start" },
  zones: {
    externes: { x: 16, y: 60, w: 160, h: 150 },
    metiers: { x: 224, y: 72, w: 210, h: 150 },
    "postes-dev": { x: 224, y: 252, w: 210, h: 150 },
    proxy: { x: 466, y: 72, w: 110, h: 330 },
    serveurs: { x: 224, y: 430, w: 474, h: 90 },
    console: { x: 780, y: 60, w: 204, h: 150 },
    cloud: { x: 780, y: 250, w: 204, h: 270 },
  },
  edges: [
    { d: "M434 147 H462" },
    { d: "M434 327 H462" },
    { d: "M576 310 H776", label: { key: "prompts", x: 678, y: 300 } },
    { d: "M576 135 H776", kind: "events", label: { key: "events", x: 648, y: 110, stack: true } },
    { d: "M96 60 V0 H998 V385 H988", kind: "bypass", label: { key: "bypass", x: 460, y: -6 } },
    { d: "M698 462 H776", label: { key: "api", x: 738, y: 452 } },
    { d: "M780 496 H702", kind: "hooks", label: { key: "hooks", x: 750, y: 512, stack: true } },
  ],
  zoom: 1.7,
};

const NARROW: Layout = {
  box: [0, 0, 360, 706],
  group: { x: 24, y: 152, w: 312, h: 452 },
  groupLabel: { x: 322, y: 168, anchor: "end" },
  zones: {
    cloud: { x: 24, y: 12, w: 188, h: 120 },
    externes: { x: 228, y: 12, w: 116, h: 120 },
    proxy: { x: 40, y: 172, w: 280, h: 82 },
    metiers: { x: 40, y: 290, w: 132, h: 140 },
    "postes-dev": { x: 188, y: 290, w: 132, h: 140 },
    serveurs: { x: 40, y: 462, w: 280, h: 124 },
    console: { x: 24, y: 620, w: 320, h: 78 },
  },
  edges: [
    { d: "M106 290 V258" },
    { d: "M254 290 V258" },
    { d: "M118 172 V136", label: { key: "prompts", x: 126, y: 147, anchor: "start" } },
    { d: "M228 72 H216", kind: "bypass" },
    { d: "M40 524 H12 V72 H20", both: true },
    { d: "M320 213 H350 V659 H348", kind: "events" },
  ],
  zoom: 1.5,
};

const NARROW_QUERY = "(max-width: 720px)";
const subscribe = (notify: () => void) => {
  const query = window.matchMedia(NARROW_QUERY);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

/** Coupe un libellé en deux lignes, à l’espace le plus proche du milieu. */
function halves(text: string) {
  const middle = text.length / 2;
  let cut = -1;
  for (let index = text.indexOf(" "); index !== -1; index = text.indexOf(" ", index + 1)) {
    if (cut === -1 || Math.abs(index - middle) < Math.abs(cut - middle)) cut = index;
  }
  return cut === -1 ? [text] : [text.slice(0, cut), text.slice(cut + 1)];
}

/** Coupe un libellé en lignes d’au plus `max` caractères, sans couper un mot. */
function wrap(text: string, max: number) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines.at(-1);
    if (last !== undefined && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

function Zone({ id, box, label, detail, count, selected, focusable, onSelect, onKey, setRef }: {
  id: ZoneId;
  box: Box;
  label: string;
  detail: string;
  count: string;
  selected: boolean;
  focusable: boolean;
  onSelect: () => void;
  onKey: (event: KeyboardEvent<SVGGElement>) => void;
  setRef: (node: SVGGElement | null) => void;
}) {
  // Largeur moyenne d’un caractère : 9 unités pour le titre (16 px), 7 pour le détail (13 px).
  const lines = wrap(label, Math.max(8, Math.floor((box.w - 28) / 9)));
  const details = wrap(detail, Math.max(10, Math.floor((box.w - 28) / 7)));
  return (
    <g
      ref={setRef}
      role="tab"
      id={`fl-map-tab-${id}`}
      className="fl-map__zone"
      data-zone={id}
      aria-selected={selected}
      aria-controls="fl-map-panel"
      aria-label={`${label}, ${count}`}
      tabIndex={focusable ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKey}
    >
      <rect className="fl-map__box" x={box.x} y={box.y} width={box.w} height={box.h} rx={10} />
      <rect className="fl-map__ring" x={box.x - 5} y={box.y - 5} width={box.w + 10} height={box.h + 10} rx={14} />
      <text className="fl-map__label" x={box.x + 14} y={box.y + 27}>
        {lines.map((line, index) => <tspan key={line} x={box.x + 14} dy={index === 0 ? 0 : 19}>{line}</tspan>)}
      </text>
      <text className="fl-map__detail" x={box.x + 14} y={box.y + 27 + lines.length * 19 + 3}>
        {details.map((line, index) => <tspan key={line} x={box.x + 14} dy={index === 0 ? 0 : 15}>{line}</tspan>)}
      </text>
      <text className="fl-map__count" x={box.x + 14} y={box.y + box.h - 14}>{count}</text>
    </g>
  );
}

function OptionCard({ option, lang, labels }: { option: CatalogueOption; lang: Lang; labels: MapLabels }) {
  const text = option[lang];
  const sources = sourcesOf(option);
  return (
    <li className="fl-opt" data-kind={isProduct(option) ? "product" : "consulting"}>
      <h5>{text.name}</h5>
      <p className="fl-opt__tags">
        <span className="fl-tag" data-nature={option.nature}>{natureLabel(option.nature, lang)}</span>
        <span className="fl-tag fl-tag--state" data-state={option.state}>{stateLabel(option.state, lang)}</span>
        {option.module ? <span className="fl-tag fl-tag--module">{option.module}</span> : null}
      </p>
      <p className="fl-opt__covers">{text.covers}</p>
      <details className="fl-opt__more">
        <summary>{labels.more}</summary>
        <dl>
          <dt>{labels.fields.limits}</dt>
          <dd>{text.limits}</dd>
          <dt>{labels.fields.prerequisites}</dt>
          <dd>{text.prerequisites}</dd>
          <dt>{labels.fields.productPart}</dt>
          <dd>{text.productPart}</dd>
          <dt>{labels.fields.consultingPart}</dt>
          <dd>{text.consultingPart}</dd>
          <dt>{labels.fields.state}</dt>
          <dd>{stateLabel(option.state, lang)} : {stateDescription(option.state, lang)}</dd>
          {sources.length ? (
            <>
              <dt>{labels.fields.sources}</dt>
              <dd>
                <ul className="fl-opt__sources">
                  {sources.map((source) => (
                    <li key={source.id}>
                      <a href={source.url} rel="noopener noreferrer" target="_blank">{source.publisher}</a>
                      <small> · {source.published} · {labels.fields.read} {source.consulted}</small>
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          ) : null}
        </dl>
        <a className="xp-link fl-opt__matrix" href={`#matrice-${option.id}`}>{labels.inMatrix}</a>
      </details>
    </li>
  );
}

/**
 * Le schéma interactif d’une entreprise type : chaque zone est un onglet (flèches,
 * Début, Fin ; Entrée ou un clic zoome sur la zone ; Échap ou « Vue d’ensemble »
 * revient au tout). Le panneau dit ce que xSOM Fleet fait à cet endroit, en séparant
 * ce qui s’installe (produit) de ce qui se paramètre ou s’accompagne (conseil), avec
 * les limites de chaque option. Textes des options : le catalogue, tels quels.
 */
export function FleetMap({ lang, labels }: { lang: Lang; labels: MapLabels }) {
  const narrow = useSyncExternalStore(subscribe, () => window.matchMedia(NARROW_QUERY).matches, () => false);
  const layout = narrow ? NARROW : WIDE;
  const [zone, setZone] = useState<ZoneId>("postes-dev");
  const [zoomed, setZoomed] = useState(false);
  const tabs = useRef<Partial<Record<ZoneId, SVGGElement | null>>>({});
  const marker = useId().replace(/:/g, "");

  const select = (next: ZoneId, zoom?: boolean) => {
    setZone(next);
    if (zoom !== undefined) setZoomed(zoom);
  };

  const onKey = (event: KeyboardEvent<SVGGElement>) => {
    const index = ZONE_ORDER.indexOf(zone);
    const last = ZONE_ORDER.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setZoomed(true);
      return;
    }
    if (event.key === "Escape") {
      setZoomed(false);
      return;
    }
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const id = ZONE_ORDER[next] ?? zone;
    select(id);
    tabs.current[id]?.focus();
  };

  const [bx, by, bw, bh] = layout.box;
  const current = layout.zones[zone];
  const scale = zoomed ? Math.min(layout.zoom, bw / (current.w + 80), bh / (current.h + 80)) : 1;
  const tx = zoomed ? bx + bw / 2 - scale * (current.x + current.w / 2) : 0;
  const ty = zoomed ? by + bh / 2 - scale * (current.y + current.h / 2) : 0;

  const options = optionsOf(zone);
  const product = options.filter(isProduct);
  const consulting = options.filter((option) => !isProduct(option));

  return (
    <div className="fl-map" data-layout={narrow ? "narrow" : "wide"} data-zoomed={zoomed ? "" : undefined}>
      <div className="fl-map__stage">
        <div className="fl-map__bar">
          <p className="fl-map__hint" id={`${marker}-hint`}>{labels.hint}</p>
          <button type="button" className="fl-map__overview" onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed}>
            {zoomed ? labels.overview : labels.zoom}
          </button>
        </div>
        <svg className="fl-map__svg" viewBox={layout.box.join(" ")} role="group" aria-label={labels.map} aria-describedby={`${marker}-hint`}>
          <defs>
            <marker id={`${marker}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="fl-map__head" />
            </marker>
          </defs>
          <g className="fl-map__view" style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}>
            <g aria-hidden="true">
              <rect className="fl-map__group" x={layout.group.x} y={layout.group.y} width={layout.group.w} height={layout.group.h} rx={16} />
              <text className="fl-map__group-label" x={layout.groupLabel.x} y={layout.groupLabel.y} textAnchor={layout.groupLabel.anchor}>{labels.group}</text>
              {layout.edges.map((edge) => (
                <g key={edge.d} className="fl-map__edge" data-kind={edge.kind}>
                  <path d={edge.d} markerEnd={`url(#${marker}-arrow)`} markerStart={edge.both ? `url(#${marker}-arrow)` : undefined} />
                  {edge.label ? (
                    <text x={edge.label.x} y={edge.label.y} textAnchor={edge.label.anchor ?? "middle"}>
                      {(edge.label.stack ? halves(labels.flows[edge.label.key]) : [labels.flows[edge.label.key]]).map((line, index) => (
                        <tspan key={line} x={edge.label?.x} dy={index === 0 ? 0 : 13}>{line}</tspan>
                      ))}
                    </text>
                  ) : null}
                </g>
              ))}
              {narrow ? <text className="fl-map__edge-note" transform="rotate(-90)" x={-300} y={9} textAnchor="middle">{labels.flows.apiHooks}</text> : null}
            </g>
            <g role="tablist" aria-label={labels.zones} aria-orientation="horizontal">
              {ZONE_ORDER.map((id) => (
                <Zone
                  key={id}
                  id={id}
                  box={layout.zones[id]}
                  label={zoneLabel(id, lang)}
                  detail={labels.details[id]}
                  count={labels.count(optionsOf(id).length)}
                  selected={id === zone}
                  focusable={id === zone}
                  onSelect={() => select(id, true)}
                  onKey={onKey}
                  setRef={(node) => { tabs.current[id] = node; }}
                />
              ))}
            </g>
          </g>
        </svg>
      </div>

      <div className="fl-map__panel" role="tabpanel" id="fl-map-panel" aria-labelledby={`fl-map-tab-${zone}`} tabIndex={0}>
        <header className="fl-map__panel-head">
          <h3>{zoneLabel(zone, lang)}</h3>
          <p>{zoneSummary(zone, lang)}</p>
        </header>
        {[
          { key: "product", copy: labels.product, list: product },
          { key: "consulting", copy: labels.consulting, list: consulting },
        ].map(({ key, copy, list }) => (
          <section key={key} className="fl-map__group-list" data-kind={key} aria-labelledby={`fl-map-${key}`}>
            <h4 id={`fl-map-${key}`}><span className="fl-kind" data-kind={key}>{copy.title}</span></h4>
            <p className="fl-map__group-hint">{copy.hint}</p>
            {list.length ? (
              <ul className="fl-map__options">
                {list.map((option) => <OptionCard key={option.id} option={option} lang={lang} labels={labels} />)}
              </ul>
            ) : (
              <p className="fl-map__none">{labels.none}</p>
            )}
          </section>
        ))}
        <a className="xp-link" href="#matrice">{labels.compare} <span aria-hidden="true">↓</span></a>
      </div>
    </div>
  );
}
