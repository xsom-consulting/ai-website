import { expect, test } from "@playwright/test";

/**
 * ai.xsom.fr, la division IA, réduite à l'essentiel et dans la charte de Fleet : qui
 * nous sommes, nos produits (xSOM Fleet en vedette, Secret Guard en open source), nos
 * prestations de conseil IA en quelques lignes, le contact. La couverture, comme celle
 * de www.xsom.fr, pose un film muet sans texte ; ni campus des équipes, ni encart du
 * glossaire (le glossaire reste dans le menu).
 */
test("the cover says who we are and opens on products and services", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".guard-header .brand__name")).toHaveText("xSOM · IA");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Conseil et produits pour l’IA d’entreprise.");
  const intro = page.locator("#intro");
  await expect(intro).toContainText("La division IA de xSOM Consulting");
  await expect(intro).toContainText("Cabinet indépendant depuis 2007.");
  // Les deux portes de la couverture mènent aux deux premières entrées du menu.
  await expect(intro.getByRole("link", { name: "Découvrir nos produits" })).toHaveAttribute("href", "#produits");
  await expect(intro.getByRole("link", { name: "Découvrir nos prestations" })).toHaveAttribute("href", "#prestations");
  // Le film : muet, en boucle, sans texte incrusté, et un bouton pour l'arrêter.
  const film = intro.locator("video");
  await expect(film).toHaveCount(1);
  await expect(film).toHaveJSProperty("muted", true);
  await expect(film).toHaveAttribute("loop", "");
  await expect(intro.getByRole("button", { name: /film/ })).toBeVisible();
  for (const id of ["home-film", "usages", "campus-detail"]) await expect(page.locator(`#${id}`)).toHaveCount(0);
  await expect(page.locator(".guard-glossary-link")).toHaveCount(0);
  await expect(page.locator(".xai")).toHaveClass(/\bxp\b/);
});

test("the products put xSOM Fleet first, say what it does and point to their own sites", async ({ page }) => {
  // Sans animation : la démonstration s'affiche directement dans son état final.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const products = page.locator("#produits");
  await expect(products.getByRole("heading", { level: 2 })).toHaveText("Aperçu de nos produits.");
  const fleet = products.locator(".ai-product").nth(0);
  await expect(fleet.getByRole("heading", { name: "xSOM Fleet" })).toBeVisible();
  await expect(fleet).toHaveClass(/ai-product--fleet/);
  await expect(fleet).toContainText("La plateforme de gestion de l’IA d’entreprise.");
  await expect(fleet.locator(".ai-verbs span")).toHaveText(["Optimiser", "Sécuriser", "Superviser"]);
  await expect(fleet.locator(".ai-feature strong")).toHaveText([
    "Optimiser votre facture IA.",
    "Les meilleures IA du marché, en toute sécurité.",
    "Superviser et tracer l’IA dans votre entreprise.",
  ]);
  // Les noms de modules ne sont plus affichés : la vitrine dit ce que fait la plateforme.
  await expect(fleet).not.toContainText("Fleet Gateway");
  // Les marques citées sont accompagnées de leur mention, le chiffre de sa source.
  await expect(fleet.locator(".ai-brand-chip")).toHaveText(["Claude Code", "Codex"]);
  await expect(fleet).toContainText("sans partenariat ni approbation");
  await expect(fleet.locator(".ai-proof")).toContainText("Mesure réelle chez xSOM, septembre 2026");
  // En développement : la plateforme se décrit par son architecture cible, dite comme telle.
  await expect(fleet.getByRole("img", { name: /^Architecture cible de xSOM Fleet, en développement/ })).toBeVisible();
  await expect(fleet.locator("figcaption")).toContainText("Architecture cible · en développement");
  await expect(fleet.getByRole("link", { name: /Découvrir xSOM Fleet/ })).toHaveAttribute("href", "/fleet");

  const guard = products.locator(".ai-product").nth(1);
  await expect(guard.getByRole("heading", { name: "Secret Guard" })).toBeVisible();
  await expect(guard).toContainText("Apache-2.0");
  await expect(guard).toContainText("Pour les entreprises et les indépendants");
  // Ce qui fonctionne se montre en action : l'expurgation, avec le marqueur réel de
  // l'extension. Dans son état final, le modèle n'a reçu que le marqueur.
  const demo = guard.getByRole("group", { name: /^Secret Guard en action dans VS Code/ });
  await expect(demo).toBeVisible();
  await expect(demo.locator(".ai-vsc__received")).toContainText("<REDACTED_aws_access_key_id>");
  await expect(demo.locator(".ai-vsc__results li")).toHaveText(["Le prompt est parti : le développeur continue.", "La clé est restée sur le poste."]);
  await expect(demo.getByRole("button", { name: /Rejouer/ })).toBeVisible();
  await expect(guard).toContainText("Extension VS Code · nouvelle version en préparation");
  await expect(guard.getByRole("link", { name: /Découvrir Secret Guard/ })).toHaveAttribute("href", "/secret-guard");
  await expect(guard.getByRole("link", { name: /Code source/ })).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");
});

test("the Secret Guard demo plays once when it comes into view, then rests on its outcome", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const demo = page.locator(".ai-vsc");
  // Hors de la vue, la démonstration attend à sa première étape.
  await expect(demo).not.toHaveClass(/\bs9\b/);
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveClass(/\bs9\b/, { timeout: 15_000 });
  await expect(demo.locator(".ai-vsc__marker")).toBeVisible();
  await expect(demo.locator(".ai-vsc__results li").last()).toBeVisible();
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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Consulting and products for enterprise AI.");
  await expect(page.locator(".guard-header .brand__name")).toHaveText("xSOM · AI");
  await expect(page.locator("#produits .ai-product")).toHaveCount(2);
  await expect(page.locator("#produits .ai-verbs span")).toHaveText(["Optimise", "Secure", "Oversee"]);
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
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Consulting and products for enterprise AI.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
