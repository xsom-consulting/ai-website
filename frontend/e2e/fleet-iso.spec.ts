import { expect, test } from "@playwright/test";
import { DRAW_ORDER, SCENE, SHIELD_ORDER, labelBox, pointAt, project, sceneView, union, zoneScene, zoomOn } from "../components/fleet/fleet-iso";

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
