import type { ZoneId } from "./fleet-catalogue";

/**
 * La carte isométrique de l’entreprise type, en géométrie pure : aucune dépendance à
 * React ni au DOM, pour être testée et réutilisée telle quelle. Les bâtiments sont des
 * prismes dessinés en code (trois faces visibles), projetés en isométrique ; les flux
 * sont des polylignes le long desquelles avancent les demandes envoyées aux IA.
 *
 * Unités : la grille de la scène (x, y au sol, z en hauteur), projetée en unités du
 * viewBox par `project`. Les couleurs ne vivent pas ici : chaque forme porte une classe
 * (`fl-iso__…`), que la charte du site colore (`pitch.css`).
 */

export type Point = readonly [number, number];
export type Vec3 = readonly [number, number, number];
export type Box = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };

export type Shape =
  | { readonly kind: "poly"; readonly points: readonly Point[]; readonly className: string; readonly glow?: boolean }
  | { readonly kind: "ellipse"; readonly cx: number; readonly cy: number; readonly rx: number; readonly ry: number; readonly className: string }
  | { readonly kind: "circle"; readonly cx: number; readonly cy: number; readonly r: number; readonly className: string }
  | { readonly kind: "rect"; readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly rx: number; readonly className: string }
  | { readonly kind: "line"; readonly from: Point; readonly to: Point; readonly className: string }
  | { readonly kind: "text"; readonly x: number; readonly y: number; readonly text: string; readonly className: string };

/** Taille d’une unité de grille, en unités du viewBox. */
export const UNIT = 21;
const COS30 = Math.cos(Math.PI / 6);

/** Projection isométrique d’un point de la grille. */
export function project([x, y, z]: Vec3): Point {
  return [(x - y) * COS30 * UNIT, (x + y) * 0.5 * UNIT - z * UNIT];
}

const poly = (corners: readonly Vec3[], className: string, glow?: boolean): Shape => ({ kind: "poly", points: corners.map(project), className, ...(glow ? { glow } : {}) });

/** Les matières des prismes : chacune a ses trois teintes (dessus, gauche, droite) dans la charte. */
export type Material = "ground" | "lot" | "tower" | "annex" | "roof" | "rack" | "ext" | "island" | "panel" | "monitor" | "monitor-alt";

/** Un prisme : faces visibles = dessus, face y + d (gauche), face x + w (droite). */
export function prism(x: number, y: number, z: number, w: number, d: number, h: number, material: Material): Shape[] {
  const face = (side: string) => `fl-iso__f fl-iso__f--${material}-${side}`;
  return [
    poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], face("l")),
    poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], face("r")),
    poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], face("t")),
  ];
}

/** Le contour lumineux d’une zone survolée ou choisie. */
function outline(x: number, y: number, z: number, w: number, d: number, h: number): Shape[] {
  return [
    poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z], [x, y + d, z + h]], "fl-iso__hl", true),
    poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], "fl-iso__hl fl-iso__hl--top"),
  ];
}

/** Fenêtres sur la face gauche (y + d). */
function windowsLeft(x: number, y: number, z: number, w: number, d: number, h: number, cols: number, rows: number): Shape[] {
  const shapes: Shape[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const u0 = x + (c + 0.25) * w / cols, u1 = x + (c + 0.75) * w / cols;
    const v0 = z + (r + 0.3) * h / rows, v1 = z + (r + 0.7) * h / rows;
    const lit = (r * 7 + c * 3) % 5 !== 0;
    shapes.push(poly([[u0, y + d, v0], [u1, y + d, v0], [u1, y + d, v1], [u0, y + d, v1]], lit ? "fl-iso__win fl-iso__win--lit" : "fl-iso__win"));
  }
  return shapes;
}

/** Fenêtres sur la face droite (x + w). */
function windowsRight(x: number, y: number, z: number, w: number, d: number, h: number, cols: number, rows: number): Shape[] {
  const shapes: Shape[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const u0 = y + (c + 0.25) * d / cols, u1 = y + (c + 0.75) * d / cols;
    const v0 = z + (r + 0.3) * h / rows, v1 = z + (r + 0.7) * h / rows;
    const lit = (r * 5 + c * 2) % 4 !== 1;
    shapes.push(poly([[x + w, u0, v0], [x + w, u1, v0], [x + w, u1, v1], [x + w, u0, v1]], lit ? "fl-iso__win fl-iso__win--side-lit" : "fl-iso__win fl-iso__win--side"));
  }
  return shapes;
}

