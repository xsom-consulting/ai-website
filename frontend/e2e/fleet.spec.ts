import { expect, test } from "@playwright/test";

/**
 * La page xSOM Fleet : film d'ouverture, promesse, définition de la plateforme et ses
 * trois modules, « Pourquoi choisir xSOM Fleet », cinq films « Comment ça marche »,
 * licences et engagements, questions, métadonnées et données structurées. Les films sont produits à part (`films/`) : la page doit
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
  await expect(page.locator("h1")).toContainText("La sécurité reste chez vous.");
  await expect(page.locator(".fl-faq details")).toHaveCount(7);
  expect(videos).toEqual([]);
  expect(errors).toEqual([]);
  await context.close();
});

test("the Fleet page carries its own title, Open Graph poster and JSON-LD", async ({ request }) => {
  const html = await (await request.get("/", { headers: { host: "fleet.xsom.fr" } })).text();
  expect(html).toContain("<title>xSOM Fleet · la plateforme de gouvernance de vos IA</title>");
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
  await expect(page.locator("h1")).toContainText("The best AI for your whole company.");
  await expect(page.locator("#modules h2")).toHaveText("xSOM Fleet governs all your AI.");
  await expect(page.locator("#modules .fl-module").nth(2)).toContainText("Available for pilot");
  await expect(page.locator("#pourquoi .fl-tile h3")).toHaveText(["Cost", "Pricing", "FinOps steering", "One security layer for all your AI"]);
  await expect(page.locator("#engagements h2")).toHaveText("Licences, sources and commitments.");
  await expect(page.locator("#home-film video")).toHaveAttribute("src", "/signal-media/xsom-fleet-hero-en.mp4");
  await expect(page.locator("#fonctionnement figcaption", { hasText: "Demonstration · illustrative data" })).toHaveCount(STEPS.length);
  await expect(page.locator(".fl-faq details")).toHaveCount(7);
  await expect(page.locator("#questions").getByRole("link", { name: "Talk to our team" })).toHaveAttribute("href", /^mailto:/);
  await context.close();
});

test("the hero shows the assistants by name and logo, and an animated illustration", async ({ page }) => {
  await page.goto("/fleet");
  const hosts = page.locator("#promesse .fl-hero__hosts");
  await expect(hosts.locator("li")).toHaveText([/Claude Code/, /Codex/, /applications API/]);
  await expect(hosts.locator("img")).toHaveCount(2);
  const visual = page.locator("#promesse .fl-visual");
  await expect(visual).toHaveAttribute("role", "img");
  await expect(visual).toHaveAttribute("aria-label", /Politique signée/);
  // L'illustration ne porte qu'une clé masquée, jamais une valeur.
  await expect(visual).toContainText("AKIA••••••••");
});

test("the Fleet page defines the platform in one short sentence, Fleet Gateway offered for pilot", async ({ page }) => {
  await page.goto("/fleet");
  await expect(page.locator("#modules h2")).toHaveText("xSOM Fleet gouverne toutes vos IA.");
  await expect(page.locator("#modules .fl-platform__sub")).toContainText("Claude Code et Codex sur chaque Poste");
  await expect(page.locator("#modules .fl-platform__sub")).toContainText("D’autres assistants suivront.");
  const modules = page.locator("#modules .fl-module");
  await expect(modules.locator("h3")).toHaveText(["Fleet Sièges", "Fleet Guard", "Fleet Gateway"]);
  await expect(modules.nth(2)).toContainText("Disponible pour pilote");
  await expect(modules.nth(2)).not.toContainText(/\b20\d{2}\b/);
  await expect(modules.nth(1).getByRole("link", { name: /Secret Guard/ })).toHaveAttribute("href", "/secret-guard");
});

test("the reasons grid carries no price and no gain figure, and labels its demo data", async ({ page }) => {
  await page.goto("/fleet");
  const section = page.locator("#pourquoi");
  await expect(section.locator(".fl-tile h3")).toHaveText(["Coût", "Tarif", "Pilotage FinOps", "Une sécurité unique pour toutes vos IA"]);
  const text = await section.innerText();
  expect(text).not.toMatch(/\d\s?%/);
  expect(text).not.toMatch(/\d\s?(€|\$)|(€|\$)\s?\d/);
  await expect(section.locator(".fl-demo")).toHaveCount(3);
  await expect(section.locator(".fl-demo").first()).toHaveText("Démonstration · données illustratives");
  await expect(section.getByRole("link", { name: "Demander la simulation pour votre entreprise" })).toHaveAttribute("href", /^mailto:/);
  await expect(section).toContainText("Simulation · hypothèses affichées");
  await expect(section.getByRole("link", { name: "Demander un tarif" })).toHaveAttribute("href", /^mailto:.*tarif/);
});

test("licences, sources and commitments replace the former limits and proof sections", async ({ page }) => {
  await page.goto("/fleet");
  const section = page.locator("#engagements");
  await expect(section.locator("h2")).toHaveText("Licences, sources et engagements.");
  await expect(section.getByRole("link", { name: /Code source de Secret Guard/ })).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");
  await expect(section.locator(".fl-badge strong")).toHaveText(["Apache-2.0", "MIT", "SBOM", "UE", "0 prompt"]);
  for (const text of ["Apache-2.0", "LiteLLM", "MIT", "CycloneDX", "Ni prompt, ni clé, ni code, ni valeur d’un secret", "Union européenne", "JSON et en PDF", "chaînés"]) {
    await expect(section).toContainText(text);
  }
  await expect(page.locator("#preuves")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Ce que xSOM ne fait jamais." })).toHaveCount(0);
  // Une seule action après les questions : le contact.
  await expect(page.locator("#questions").getByRole("link", { name: "Parler à notre équipe" })).toHaveAttribute("href", /^mailto:/);
  await expect(page.locator(".fl-cta")).toHaveCount(0);
});

test("the Fleet page keeps its sections reachable from the menu", async ({ page }) => {
  await page.goto("/fleet");
  for (const id of ["promesse", "modules", "pourquoi", "fonctionnement", "engagements", "questions"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
  const menu = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(menu.getByRole("link", { name: "Pourquoi Fleet" })).toHaveAttribute("href", "/fleet#pourquoi");
  await expect(menu.getByRole("link", { name: "Engagements" })).toHaveAttribute("href", "/fleet#engagements");
});

test("the Fleet page names no real customer and promises no certification", async ({ request }) => {
  const html = (await (await request.get("/", { headers: { host: "fleet.xsom.fr" } })).text()).toLowerCase();
  for (const word of ["certifié", "garanti", "conforme", "orchestrateur", "partenaire", "validé par"]) expect(html).not.toContain(word);
});
