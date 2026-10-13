import { expect, test } from "@playwright/test";

import { THREAT_GLOSSARY } from "../lib/threat-glossary";

/**
 * ai.xsom.fr, la division IA : le film d'ouverture, les prestations (reprises du site
 * de conseil), les deux produits, les équipes face à l'IA. Les films sont produits à
 * part (`films/`) : la page doit tenir sans eux.
 */
test("the home page opens on its film, declared without downloading it up front", async ({ page }) => {
  await page.goto("/");
  const film = page.locator("#home-film video");
  await expect(film).toHaveAttribute("src", "/signal-media/xsom-ia-home-fr.mp4");
  await expect(film).toHaveAttribute("poster", "/signal-media/xsom-ia-home-fr.jpg");
  await expect(film).toHaveAttribute("preload", "none");
  await expect(film).toHaveAttribute("aria-label", /division IA de xSOM Consulting/);
  expect(await film.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  await expect(page.locator(".guard-header .brand__name")).toHaveText("xSOM · IA");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("La division IA de xSOM.");
});

test("the services come from the consulting site and invent nothing", async ({ page }) => {
  await page.goto("/");
  const services = page.locator("#prestations");
  await expect(services.locator(".ai-card h3")).toHaveText([
    "Infrastructures IA & cloud souverain",
    "Données & MLOps",
    "Sécurité des pipelines IA",
  ]);
  await expect(services.locator(".ai-card").first()).toContainText("Dimensionner, héberger et exploiter les charges IA sous contrôle.");
  await expect(services.getByRole("link", { name: /IA & Souveraineté sur www\.xsom\.fr/ })).toHaveAttribute("href", "https://www.xsom.fr/ia-souverainete.html");
  // Aucun chiffre, aucun client, aucun tarif dans les prestations.
  const text = (await services.innerText()).replace(/\b(2007|DORA|NIS2|MLOps|AIOps|FinOps|HPC|GPU)\b/g, "");
  expect(text).not.toMatch(/\d\s?(%|€|\$|clients?)/);
});

test("the two products point to their own sites, and Fleet Gateway is only announced", async ({ page }) => {
  await page.goto("/");
  const products = page.locator("#produits");
  const fleet = products.locator(".ai-product").nth(0);
  await expect(fleet.getByRole("heading", { name: "xSOM Fleet" })).toBeVisible();
  await expect(fleet.locator(".ai-modules strong")).toHaveText(["Fleet Sièges", "Fleet Guard", "Fleet Gateway"]);
  await expect(fleet.locator(".ai-modules li").nth(2)).toContainText("À venir, sans date.");
  await expect(fleet.getByRole("link", { name: /Découvrir xSOM Fleet/ })).toHaveAttribute("href", "/fleet");
  const guard = products.locator(".ai-product").nth(1);
  await expect(guard.getByRole("heading", { name: "Secret Guard" })).toBeVisible();
  await expect(guard).toContainText("Apache-2.0");
  await expect(guard.getByRole("link", { name: /Découvrir Secret Guard/ })).toHaveAttribute("href", "/secret-guard");
  await expect(guard.getByRole("link", { name: /Code source/ })).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");
});

test("the home page carries its JSON-LD and no offer", async ({ request }) => {
  const html = await (await request.get("/", { headers: { host: "ai.xsom.fr" } })).text();
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
  expect(json).toBeTruthy();
  const data = JSON.parse(json!);
  expect(data["@type"]).toBe("WebSite");
  expect(data.publisher.name).toBe("xSOM Consulting");
  expect(data.offers).toBeUndefined();
  expect(html).toContain('property="og:image" content="https://ai.xsom.fr/signal-media/xsom-ia-home-fr.jpg"');
});

test("the hero respects reduced motion without downloading its video", async ({ page }) => {
  const videoRequests: string[] = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  page.on("request", (request) => {
    if (/xsom-ia-home-(?:fr|en)\.mp4(?:\?|$)/.test(request.url())) videoRequests.push(request.url());
  });
  await page.goto("/");
  const video = page.locator(".home-film__video");
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused)).toBe(true);
  expect(videoRequests).toEqual([]);
});

