import { expect, test } from "@playwright/test";
import { CAPTION_SIDE, DRAW_ORDER, PROVIDER_ROWS, SCENE, SHIELD_ORDER, captionBox, frozenRequests, labelBox, pointAt, project, sceneView, shapeBounds, union, zoneScene, zoomOn, type Box, type Point } from "../components/fleet/fleet-iso";

/**
 * La géométrie de la carte isométrique, sans navigateur : projection, flux, cadrage et
 * zoom. Ce que la carte dessine dépend de ces fonctions pures (`fleet-iso.ts`).
 */

test("iso: the projection puts the grid origin at the origin and height upwards", () => {
  expect(project([0, 0, 0])).toEqual([0, 0]);
  const [x, y] = project([1, 1, 0]);
  expect(x).toBeCloseTo(0);
  expect(y).toBeCloseTo(21);
  expect(project([0, 0, 1])[1]).toBeCloseTo(-21);
});

test("iso: the scene has the seven zones, each with its building and its own bounds", () => {
  expect([...DRAW_ORDER].sort()).toEqual(["cloud", "console", "externes", "metiers", "postes-dev", "proxy", "serveurs"]);
  for (const id of DRAW_ORDER) {
    const zone = zoneScene(id);
    expect(zone.id).toBe(id);
    expect(zone.shapes.some((shape) => shape.className.startsWith("fl-iso__f "))).toBe(true);
    expect(zone.shapes.some((shape) => shape.className === "fl-iso__hl")).toBe(true);
    expect(zone.bounds.w).toBeGreaterThan(0);
    expect(zone.bounds.h).toBeGreaterThan(0);
    // Chaque zone tient dans le monde dessiné.
    expect(union([SCENE.world, zone.bounds])).toEqual(SCENE.world);
  }
});

test("iso: requests travel each flow from its zone to the Providers, past their checkpoint", () => {
  expect(SCENE.flows.map((flow) => flow.zone)).toEqual(["metiers", "postes-dev", "serveurs", "externes"]);
  for (const flow of SCENE.flows) {
    const near = (point: readonly number[], expected: readonly number[] | undefined) => {
      expect(point[0]).toBeCloseTo(expected?.[0] ?? Number.NaN);
      expect(point[1]).toBeCloseTo(expected?.[1] ?? Number.NaN);
    };
    near(pointAt(flow, 0), flow.points[0]);
    near(pointAt(flow, 1), flow.points.at(-1));
    near(pointAt(flow, 2), flow.points.at(-1));
    expect(flow.shieldAt).toBeGreaterThan(0);
    expect(flow.shieldAt).toBeLessThan(1);
    expect(SHIELD_ORDER).toContain(flow.shield);
    // La demande arrive dans le nuage des Fournisseurs.
    const cloud = zoneScene("cloud").bounds;
    const [x, y] = pointAt(flow, 1);
    expect(x).toBeGreaterThanOrEqual(cloud.x - 40);
    expect(y).toBeLessThanOrEqual(cloud.y + cloud.h + 60);
  }
  const flow = SCENE.flows[0];
  const half = pointAt(flow, 0.5);
  const length = (from: readonly number[], to: readonly number[]) => Math.hypot(to[0] - from[0], to[1] - from[1]);
  expect(flow.segments.reduce((sum, value) => sum + value, 0)).toBeCloseTo(flow.total);
  expect(half).not.toEqual(flow.points[0]);
  expect(length(flow.points[0], half)).toBeLessThanOrEqual(flow.total / 2 + 1e-6);
});

