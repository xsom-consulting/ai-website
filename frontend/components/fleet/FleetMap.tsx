"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
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
import {
  CAPTION_SIDE,
  DRAW_ORDER,
  SCENE,
  SHIELD_ORDER,
  captionBox,
  frozenRequests,
  hexagon,
  labelBox,
  pointAt,
  sceneView,
  zoneScene,
  zoomOn,
  type Flow,
  type Path,
  type Point,
  type Shape,
  type ShieldId,
} from "./fleet-iso";

export type Mode = "blind" | "control";

export type MapLabels = {
  readonly map: string;
  readonly zones: string;
  readonly overview: string;
  readonly zoom: string;
  readonly hint: string;
  readonly count: (n: number) => string;
  readonly modes: { readonly label: string } & Readonly<Record<Mode, string>>;
  readonly legend: { readonly label: string; readonly request: string; readonly secret: string; readonly stopped: string; readonly reply: string; readonly exchange: string; readonly cost: string; readonly reports: string; readonly group: string };
  readonly places: Readonly<Record<ZoneId, { readonly name: string; readonly sub?: string }>>;
  readonly shields: Readonly<Record<ShieldId, string>>;
  readonly module: string;
  readonly states: Readonly<Record<ZoneId, Readonly<Record<Mode, string>> & { readonly module: string }>>;
  readonly product: { readonly title: string; readonly hint: string };
  readonly consulting: { readonly title: string; readonly hint: string };
  readonly none: string;
  readonly more: string;
  readonly fields: { readonly covers: string; readonly limits: string; readonly prerequisites: string; readonly productPart: string; readonly consultingPart: string; readonly state: string; readonly module: string; readonly sources: string; readonly read: string };
  readonly inMatrix: string;
  readonly compare: string;
};

const NARROW_QUERY = "(max-width: 720px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const watch = (query: string) => (notify: () => void) => {
  const list = window.matchMedia(query);
  list.addEventListener("change", notify);
  return () => list.removeEventListener("change", notify);
};
const watchNarrow = watch(NARROW_QUERY);
const watchReduced = watch(REDUCED_QUERY);

const SVG = "http://www.w3.org/2000/svg";
const fixed = (value: number) => value.toFixed(1);
const pointList = (points: readonly Point[]) => points.map(([x, y]) => `${fixed(x)},${fixed(y)}`).join(" ");

/** Une forme de la scène, telle que `fleet-iso` la décrit. */
function Draw({ shape, glow }: { shape: Shape; glow: string }) {
  switch (shape.kind) {
    case "poly": return <polygon className={shape.className} points={pointList(shape.points)} filter={shape.glow ? glow : undefined} />;
    case "ellipse": return <ellipse className={shape.className} cx={fixed(shape.cx)} cy={fixed(shape.cy)} rx={fixed(shape.rx)} ry={fixed(shape.ry)} />;
    case "circle": return <circle className={shape.className} cx={fixed(shape.cx)} cy={fixed(shape.cy)} r={shape.r} />;
    case "rect": return <rect className={shape.className} x={fixed(shape.x)} y={fixed(shape.y)} width={shape.w} height={shape.h} rx={shape.rx} />;
    case "line": return <line className={shape.className} x1={fixed(shape.from[0])} y1={fixed(shape.from[1])} x2={fixed(shape.to[0])} y2={fixed(shape.to[1])} />;
    case "text": return <text className={shape.className} x={fixed(shape.x)} y={fixed(shape.y)} textAnchor="middle">{shape.text}</text>;
  }
}

/** Ce qui circule : une demande (vers les IA), une réponse (en retour), un échange avec les Externes, une remontée d’usage ou de coûts. */
type Moving = {
  readonly path: Path;
  readonly flow?: Flow;
  readonly kind: "request" | "reply" | "exchange" | "cost";
  /** Sens de parcours : 1 du départ vers l’arrivée, -1 en retour. */
  readonly direction: 1 | -1;
  readonly speed: number;
  t: number;
  secret: boolean;
  handled: boolean;
  readonly node: SVGCircleElement;
};
type Pulse = { readonly node: SVGCircleElement; readonly born: number };

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)] ?? list[0];