/** Une personne debout au sol. */
function person(x: number, y: number, tone: "staff" | "dev" | "ext"): Shape[] {
  const [px, py] = project([x, y, 0]);
  return [
    { kind: "ellipse", cx: px, cy: py, rx: 5, ry: 2.4, className: "fl-iso__shadow" },
    { kind: "rect", x: px - 3.2, y: py - 14, w: 6.4, h: 11, rx: 3.2, className: `fl-iso__body fl-iso__body--${tone}` },
    { kind: "circle", cx: px, cy: py - 17, r: 3.1, className: "fl-iso__head" },
  ];
}

export type ZoneScene = { readonly id: ZoneId; readonly shapes: readonly Shape[]; readonly bounds: Box };

/** Ordre de dessin : de l’arrière vers l’avant. */
export const DRAW_ORDER: readonly ZoneId[] = ["cloud", "console", "metiers", "proxy", "serveurs", "postes-dev", "externes"];

function cloudZone(): Shape[] {
  const x = 19.5, y = -6.5, z = 8.2, w = 8, d = 5.5;
  const shapes = prism(x, y, z - 0.6, w, d, 0.6, "island");
  const puffs: Vec3[] = [[x + 1.4, y + 1.2, 1.1], [x + 3.2, y + 0.8, 1.5], [x + 5.4, y + 1.4, 1.2], [x + 2.2, y + 3.4, 1.0], [x + 4.6, y + 3.6, 1.3], [x + 6.6, y + 3.2, 0.9]];
  for (const [px, py, size] of puffs) {
    const [cx, cy] = project([px, py, z + 0.3]);
    shapes.push({ kind: "ellipse", cx, cy: cy - size * 8, rx: size * 22, ry: size * 15, className: "fl-iso__puff" });
  }
  const names: [string, number, number][] = [["Claude", x + 2.0, y + 2.3], ["ChatGPT", x + 5.1, y + 2.6], ["API", x + 6.6, y + 4.6]];
  for (const [text, nx, ny] of names) {
    const [cx, cy] = project([nx, ny, z + 0.6]);
    shapes.push({ kind: "text", x: cx, y: cy - 4, text, className: "fl-iso__brand" });
  }
  return [...shapes, ...outline(x, y, z - 0.6, w, d, 0.6)];
}

function consoleZone(): Shape[] {
  const x = 13.5, y = 1, w = 4.5, d = 3.4, h = 1.5;
  const shapes = [...prism(x, y, 0, w, d, h, "annex"), ...windowsLeft(x, y, 0, w, d, h, 5, 1), ...prism(x + 0.6, y + 0.8, h, 3.2, 0.25, 1.9, "panel")];
  [0.5, 0.9, 0.7, 1.25, 1.0, 1.45].forEach((bar, index) => {
    const bx = x + 0.95 + index * 0.47;
    shapes.push(poly([[bx, y + 1.05, h + 0.25], [bx + 0.3, y + 1.05, h + 0.25], [bx + 0.3, y + 1.05, h + 0.25 + bar], [bx, y + 1.05, h + 0.25 + bar]], index === 5 ? "fl-iso__bar fl-iso__bar--ok" : "fl-iso__bar"));
  });
  return [...shapes, ...outline(x, y, 0, w, d, h)];
}

function metiersZone(): Shape[] {
  return [
    ...prism(0.5, 0.5, 0, 4.2, 3.2, 5.6, "tower"),
    ...windowsLeft(0.5, 0.5, 0, 4.2, 3.2, 5.6, 5, 7),
    ...windowsRight(0.5, 0.5, 0, 4.2, 3.2, 5.6, 4, 7),
    ...prism(0.6, 4.6, 0, 3.4, 3.2, 3.2, "annex"),
    ...windowsLeft(0.6, 4.6, 0, 3.4, 3.2, 3.2, 4, 4),
    ...windowsRight(0.6, 4.6, 0, 3.4, 3.2, 3.2, 4, 4),
    ...outline(0.5, 0.5, 0, 4.2, 7.3, 5.6),
    ...([[5.6, 2.2], [6.3, 3.4], [5.4, 5.6], [6.4, 6.6], [5.8, 7.8]] as const).flatMap(([px, py]) => person(px, py, "staff")),
  ];
}