test("iso: the view frames the world and its labels, and the zoom centres the chosen zone", () => {
  const places = Object.fromEntries(DRAW_ORDER.map((id) => [id, { name: "Une étiquette assez longue", sub: "et sa ligne" }]));
  const shields = Object.fromEntries(SHIELD_ORDER.map((id) => [id, "Bouclier"]));
  const wide = sceneView({ labels: places as never, shields: shields as never });
  const narrow = sceneView();
  expect(union([wide, SCENE.world])).toEqual(wide);
  expect(union([narrow, SCENE.world])).toEqual(narrow);
  expect(wide.w).toBeGreaterThanOrEqual(narrow.w);
  const label = labelBox(SCENE.labels.metiers, "Métiers", "claude.ai, chatgpt.com");
  expect(union([wide, label])).toEqual(wide);
  for (const id of DRAW_ORDER) {
    const target = zoneScene(id).bounds;
    const zoom = zoomOn(wide, target, { maxScale: 2.2 });
    expect(zoom.scale).toBeGreaterThanOrEqual(1);
    expect(zoom.scale).toBeLessThanOrEqual(2.2);
    const centre = [zoom.scale * (target.x + target.w / 2) + zoom.x, zoom.scale * (target.y + target.h / 2) + zoom.y];
    expect(centre[0]).toBeCloseTo(wide.x + wide.w / 2);
    expect(centre[1]).toBeCloseTo(wide.y + wide.h / 2);
  }
});

const inside = ([x, y]: Point, box: Box, margin = 0) => x >= box.x - margin && x <= box.x + box.w + margin && y >= box.y - margin && y <= box.y + box.h + margin;
const overlap = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

test("iso: the Providers island names seven Providers, on the island and without overlap", () => {
  const cloud = zoneScene("cloud");
  const brands = cloud.shapes.filter((shape) => shape.kind === "text");
  expect(brands.map((shape) => (shape.kind === "text" ? shape.text : ""))).toEqual(PROVIDER_ROWS.flat());
  expect(PROVIDER_ROWS.flat()).toEqual(["Claude", "ChatGPT", "Azure OpenAI", "Microsoft Copilot", "Gemini", "Mistral", "Bedrock"]);
  const top = union(cloud.shapes.filter((shape) => shape.className.endsWith("--island-t")).map(shapeBounds));
  const boxes = brands.map(shapeBounds);
  for (const box of boxes) expect(union([top, box])).toEqual(top);
  boxes.forEach((a, i) => boxes.slice(i + 1).forEach((b) => expect(overlap(a, b)).toBe(false)));
  // Aucun nuage ne couvre un nom.
  const puffs = cloud.shapes.filter((shape) => shape.className === "fl-iso__puff").map(shapeBounds);
  expect(puffs.length).toBeGreaterThan(0);
  for (const puff of puffs) for (const box of boxes) expect(overlap(puff, box)).toBe(false);
  // La légende du bouclier de l'île se pose à gauche, hors des noms.
  expect(CAPTION_SIDE.cloud).toBe("left");
  const caption = captionBox(SCENE.shields.cloud, "Serveur de verdict", CAPTION_SIDE.cloud);
  for (const box of boxes) expect(overlap(caption, box)).toBe(false);
});

test("iso: exchanges link internal servers and Externals, costs and usage go to the console", () => {
  const ends = [pointAt(SCENE.exchange, 0), pointAt(SCENE.exchange, 1)];
  expect(inside(ends[0], zoneScene("serveurs").bounds, 12)).toBe(true);
  expect(inside(ends[1], zoneScene("externes").bounds, 12)).toBe(true);
  expect(SCENE.costs.map((cost) => cost.from)).toEqual(["postes-dev", "serveurs", "cloud"]);
  for (const cost of SCENE.costs) {
    expect(inside(pointAt(cost, 1), zoneScene("console").bounds)).toBe(true);
    expect(inside(pointAt(cost, 0), zoneScene(cost.from).bounds, 12)).toBe(true);
  }
});

test("iso: under reduced motion, every kind of flow has its frozen marks", () => {
  const frozen = frozenRequests();
  const count = (kind: string) => frozen.filter((mark) => mark.kind === kind).length;
  expect([count("request") + count("secret"), count("secret"), count("reply"), count("exchange"), count("cost")]).toEqual([12, 4, 8, 2, 3]);
  expect(new Set(frozen.map((mark) => mark.key)).size).toBe(frozen.length);
});