/**
 * Ce qui circule le long des chemins, créé hors de React : une demande toutes les
 * 0,32 s vers les IA, qui passe au vert au bouclier quand l’entreprise est sous
 * contrôle ; à son arrivée, souvent, une réponse du modèle qui redescend ; des échanges
 * entre les serveurs et les Externes, dans les deux sens ; des remontées d’usage et de
 * coûts vers la console (masquées en angle mort par la feuille de style). La boucle ne
 * tourne que lorsque la carte est à l’écran, et jamais sous mouvement réduit (tout y est
 * figé, dessiné par React). L’attribut `data-animating` de la carte dit si elle tourne.
 */
function animateRequests(host: HTMLElement, svg: SVGSVGElement, layer: SVGGElement, mode: { readonly current: Mode }, marker: string) {
  const live: Moving[] = [];
  const pulses: Pulse[] = [];
  const timers = { request: 0, exchange: 0, cost: 0 };
  let frame = 0;
  let last = 0;

  const circle = (className: string, r: number) => {
    const node = document.createElementNS(SVG, "circle");
    node.setAttribute("class", className);
    node.setAttribute("r", String(r));
    layer.appendChild(node);
    return node;
  };
  const pulse = ([x, y]: Point, good: boolean, now: number) => {
    const node = circle("fl-iso__pulse", 6);
    node.setAttribute("cx", fixed(x));
    node.setAttribute("cy", fixed(y));
    node.setAttribute("fill", `url(#${marker}-${good ? "ok" : "alert"})`);
    pulses.push({ node, born: now });
  };
  const launch = (item: Omit<Moving, "t" | "secret" | "handled" | "node"> & { secret?: boolean }, className: string, r: number) => {
    if (live.length >= 70) return;
    const node = circle(className, r);
    if (item.secret) node.setAttribute("filter", `url(#${marker}-glow)`);
    // Posé dès sa création au départ de son trajet : jamais une image à l’origine du dessin.
    const t = item.direction === 1 ? 0 : 1;
    const [x, y] = pointAt(item.path, t);
    node.setAttribute("cx", fixed(x));
    node.setAttribute("cy", fixed(y));
    live.push({ ...item, t, secret: item.secret ?? false, handled: false, node });
  };
  const spawnRequest = () => {
    const flow = pick(SCENE.flows);
    const secret = Math.random() < 0.2;
    launch({ path: flow, flow, kind: "request", direction: 1, speed: 1 / (2.6 + Math.random() * 1.2), secret }, secret ? "fl-iso__dot fl-iso__dot--secret" : "fl-iso__dot", secret ? 4.2 : 2.8);
  };
  const spawnReply = (flow: Flow) => launch({ path: flow, flow, kind: "reply", direction: -1, speed: 1 / (2.8 + Math.random() * 1.2) }, "fl-iso__reply", 3);
  const spawnExchange = () => launch({ path: SCENE.exchange, kind: "exchange", direction: Math.random() < 0.5 ? 1 : -1, speed: 1 / (1.6 + Math.random() * 0.6) }, "fl-iso__dot fl-iso__dot--exchange", 3);
  const spawnCost = () => launch({ path: pick(SCENE.costs), kind: "cost", direction: 1, speed: 1 / (3.4 + Math.random()) }, "fl-iso__dot fl-iso__dot--cost", 2.6);

  const tick = (now: number) => {
    // Au redémarrage, la première image peut dater d’avant `start` : jamais de temps négatif.
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    for (const [key, every, spawn] of [["request", 0.32, spawnRequest], ["exchange", 1.1, spawnExchange], ["cost", 0.9, spawnCost]] as const) {
      timers[key] += dt;
      while (timers[key] > every) {
        timers[key] -= every;
        spawn();
      }
    }
    for (let index = live.length - 1; index >= 0; index--) {
      const item = live[index];
      const before = item.t;
      item.t += item.direction * item.speed * dt;
      // Seul un secret qui franchit le bouclier pendant cette image est remplacé.
      if (item.flow && item.kind === "request" && item.secret && !item.handled && mode.current === "control" && before < item.flow.shieldAt && item.t >= item.flow.shieldAt) {
        item.handled = true;
        item.secret = false;
        item.node.setAttribute("class", "fl-iso__dot fl-iso__dot--stopped");
        item.node.setAttribute("r", "3.4");
        item.node.removeAttribute("filter");
        pulse(SCENE.shields[item.flow.shield], true, now);
      }
      if ((item.direction === 1 && item.t >= 1) || (item.direction === -1 && item.t <= 0)) {
        if (item.kind === "request" && item.secret) pulse(pointAt(item.path, 1), false, now);
        if (item.kind === "request" && item.flow && Math.random() < 0.6) spawnReply(item.flow);
        item.node.remove();
        live.splice(index, 1);
        continue;
      }
      const [x, y] = pointAt(item.path, item.t);
      item.node.setAttribute("cx", fixed(x));
      item.node.setAttribute("cy", fixed(y));
    }
    for (let index = pulses.length - 1; index >= 0; index--) {
      const { node, born } = pulses[index];
      const age = (now - born) / 600;
      if (age >= 1) {
        node.remove();
        pulses.splice(index, 1);
        continue;
      }
      node.setAttribute("r", fixed(6 + age * 26));
      node.setAttribute("opacity", (1 - age).toFixed(2));
    }
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
    host.dataset.animating = "";
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    delete host.dataset.animating;
  };
  const cleanup = () => {
    stop();
    layer.replaceChildren();
  };
  // Sans IntersectionObserver, la boucle tourne sans s’arrêter hors de l’écran.
  if (typeof IntersectionObserver === "undefined") {
    start();
    return cleanup;
  }
  const observer = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()));
  observer.observe(svg);
  return () => {
    observer.disconnect();
    cleanup();
  };
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
 * La carte isométrique d’une entreprise type : des bâtiments dessinés en code, les
 * demandes envoyées aux IA qui circulent, et un interrupteur entre l’angle mort
 * d’aujourd’hui et l’entreprise sous contrôle, où des boucliers se posent aux points de
 * contrôle de xSOM Fleet. Chaque zone est un onglet (flèches, Début, Fin ; Entrée ou un
 * clic zoome sur la zone ; Échap ou « Vue d’ensemble » revient au tout) ; un clic sur un
 * bâtiment fait de même. Le panneau dit ce qui s’y passe en angle mort et sous contrôle,
 * puis ce que xSOM Fleet y fait, en séparant ce qui s’installe (produit) de ce qui se
 * paramètre ou s’accompagne (conseil). Textes des options : le catalogue, tels quels.
 * Géométrie : `fleet-iso.ts`.
 */