function proxyZone(): Shape[] {
  const x = 9.6, y = 3.0, w = 1.3, d = 7.6, h = 3.0;
  const shapes = [...prism(x, y, 0, w, 1.6, h, "annex"), ...prism(x, y + d - 1.6, 0, w, 1.6, h, "annex"), ...prism(x, y, h, w, d, 0.8, "roof")];
  for (let index = 0; index < 6; index++) {
    const yy = y + 1.8 + index * 0.68;
    shapes.push({ kind: "line", from: project([x + w, yy, 0.2]), to: project([x + w, yy, h - 0.1]), className: "fl-iso__gate" });
  }
  return [...shapes, ...outline(x, y, 0, w, d, h + 0.8)];
}

function serveursZone(): Shape[] {
  const shapes: Shape[] = [];
  for (let index = 0; index < 4; index++) {
    const x = 12.2 + index * 1.55, y = 11.5;
    shapes.push(...prism(x, y, 0, 0.95, 3.3, 2.5, "rack"));
    for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) {
      const [cx, cy] = project([x + 0.95, y + 0.5 + c * 1.05, 0.35 + r * 0.36]);
      shapes.push({ kind: "circle", cx, cy, r: 1.5, className: (r + c + index) % 3 === 0 ? "fl-iso__led fl-iso__led--ok" : "fl-iso__led" });
    }
  }
  return [...shapes, ...outline(12.2, 11.5, 0, 5.6, 3.3, 2.5)];
}

function postesZone(): Shape[] {
  const x = 0.6, y = 11, w = 5.6, d = 4.6, h = 2.1;
  const shapes = [...prism(x, y, 0, w, d, h, "tower"), ...windowsLeft(x, y, 0, w, d, h, 6, 2), ...windowsRight(x, y, 0, w, d, h, 5, 2)];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
    shapes.push(...prism(x + 0.6 + c * 1.7, y + 1.2 + r * 1.8, h, 0.9, 0.12, 0.6, (r + c) % 2 ? "monitor" : "monitor-alt"));
  }
  return [...shapes, ...outline(x, y, 0, w, d, h), ...person(7, 12.2, "dev"), ...person(6.9, 14.4, "dev")];
}

function externesZone(): Shape[] {
  const x = 22.2, y = 12, w = 3.2, d = 2.8, h = 1.5;
  return [...prism(x, y, 0, w, d, h, "ext"), ...windowsLeft(x, y, 0, w, d, h, 3, 1), ...person(24.2, 15.6, "ext"), ...person(22.8, 15.8, "ext"), ...outline(x, y, 0, w, d, h)];
}

const ZONE_BUILDERS: Readonly<Record<ZoneId, () => Shape[]>> = {
  cloud: cloudZone,
  console: consoleZone,
  metiers: metiersZone,
  proxy: proxyZone,
  serveurs: serveursZone,
  "postes-dev": postesZone,
  externes: externesZone,
};

/** Le sol du Groupe, la parcelle des Externes, la limite du Groupe et les allées. */
function ground(): Shape[] {
  return [
    ...prism(-1.5, -1.5, -0.35, 23.5, 21, 0.35, "ground"),
    ...prism(21.2, 11, -0.35, 5.6, 5.2, 0.35, "lot"),
    poly([[-0.8, -0.8, 0.01], [21.3, -0.8, 0.01], [21.3, 18.8, 0.01], [-0.8, 18.8, 0.01]], "fl-iso__fence"),
    poly([[0, 9.2, 0.02], [21, 9.2, 0.02], [21, 10.2, 0.02], [0, 10.2, 0.02]], "fl-iso__alley"),
    poly([[7.6, -0.8, 0.02], [8.5, -0.8, 0.02], [8.5, 18.8, 0.02], [7.6, 18.8, 0.02]], "fl-iso__alley"),
  ];
}

/** La boîte englobante d’une forme, en unités du viewBox. */
export function shapeBounds(shape: Shape): Box {
  switch (shape.kind) {
    case "poly": return pointsBounds(shape.points);
    case "ellipse": return { x: shape.cx - shape.rx, y: shape.cy - shape.ry, w: 2 * shape.rx, h: 2 * shape.ry };
    case "circle": return { x: shape.cx - shape.r, y: shape.cy - shape.r, w: 2 * shape.r, h: 2 * shape.r };
    case "rect": return { x: shape.x, y: shape.y, w: shape.w, h: shape.h };
    case "line": return pointsBounds([shape.from, shape.to]);
    // Un nom de marque, de 13 unités de haut, centré sur son ancre.
    case "text": return { x: shape.x - shape.text.length * 4.5, y: shape.y - 11, w: shape.text.length * 9, h: 14 };
  }
}

