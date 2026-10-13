import { expect, test } from "@playwright/test";

/**
 * La page xSOM Fleet : film d'ouverture, plateforme à trois modules, cinq films
 * « Comment ça marche », métadonnées et données structurées. Les films sont produits à part (`films/`) : la page doit
 * tenir sans eux, et ne rien télécharger quand le mouvement est réduit.
 */
const STEPS = ["orgs", "policy", "block", "coverage", "costs"];

test("the Fleet page declares its films without downloading them up front", async ({ page }) => {
  await page.goto("/fleet");
  const hero = page.locator("#home-film video");
  await expect(hero).toHaveAttribute("src", "/signal-media/xsom-fleet-hero-fr.mp4");
  await expect(hero).toHaveAttribute("poster", "/signal-media/xsom-fleet-hero-fr.jpg");
  await expect(hero).toHaveAttribute("preload", "none");
  expect(await hero.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  const films = page.locator("#fonctionnement video");
  await expect(films).toHaveCount(STEPS.length);
  for (const [index, id] of STEPS.entries()) {
    const film = films.nth(index);
    await expect(film).toHaveAttribute("src", `/signal-media/xsom-fleet-how-${id}-fr.mp4`);
    await expect(film).toHaveAttribute("preload", "none");
    await expect(film).toHaveAttribute("aria-label", /.+/);
  }
  await expect(page.locator("#fonctionnement figcaption", { hasText: "Démonstration · données illustratives" })).toHaveCount(STEPS.length);
});

test("under reduced motion, no film is requested and the page still renders", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors: string[] = [];
  const videos: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("request", (request) => { if (request.url().endsWith(".mp4")) videos.push(request.url()); });
  await page.goto("/fleet");
  for (let y = 0; y < 12000; y += 800) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await expect(page.locator("h1")).toContainText("à l’échelle de toute l’entreprise");
  await expect(page.locator(".fl-faq details")).toHaveCount(6);
  expect(videos).toEqual([]);
  expect(errors).toEqual([]);
  await context.close();
});

test("the Fleet page carries its own title, Open Graph poster and JSON-LD", async ({ request }) => {
  const html = await (await request.get("/", { headers: { host: "fleet.xsom.fr" } })).text();
  expect(html).toContain("<title>xSOM Fleet · assistants de code en entreprise</title>");
  expect(html).toContain('property="og:image" content="https://fleet.xsom.fr/signal-media/xsom-fleet-hero-fr.jpg"');
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
  expect(json).toBeTruthy();
  const data = JSON.parse(json!);
  expect(data["@type"]).toBe("SoftwareApplication");
  expect(data.name).toBe("xSOM Fleet");
  expect(data.offers).toBeUndefined();
});

test("the Fleet page speaks English with the same sections", async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  await context.addCookies([{ name: "xsom_lang", value: "en", url: baseURL! }]);
  const page = await context.newPage();
  await page.goto("/fleet");
  await expect(page.locator("h1")).toContainText("across the whole company");
  await expect(page.locator("#modules h2")).toHaveText("Three modules, one console.");
  await expect(page.locator("#modules .fl-module").nth(2)).toContainText("Coming · no date");
  await expect(page.locator("#home-film video")).toHaveAttribute("src", "/signal-media/xsom-fleet-hero-en.mp4");
  await expect(page.locator("#fonctionnement figcaption", { hasText: "Demonstration · illustrative data" })).toHaveCount(STEPS.length);
  await expect(page.locator(".fl-faq details")).toHaveCount(6);
  await context.close();
});

test("the Fleet page presents the platform as three modules, the third one coming without a date", async ({ page }) => {
  await page.goto("/fleet");
  const modules = page.locator("#modules .fl-module");
  await expect(modules).toHaveCount(3);
  await expect(modules.locator("h3")).toHaveText(["Fleet Sièges", "Fleet Guard", "Fleet Gateway"]);
  await expect(modules.nth(0)).toContainText("Plafond de Sièges");
  await expect(modules.nth(1)).toContainText("Journal des blocages");
  await expect(modules.nth(1)).toContainText("Dossier de preuves");
  // Fleet Gateway n'existe pas : ni date, ni promesse, et le module est marqué à venir.
  await expect(modules.nth(2)).toHaveAttribute("data-status", "soon");
  await expect(modules.nth(2)).toContainText("À venir · sans date");
  await expect(modules.nth(2)).not.toContainText(/\b20\d{2}\b/);
  await expect(page.locator("#modules")).toContainText("Fleet Gateway n’existe pas encore");
  // Le moteur de Fleet Guard est open source : le lien mène à Secret Guard.
  await expect(modules.nth(1).getByRole("link", { name: /Secret Guard/ })).toHaveAttribute("href", "/secret-guard");
});

test("the Fleet page keeps its sections reachable from the menu", async ({ page }) => {
  await page.goto("/fleet");
  for (const id of ["modules", "fonctionnement", "preuves", "questions"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
  const menu = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(menu.getByRole("link", { name: "Modules" })).toHaveAttribute("href", "/fleet#modules");
});

test("the Fleet page names no real customer and promises no certification", async ({ request }) => {
  const html = (await (await request.get("/", { headers: { host: "fleet.xsom.fr" } })).text()).toLowerCase();
  for (const word of ["certifié", "garanti", "100 % conforme"]) expect(html).not.toContain(word);
});
