import { expect, test } from "@playwright/test";

/**
 * ai.xsom.fr, la division IA, réduite à l'essentiel et dans la charte de Fleet : qui
 * nous sommes, nos produits (xSOM Fleet en vedette, Secret Guard en open source), nos
 * prestations de conseil IA en quelques lignes, le contact. Ni film, ni campus des
 * équipes, ni encart du glossaire (le glossaire reste dans le menu).
 */
test("the home page says who we are, without an opening film", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".guard-header .brand__name")).toHaveText("xSOM · IA");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("La division IA de xSOM Consulting.");
  await expect(page.locator("#intro")).toContainText("Cabinet indépendant depuis 2007.");
  await expect(page.locator("video")).toHaveCount(0);
  for (const id of ["home-film", "usages", "campus-detail"]) await expect(page.locator(`#${id}`)).toHaveCount(0);
  await expect(page.locator(".guard-glossary-link")).toHaveCount(0);
  await expect(page.locator(".xai")).toHaveClass(/\bxp\b/);
});

test("the products put xSOM Fleet first and point to their own sites", async ({ page }) => {
  await page.goto("/");
  const products = page.locator("#produits");
  const fleet = products.locator(".ai-product").nth(0);
  await expect(fleet.getByRole("heading", { name: "xSOM Fleet" })).toBeVisible();
  await expect(fleet).toHaveClass(/ai-product--fleet/);
  await expect(fleet.locator(".ai-modules strong")).toHaveText(["Fleet Guard", "Fleet Sièges", "Fleet Gateway"]);
  await expect(fleet.locator(".ai-modules li").nth(2)).toContainText("Disponible pour pilote.");
  await expect(fleet.getByRole("link", { name: /Découvrir xSOM Fleet/ })).toHaveAttribute("href", "/fleet");
  const guard = products.locator(".ai-product").nth(1);
  await expect(guard.getByRole("heading", { name: "Secret Guard" })).toBeVisible();
  await expect(guard).toContainText("Apache-2.0");
  await expect(guard.getByRole("link", { name: /Découvrir Secret Guard/ })).toHaveAttribute("href", "/secret-guard");
  await expect(guard.getByRole("link", { name: /Code source/ })).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");
});

test("the services come from the consulting site, in a few lines, and invent nothing", async ({ page }) => {
  await page.goto("/");
  const services = page.locator("#prestations");
  await expect(services.locator(".ai-service h3")).toHaveText([
    "Infrastructures IA & cloud souverain",
    "Données & MLOps",
    "Sécurité des pipelines IA",
  ]);
  await expect(services.locator(".ai-service").first()).toContainText("Dimensionner, héberger et exploiter les charges IA sous contrôle.");
  await expect(services.getByRole("link", { name: /IA & Souveraineté sur www\.xsom\.fr/ })).toHaveAttribute("href", "https://www.xsom.fr/ia-souverainete.html");
  const text = (await services.innerText()).replace(/\b(MLOps)\b/g, "");
  expect(text).not.toMatch(/\d\s?(%|€|\$|clients?)/);
});

test("the contact closes the page", async ({ page }) => {
  await page.goto("/");
  const contact = page.locator("#contact");
  await expect(contact.getByRole("heading", { name: "Un projet IA ?" })).toBeVisible();
  await expect(contact.getByRole("link", { name: "Écrire à xSOM" })).toHaveAttribute("href", /^mailto:/);
});

test("the home page carries its JSON-LD, its own Open Graph image and no offer", async ({ request }) => {
  const html = await (await request.get("/", { headers: { host: "ai.xsom.fr" } })).text();
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
  expect(json).toBeTruthy();
  const data = JSON.parse(json!);
  expect(data["@type"]).toBe("WebSite");
  expect(data.publisher.name).toBe("xSOM Consulting");
  expect(data.offers).toBeUndefined();
  expect(html).toContain('property="og:image" content="https://ai.xsom.fr/signal-media/xsom-ia-og-fr.jpg"');
  expect((await request.get("/signal-media/xsom-ia-og-fr.jpg")).status()).toBe(200);
  expect((await request.get("/signal-media/xsom-ia-og-en.jpg")).status()).toBe(200);
  for (const word of ["certifié", "garanti", "conforme", "orchestrateur"]) expect(html.toLowerCase()).not.toContain(word);
});

test("the home page speaks English with the same sections", async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  await context.addCookies([{ name: "xsom_lang", value: "en", url: baseURL! }]);
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The AI division of xSOM Consulting.");
  await expect(page.locator(".guard-header .brand__name")).toHaveText("xSOM · AI");
  await expect(page.locator("#produits .ai-product")).toHaveCount(2);
  await expect(page.locator("#produits .ai-modules li").nth(2)).toContainText("Available for pilot.");
  await expect(page.locator("#prestations .ai-service")).toHaveCount(3);
  await expect(page.locator("#contact").getByRole("link", { name: "Write to xSOM" })).toHaveAttribute("href", /^mailto:/);
  await context.close();
});

for (const width of [390, 768, 1440]) {
  test(`the home page stays contained in French and English at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) {
      const cards = page.locator("#prestations .ai-service");
      const first = await cards.nth(0).boundingBox();
      const second = await cards.nth(1).boundingBox();
      expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1);
    }
    // Sous 900 px, la langue se choisit dans le menu.
    const menu = page.getByRole("button", { name: "Menu", exact: true });
    if (await menu.isVisible()) await menu.click();
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The AI division of xSOM Consulting.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
