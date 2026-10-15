import { expect, test } from "@playwright/test";

/**
 * Trois adresses publiques, un seul déploiement (`lib/sites.ts`). L'en-tête `Host`
 * simule chaque adresse ; les redirections sont lues sans être suivies. Une adresse
 * inconnue (localhost, prévisualisation) sert toutes les pages.
 */
const cases: [host: string, path: string, status: number, location?: string][] = [
  ["fleet.xsom.fr", "/", 200],
  ["fleet.xsom.fr", "/fleet", 308, "https://fleet.xsom.fr/"],
  ["fleet.xsom.fr", "/menaces", 308, "https://ai.xsom.fr/menaces"],
  ["fleet.xsom.fr", "/produits", 308, "https://ai.xsom.fr/#produits"],
  ["fleet.xsom.fr", "/mentions-legales", 200],
  ["fleet.xsom.fr", "/login", 404],
  ["guard.xsom.fr", "/", 200],
  ["guard.xsom.fr", "/secret-guard", 308, "https://guard.xsom.fr/"],
  ["guard.xsom.fr", "/produits", 308, "https://ai.xsom.fr/#produits"],
  ["guard.xsom.fr", "/fleet", 308, "https://fleet.xsom.fr/"],
  ["guard.xsom.fr", "/confidentialite", 200],
  ["guard.xsom.fr", "/login", 404],
  ["ai.xsom.fr", "/", 200],
  ["ai.xsom.fr", "/secret-guard?ref=nav", 308, "https://guard.xsom.fr/?ref=nav"],
  ["ai.xsom.fr", "/fleet", 308, "https://fleet.xsom.fr/"],
  ["ai.xsom.fr", "/menaces", 200],
  ["ai.xsom.fr", "/produits", 308, "https://ai.xsom.fr/#produits"],
  ["ai.xsom.fr", "/cookies", 200],
  ["ai.xsom.fr", "/login", 404],
  ["localhost:3100", "/", 200],
  ["localhost:3100", "/fleet", 200],
  ["localhost:3100", "/secret-guard", 200],
  ["localhost:3100", "/menaces", 200],
  ["localhost:3100", "/conditions-utilisation", 200],
];

for (const [host, path, status, location] of cases) {
  test(`${host}${path} → ${status}`, async ({ request }) => {
    const response = await request.get(path, { headers: { host }, maxRedirects: 0 });
    expect(response.status()).toBe(status);
    if (location) expect(response.headers().location).toBe(location);
  });
}

test("hors des trois adresses, l'ancienne adresse des produits mène à la section qui la remplace", async ({ request }) => {
  const response = await request.get("/produits", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/#produits");
});

test("fleet.xsom.fr shows the Fleet page at its root", async ({ request }) => {
  const response = await request.get("/", { headers: { host: "fleet.xsom.fr" } });
  expect(await response.text()).toContain("des règles communes.");
});

test("guard.xsom.fr shows Secret Guard at its root", async ({ request }) => {
  const response = await request.get("/", { headers: { host: "guard.xsom.fr" } });
  expect(await response.text()).toContain("avant qu’ils ne partent.");
});

test("ai.xsom.fr shows the AI division at its root", async ({ request }) => {
  const response = await request.get("/", { headers: { host: "ai.xsom.fr" } });
  expect(await response.text()).toContain("Des bases solides pour vos projets IA.");
});

/** Titre, adresse canonique et marque de chaque site, lus dans la première réponse. */
const metadata: [host: string, title: string, canonical: string][] = [
  ["ai.xsom.fr", "xSOM · IA · la division IA de xSOM Consulting", "https://ai.xsom.fr/"],
  ["fleet.xsom.fr", "xSOM Fleet · Gouvernance des usages IA en entreprise", "https://fleet.xsom.fr/"],
  ["guard.xsom.fr", "Secret Guard · détection de secrets open source", "https://guard.xsom.fr/"],
];

for (const [host, title, canonical] of metadata) {
  test(`${host} declares its own title and canonical address`, async ({ request }) => {
    const html = await (await request.get("/", { headers: { host } })).text();
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toMatch(new RegExp(`<link rel="canonical" href="${canonical.replace(/\/$/, "")}/?"/>`));
    expect(html).not.toContain("AI Studio");
    expect(html).not.toContain("AI Guard");
  });
}

test("a legal page is common to the three addresses, with each address's canonical", async ({ request }) => {
  for (const [host, origin] of [["ai.xsom.fr", "https://ai.xsom.fr"], ["fleet.xsom.fr", "https://fleet.xsom.fr"], ["guard.xsom.fr", "https://guard.xsom.fr"]]) {
    const html = await (await request.get("/mentions-legales", { headers: { host } })).text();
    expect(html).toContain(`<link rel="canonical" href="${origin}/mentions-legales"/>`);
    expect(html).toContain("Mentions légales");
  }
});

test("robots.txt, sitemap.xml and llms.txt follow the host", async ({ request }) => {
  const get = async (path: string, host: string) => (await request.get(path, { headers: { host } })).text();

  for (const [host, origin] of [["ai.xsom.fr", "https://ai.xsom.fr"], ["fleet.xsom.fr", "https://fleet.xsom.fr"], ["guard.xsom.fr", "https://guard.xsom.fr"]]) {
    const robots = await get("/robots.txt", host);
    expect(robots).toContain("Allow: /");
    expect(robots).toContain(`Sitemap: ${origin}/sitemap.xml`);
    const sitemap = await get("/sitemap.xml", host);
    expect(sitemap).toContain(`<loc>${origin}/</loc>`);
    for (const other of ["https://ai.xsom.fr", "https://fleet.xsom.fr", "https://guard.xsom.fr"].filter((o) => o !== origin)) {
      expect(sitemap).not.toContain(other);
    }
  }
  expect(await get("/sitemap.xml", "ai.xsom.fr")).toContain("<loc>https://ai.xsom.fr/menaces</loc>");

  expect(await get("/llms.txt", "ai.xsom.fr")).toMatch(/^# xSOM · IA/);
  expect(await get("/llms.txt", "fleet.xsom.fr")).toMatch(/^# xSOM Fleet/);
  const guard = await get("/llms.txt", "guard.xsom.fr");
  expect(guard).toMatch(/^# Secret Guard/);
  expect(guard).toContain("https://github.com/xsom-consulting/secret-guard");

  // Hors des trois adresses, rien n'est à indexer.
  expect(await get("/robots.txt", "localhost:3100")).toBe("User-agent: *\nDisallow: /\n");
  expect(await get("/sitemap.xml", "localhost:3100")).not.toContain("<loc>");
});