function pointsBounds(points: readonly Point[]): Box {
  const xs = points.map(([x]) => x), ys = points.map(([, y]) => y);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

/** La plus petite boîte qui contient toutes les autres. */
export function union(boxes: readonly Box[]): Box {
  const x = Math.min(...boxes.map((box) => box.x)), y = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.w)), bottom = Math.max(...boxes.map((box) => box.y + box.h));
  return { x, y, w: right - x, h: bottom - y };
}

export const pad = (box: Box, margin: number): Box => ({ x: box.x - margin, y: box.y - margin, w: box.w + 2 * margin, h: box.h + 2 * margin });

/** Une demande en chemin vers les IA : de sa zone jusqu’au cloud des Fournisseurs. */
export type Flow = {
  readonly zone: ZoneId;
  readonly points: readonly Point[];
  readonly segments: readonly number[];
  readonly total: number;
  /** Où, sur le flux (0 à 1), la demande passe le point de contrôle. */
  readonly shieldAt: number;
  readonly shield: ShieldId;
};

function flow(zone: ZoneId, path: readonly Vec3[], shieldAt: number, shield: ShieldId): Flow {
  const points = path.map(project);
  const segments = points.slice(1).map(([x, y], index) => Math.hypot(x - points[index][0], y - points[index][1]));
  return { zone, points, segments, total: segments.reduce((sum, length) => sum + length, 0), shieldAt, shield };
}

/** La position d’une demande sur son flux, `t` allant de 0 (départ) à 1 (arrivée). */
export function pointAt(flow: Flow, t: number): Point {
  let distance = Math.min(1, Math.max(0, t)) * flow.total;
  for (let index = 0; index < flow.segments.length; index++) {
    const length = flow.segments[index];
    if (distance <= length || index === flow.segments.length - 1) {
      const [ax, ay] = flow.points[index], [bx, by] = flow.points[index + 1];
      const ratio = length === 0 ? 1 : Math.min(1, distance / length);
      return [ax + (bx - ax) * ratio, ay + (by - ay) * ratio];
    }
    distance -= length;
  }
  return flow.points[flow.points.length - 1];
}

/** Les points de contrôle de xSOM Fleet, un par zone où un bouclier se pose. */
export type ShieldId = Exclude<ZoneId, "metiers">;
export const SHIELD_ORDER: readonly ShieldId[] = ["postes-dev", "proxy", "serveurs", "externes", "cloud", "console"];
const SHIELD_AT: Readonly<Record<ShieldId, Vec3>> = {
  "postes-dev": [3.4, 13.2, 3.6],
  proxy: [10.2, 6.6, 4.6],
  serveurs: [14.9, 12.8, 3.4],
  externes: [23.8, 13.4, 2.7],
  cloud: [21.2, -1.8, 9.6],
  console: [15.8, 2.6, 4.7],
};

/** L’hexagone d’un bouclier, de rayon 13, centré sur son point. */
export function hexagon([cx, cy]: Point, radius = 13): Point[] {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index + Math.PI / 6;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)] as const;
  });
}

/** La boîte de la légende d’un bouclier, à sa droite. */
export function captionBox([cx, cy]: Point, text: string): Box {
  return { x: cx + 17, y: cy - 10, w: text.length * 6.4 + 14, h: 20 };
}

/** La boîte d’une étiquette de zone, posée au-dessus de son ancre. */
export function labelBox([ax, ay]: Point, name: string, sub?: string): Box {
  const w = Math.max(name.length * 7.3, (sub ?? "").length * 5.9) + 20;
  const h = sub ? 34 : 24;
  return { x: ax - w / 2, y: ay - h, w, h };
}

const LABEL_AT: Readonly<Record<ZoneId, Vec3>> = {
  metiers: [2.6, 0.8, 7.3],
  "postes-dev": [3.4, 11.3, 4.3],
  proxy: [10.3, 3.0, 4.9],
  serveurs: [18.6, 14.2, 3.0],
  console: [15.8, 0.8, 5.4],
  externes: [23.8, 11.8, 3.4],
  cloud: [23.5, -6.5, 11.4],
};

export type Scene = {
  readonly ground: readonly Shape[];
  readonly zones: readonly ZoneScene[];
  readonly world: Box;
  /** Les points d’interrogation de l’angle mort. */
  readonly unknowns: readonly Point[];
  readonly flows: readonly Flow[];
  /** Les remontées vers la console : des Événements sans contenu (chemins SVG). */
  readonly reports: readonly string[];
  readonly shields: Readonly<Record<ShieldId, Point>>;
  readonly labels: Readonly<Record<ZoneId, Point>>;
};