test("the home page speaks English with the same sections", async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  await context.addCookies([{ name: "xsom_lang", value: "en", url: baseURL! }]);
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The AI division of xSOM.");
  await expect(page.locator(".guard-header .brand__name")).toHaveText("xSOM · AI");
  await expect(page.locator("#prestations .ai-card")).toHaveCount(3);
  await expect(page.locator("#produits .ai-modules li").nth(2)).toContainText("Coming, no date.");
  await expect(page.locator("#home-film video")).toHaveAttribute("src", "/signal-media/xsom-ia-home-en.mp4");
  await context.close();
});

test("the campus heading stays readable on its dark illustration", async ({ page }) => {
  await page.goto("/");
  const color = await page.locator("#usages-heading").evaluate((heading) => getComputedStyle(heading).color);
  const [red, green, blue] = color.match(/\d+/g)!.map(Number);
  // Un titre clair sur un fond nuit : la somme des canaux le prouve (le noir fait 0, le blanc 765).
  expect(red + green + blue).toBeGreaterThan(600);
});

test("the campus opens each team over the illustration, with a keyboard", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator("#usages").getByRole("group", { name: "Les équipes" });
  const detail = page.locator("#campus-detail");
  await expect(detail).toBeHidden();
  for (const name of ["Équipes métier", "Équipes de développement", "Équipes modèles & données"]) {
    const tab = tabs.getByRole("button", { name: new RegExp(name) });
    await tab.focus();
    await page.keyboard.press("Enter");
    await expect(tab).toHaveAttribute("aria-pressed", "true");
    await expect(detail.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(detail.locator(".home-campus__lists li")).toHaveCount(6);
    const visuals = detail.getByRole("button", { name: /^Agrandir/ });
    await expect(visuals).toHaveCount(3);
    await visuals.first().click();
    const preview = page.getByRole("dialog");
    await expect(preview).toBeVisible();
    await expect(preview.getByText("Comment réduire le risque", { exact: true })).toBeVisible();
    // Échap ferme l'aperçu seul : le panneau de l'équipe reste ouvert.
    await page.keyboard.press("Escape");
    await expect(preview).toBeHidden();
    await expect(detail).toBeVisible();
    await tab.click();
    await expect(detail).toBeHidden();
  }
});

test("each team opens its own filtered cyber risks", async ({ page }) => {
  const teams = [
    { name: "Équipes de développement", use: "development" },
    { name: "Équipes métier", use: "workplace" },
    { name: "Équipes modèles & données", use: "models" },
  ] as const;

  for (const team of teams) {
    await page.goto("/");
    await page.locator("#usages").getByRole("group", { name: "Les équipes" })
      .getByRole("button", { name: new RegExp(team.name) }).click();
    const link = page.locator("#campus-detail").getByRole("link", {
      name: `Explorer les risques liés à mon équipe : ${team.name}`,
    });
    await expect(link).toHaveAttribute("href", `/menaces?use=${team.use}#definitions`);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/menaces\\?use=${team.use}#definitions$`));
    await expect(page.getByRole("group", { name: "Filtrer par usage IA" })
      .getByRole("button", { name: team.name, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".guard-glossary__row")).toHaveCount(
      THREAT_GLOSSARY.filter((entry) => entry.uses.includes(team.use)).length,
    );
  }
});

for (const width of [390, 768, 1440]) {
  test(`the home page stays contained in French and English at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) {
      // Trois cartes tiennent difficilement dans 390 px : elles doivent être EMPILÉES.
      const cards = page.locator("#prestations .ai-card");
      const first = await cards.nth(0).boundingBox();
      const second = await cards.nth(1).boundingBox();
      expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1);
    }
    // L'en-tête s'efface en descente et revient en haut de page ; sous 900 px, la
    // langue se choisit dans son menu.
    await page.evaluate(() => window.scrollTo(0, 0));
    const menu = page.getByRole("button", { name: "Menu", exact: true });
    if (await menu.isVisible()) await menu.click();
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The AI division of xSOM.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