export function FleetMap({ lang, labels }: { lang: Lang; labels: MapLabels }) {
  const narrow = useSyncExternalStore(watchNarrow, () => window.matchMedia(NARROW_QUERY).matches, () => false);
  const reduced = useSyncExternalStore(watchReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false);
  const [zone, setZone] = useState<ZoneId>("postes-dev");
  const [zoomed, setZoomed] = useState(false);
  const [mode, setMode] = useState<Mode>("blind");
  const tabs = useRef<Partial<Record<ZoneId, HTMLButtonElement | null>>>({});
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const layer = useRef<SVGGElement>(null);
  const modeNow = useRef<Mode>(mode);
  const marker = useId().replace(/:/g, "");
  const glow = `url(#${marker}-glow)`;

  useEffect(() => {
    modeNow.current = mode;
  }, [mode]);

  useEffect(() => {
    if (reduced || !root.current || !svg.current || !layer.current) return;
    return animateRequests(root.current, svg.current, layer.current, modeNow, marker);
  }, [reduced, marker]);

  const select = (next: ZoneId, zoom?: boolean) => {
    setZone(next);
    if (zoom !== undefined) setZoomed(zoom);
  };

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
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

  const view = useMemo(() => (narrow ? sceneView() : sceneView({ labels: labels.places, shields: labels.shields })), [narrow, labels]);
  // Le viewBox part de 0,0 et la scène y est déplacée d’un bloc : l’origine du zoom (CSS,
  // `transform-origin: 0 0`) ne dépend plus de la façon dont le navigateur la place.
  const frame = { x: 0, y: 0, w: view.w, h: view.h };
  const target = zoneScene(zone).bounds;
  const zoom = zoomed ? zoomOn(frame, { ...target, x: target.x - view.x, y: target.y - view.y }, { maxScale: narrow ? 2.6 : 2.2 }) : { scale: 1, x: 0, y: 0 };
  const frozen = useMemo(() => (reduced ? frozenRequests() : []), [reduced]);

  const options = optionsOf(zone);
  const product = options.filter(isProduct);
  const consulting = options.filter((option) => !isProduct(option));
  const state = labels.states[zone];

  return (
    <div ref={root} className="fl-map" data-layout={narrow ? "narrow" : "wide"} data-mode={mode} data-zoomed={zoomed ? "" : undefined}>
      <div className="fl-map__stage">
        <div className="fl-map__bar">
          <div className="fl-map__modes" role="group" aria-label={labels.modes.label}>
            {(["blind", "control"] as const).map((value) => (
              <button key={value} type="button" data-mode={value} aria-pressed={mode === value} onClick={() => setMode(value)}>
                <span className="fl-map__mode-dot" aria-hidden="true" />
                {labels.modes[value]}
              </button>
            ))}
          </div>
          <button type="button" className="fl-map__overview" onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed}>
            {zoomed ? labels.overview : labels.zoom}
          </button>
        </div>
        <svg ref={svg} className="fl-map__svg fl-iso" viewBox={`0 0 ${fixed(view.w)} ${fixed(view.h)}`} role="img" aria-label={labels.map}>
          <defs>
            <filter id={`${marker}-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {(["ok", "alert"] as const).map((tone) => (
              <radialGradient key={tone} id={`${marker}-${tone}`}>
                <stop offset="0" className={`fl-iso__stop fl-iso__stop--${tone}`} stopOpacity="0.9" />
                <stop offset="1" className={`fl-iso__stop fl-iso__stop--${tone}`} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          <g className="fl-map__view" style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})` }}>
            <g transform={`translate(${fixed(-view.x)} ${fixed(-view.y)})`}>
              <g className="fl-iso__ground">
                {SCENE.ground.map((shape, index) => <Draw key={index} shape={shape} glow={glow} />)}
              </g>
              {DRAW_ORDER.map((id) => (
                <g key={id} className="fl-iso__zone" data-zone={id} data-selected={id === zone ? "" : undefined} onClick={() => select(id, true)}>
                  {zoneScene(id).shapes.map((shape, index) => <Draw key={index} shape={shape} glow={glow} />)}
                </g>
              ))}
              <g className="fl-iso__unknowns">
                {SCENE.unknowns.map(([x, y]) => (
                  <g key={`${fixed(x)}-${fixed(y)}`} className="fl-iso__unknown">
                    <circle cx={fixed(x)} cy={fixed(y)} r={11} />
                    <text x={fixed(x)} y={fixed(y + 5)} textAnchor="middle">?</text>
                  </g>
                ))}
              </g>
              <g className="fl-iso__flows">
                {SCENE.flows.map((flow) => <polyline key={flow.zone} className="fl-iso__flow" points={pointList(flow.points)} />)}
              </g>
              <polyline className="fl-iso__exchange" points={pointList(SCENE.exchange.points)} />
              <g className="fl-iso__reports">
                {SCENE.reports.map((d) => <path key={d} className="fl-iso__report" d={d} />)}
              </g>
              <g className="fl-iso__costs">
                {SCENE.costs.map((cost) => <polyline key={cost.from} className="fl-iso__cost" data-from={cost.from} points={pointList(cost.points)} />)}
              </g>
              <g ref={layer} className="fl-iso__requests" />
              {reduced ? (
                <g className="fl-iso__requests" data-frozen="">
                  {frozen.map(({ key, kind, flow, t, point: [x, y] }) => {
                    if (kind === "reply") return <circle key={key} className="fl-iso__reply" cx={fixed(x)} cy={fixed(y)} r={3} />;
                    if (kind === "exchange" || kind === "cost") return <circle key={key} className={`fl-iso__dot fl-iso__dot--${kind}`} cx={fixed(x)} cy={fixed(y)} r={2.6} />;
                    const tone = kind === "request" ? "" : mode === "control" && flow && t >= flow.shieldAt ? " fl-iso__dot--stopped" : " fl-iso__dot--secret";
                    return <circle key={key} className={`fl-iso__dot${tone}`} cx={fixed(x)} cy={fixed(y)} r={kind === "secret" ? 4 : 2.8} />;
                  })}
                </g>
              ) : null}
              <g className="fl-iso__shields">
                {SHIELD_ORDER.map((id) => {
                  const at = SCENE.shields[id];
                  const [cx, cy] = at;
                  const caption = captionBox(at, labels.shields[id], CAPTION_SIDE[id]);
                  return (
                    <g key={id} className="fl-iso__shield" data-shield={id}>
                      <polygon className="fl-iso__hex" points={pointList(hexagon(at))} filter={glow} />
                      <path className="fl-iso__check" d={`M${fixed(cx - 5)},${fixed(cy)} l3.6,3.8 l6.6,-7.4`} />
                      <g className="fl-iso__caption">
                        <rect x={fixed(caption.x)} y={fixed(caption.y)} width={fixed(caption.w)} height={caption.h} rx={5} />
                        <text x={fixed(caption.x + 7)} y={fixed(cy + 4)}>{labels.shields[id]}</text>
                      </g>
                    </g>
                  );
                })}
              </g>
              <g className="fl-iso__labels">
                {DRAW_ORDER.map((id) => {
                  const { name, sub } = labels.places[id];
                  const [ax, ay] = SCENE.labels[id];
                  const box = labelBox(SCENE.labels[id], name, sub);
                  return (
                    <g key={id} className="fl-iso__label">
                      <rect x={fixed(box.x)} y={fixed(box.y)} width={fixed(box.w)} height={box.h} rx={6} />
                      <text className="fl-iso__name" x={fixed(ax)} y={fixed(ay - (sub ? 18 : 8))} textAnchor="middle">{name}</text>
                      {sub ? <text className="fl-iso__sub" x={fixed(ax)} y={fixed(ay - 6)} textAnchor="middle">{sub}</text> : null}
                    </g>
                  );
                })}
              </g>
            </g>
          </g>
        </svg>
        <ul className="fl-map__legend" aria-label={labels.legend.label}>
          <li data-kind="request">{labels.legend.request}</li>
          <li data-kind="secret">{labels.legend.secret}</li>
          <li data-kind="stopped">{labels.legend.stopped}</li>
          <li data-kind="reply">{labels.legend.reply}</li>
          <li data-kind="exchange">{labels.legend.exchange}</li>
          <li data-kind="cost">{labels.legend.cost}</li>
          <li data-kind="reports">{labels.legend.reports}</li>
          <li data-kind="group">{labels.legend.group}</li>
        </ul>
        <p className="fl-map__hint" id={`${marker}-hint`}>{labels.hint}</p>
        <div className="fl-map__tabs" role="tablist" aria-label={labels.zones} aria-orientation="horizontal" aria-describedby={`${marker}-hint`}>
          {ZONE_ORDER.map((id) => (
            <button
              key={id}
              ref={(node) => { tabs.current[id] = node; }}
              type="button"
              role="tab"
              id={`fl-map-tab-${id}`}
              className="fl-map__tab"
              data-zone={id}
              aria-selected={id === zone}
              aria-controls="fl-map-panel"
              aria-label={`${zoneLabel(id, lang)}, ${labels.count(optionsOf(id).length)}`}
              tabIndex={id === zone ? 0 : -1}
              onClick={() => select(id, true)}
              onKeyDown={onKey}
            >
              {zoneLabel(id, lang)}
            </button>
          ))}
        </div>
      </div>

      <div className="fl-map__panel" role="tabpanel" id="fl-map-panel" aria-labelledby={`fl-map-tab-${zone}`} tabIndex={0}>
        <header className="fl-map__panel-head">
          <h3>{zoneLabel(zone, lang)}</h3>
          <p>{zoneSummary(zone, lang)}</p>
        </header>
        <div className="fl-map__states">
          {(["blind", "control"] as const).map((value) => (
            <div key={value} className="fl-state" data-state={value} data-current={value === mode ? "true" : "false"}>
              <p className="fl-state__name">{labels.modes[value]}</p>
              <p>{state[value]}</p>
            </div>
          ))}
          <p className="fl-map__module">{labels.module} <span className="fl-tag fl-tag--module">{state.module}</span></p>
        </div>
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