function buildScene(): Scene {
  const zones = DRAW_ORDER.map((id) => {
    const shapes = ZONE_BUILDERS[id]();
    return { id, shapes, bounds: union(shapes.map(shapeBounds)) };
  });
  const groundShapes = ground();
  const consoleAt: Point = project([15.6, 2.6, 1.6]);
  const reports = ([[3.4, 13.2, 3.2], [10.2, 6.6, 4.2], [14.9, 12.8, 3.0], [23.8, 13.4, 2.4]] as const).map((source) => {
    const [ax, ay] = project(source);
    const [bx, by] = consoleAt;
    return `M${ax.toFixed(1)},${ay.toFixed(1)} Q${((ax + bx) / 2).toFixed(1)},${(Math.min(ay, by) - 40).toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`;
  });
  const entries = <K extends string, V, R>(record: Readonly<Record<K, V>>, map: (value: V) => R) =>
    Object.fromEntries(Object.entries(record).map(([key, value]) => [key, map(value as V)])) as Record<K, R>;
  return {
    ground: groundShapes,
    zones,
    world: union([...groundShapes, ...zones.flatMap((zone) => zone.shapes)].map(shapeBounds)),
    unknowns: ([[2.6, 2.1, 6.7], [3.4, 13.2, 3.4], [14.9, 13.2, 3.6], [23.8, 13.4, 2.6], [15.8, 2.7, 4.4]] as const).map(project),
    flows: [
      flow("metiers", [[4.8, 3.6, 3.2], [9.6, 6.8, 1.6], [10.9, 6.6, 1.6], [21.8, -2.6, 8.6]], 0.3, "proxy"),
      flow("postes-dev", [[4.5, 13.2, 2.4], [9.6, 8.6, 1.4], [10.9, 8.3, 1.4], [22.6, -2.0, 8.6]], 0.04, "postes-dev"),
      flow("serveurs", [[15.2, 12.5, 2.6], [17.8, 7.2, 4.4], [24.4, -1.6, 8.6]], 0.06, "serveurs"),
      flow("externes", [[23.6, 12.6, 1.7], [26.2, 6.0, 4.8], [25.8, -1.4, 8.4]], 0.06, "externes"),
    ],
    reports,
    shields: entries(SHIELD_AT, project),
    labels: entries(LABEL_AT, project),
  };
}

export const SCENE: Scene = buildScene();

export const zoneScene = (id: ZoneId) => SCENE.zones.find((zone) => zone.id === id) ?? SCENE.zones[0];

/**
 * Le cadrage de la scène : le monde seul (téléphone, étiquettes masquées), ou le monde
 * avec ses étiquettes et les légendes des boucliers (bureau), selon les textes de la langue.
 */
export function sceneView(text?: { readonly labels: Readonly<Record<ZoneId, { readonly name: string; readonly sub?: string }>>; readonly shields: Readonly<Record<ShieldId, string>> }): Box {
  if (!text) return pad(SCENE.world, 8);
  const labels = DRAW_ORDER.map((id) => labelBox(SCENE.labels[id], text.labels[id].name, text.labels[id].sub));
  const captions = SHIELD_ORDER.map((id) => captionBox(SCENE.shields[id], text.shields[id]));
  return pad(union([SCENE.world, ...labels, ...captions]), 16);
}

/**
 * Le zoom sur une zone : l’échelle et la translation qui centrent la zone dans la vue,
 * sans dépasser `maxScale` ni descendre sous 1. Coordonnées en unités du viewBox.
 */
export function zoomOn(view: Box, target: Box, { margin = 70, maxScale = 2.4 } = {}) {
  const scale = Math.max(1, Math.min(maxScale, view.w / (target.w + 2 * margin), view.h / (target.h + 2 * margin)));
  return {
    scale,
    x: view.x + view.w / 2 - scale * (target.x + target.w / 2),
    y: view.y + view.h / 2 - scale * (target.y + target.h / 2),
  };
}

/** Les demandes figées le long des flux, quand le mouvement est réduit. */
export function frozenRequests(): { readonly flow: Flow; readonly t: number; readonly point: Point; readonly secret: boolean }[] {
  return SCENE.flows.flatMap((item, index) => [0.25, 0.55, 0.85].map((t, step) => ({ flow: item, t, point: pointAt(item, t), secret: (index + step) % 3 === 0 })));
}
