import { expect, test } from "@playwright/test";

/**
 * La page xSOM Fleet : promesse et illustration animée, définition de la plateforme, ligne
 * « Pris en charge » et trois solutions, « Pourquoi choisir xSOM Fleet », le film
 * « Comment ça marche » avec voix off et chapitres,
 * licences et engagements, questions, métadonnées et données structurées. Les films sont produits à part (`films/`) : la page doit
 * tenir sans eux, et ne rien télécharger quand le mouvement est réduit.
 */
const CHAPTERS = ["choose", "policy", "coverage", "invisible", "costs", "proof"];

test("the Fleet page declares its single film without downloading it up front", async ({ page }) => {
  await page.goto("/fleet");
  // Aucun film d'accueil : seul « Comment ça marche » est une vidéo.
  await expect(page.locator("video")).toHaveCount(1);
  await expect(page.locator("#home-film")).toHaveCount(0);
  // « Comment ça marche » : un seul film, avec voix off, son activable, et ses chapitres.
  const how = page.locator("#fonctionnement video");
  await expect(how).toHaveCount(1);
  await expect(how).toHaveAttribute("src", "/signal-media/xsom-fleet-how-v2-fr.mp4");
  await expect(how).toHaveAttribute("poster", "/signal-media/xsom-fleet-how-v2-fr.jpg");
  await expect(how).toHaveAttribute("preload", "none");
  await expect(how).toHaveAttribute("aria-label", /voix off/);
  await expect(page.locator("#fonctionnement").getByRole("button", { name: "Activer le son" })).toBeVisible();
  const chapters = page.locator("#fonctionnement .fl-chapter");
  await expect(chapters).toHaveCount(CHAPTERS.length);
  for (const id of CHAPTERS) await expect(page.locator(`#etape-${id}`)).toHaveCount(1);
  await expect(page.locator("#fonctionnement figcaption", { hasText: "Démonstration · données illustratives" })).toHaveCount(1);
});

test("the old films are gone from the page and from the media folder", async ({ page, request }) => {
  await page.goto("/fleet");
  const html = await page.content();
  for (const id of ["orgs", "block"]) expect(html).not.toContain(`xsom-fleet-how-${id}-`);
  expect(html).not.toContain("xsom-fleet-hero");
  for (const file of ["xsom-fleet-hero-fr.mp4", "xsom-fleet-how-orgs-fr.mp4", "xsom-fleet-hero-v2-fr.mp4", "xsom-fleet-hero-v2-en.mp4", "xsom-fleet-hero-v2-fr.jpg", "xsom-fleet-hero-v2-en.jpg"]) {
    expect((await request.get(`/signal-media/${file}`)).status()).toBe(404);
  }
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
  await expect(page.locator("h1")).toHaveText("Les meilleurs modèles d’IA du marché, aux standards de sécurité de l’entreprise.");
  await expect(page.locator(".fl-faq details")).toHaveCount(7);
  expect(videos).toEqual([]);
  expect(errors).toEqual([]);
  await context.close();
});

test("the Fleet page carries its own title, Open Graph poster and JSON-LD", async ({ request }) => {
  const html = await (await request.get("/", { headers: { host: "fleet.xsom.fr" } })).text();
  expect(html).toContain("<title>xSOM Fleet · les meilleurs modèles d’IA, aux standards de sécurité de l’entreprise</title>");
  expect(html).toContain('property="og:image" content="https://fleet.xsom.fr/signal-media/xsom-fleet-og-fr.jpg"');
  expect((await request.get("/signal-media/xsom-fleet-og-fr.jpg")).status()).toBe(200);
  expect((await request.get("/signal-media/xsom-fleet-og-en.jpg")).status()).toBe(200);
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
  await expect(page.locator("h1")).toHaveText("The best AI models on the market, at enterprise security standards.");
  await expect(page.locator("#modules h2")).toHaveText("Steer your whole AI architecture from one place: subscriptions, API keys and models hosted on your side.");
  await expect(page.locator("#modules .fl-module h3")).toHaveText(["FinOps solution", "Cybersecurity solution", "AI architecture and strategy solution"]);
  await expect(page.locator("#modules .fl-module").nth(2)).toContainText("Available for pilot");
  await expect(page.locator("#pourquoi .fl-tile h3")).toHaveText(["Cost", "Pricing", "FinOps steering", "One security layer for all your AI"]);
  await expect(page.locator("#engagements h2")).toHaveText("Licences, sources and commitments.");
  await expect(page.locator("#fonctionnement video")).toHaveAttribute("src", "/signal-media/xsom-fleet-how-v2-en.mp4");
  await expect(page.locator("#fonctionnement").getByRole("button", { name: "Turn sound on" })).toBeVisible();
  await expect(page.locator("#fonctionnement figcaption", { hasText: "Demonstration · illustrative data" })).toHaveCount(1);
  const cost = page.locator("#pourquoi .fl-tile--cost");
  await expect(cost).toContainText("Measured at xSOM in September 2026, across two assistants: $8,988 of usage at API rates.");
  await expect(cost).toContainText("Claude plan at $200 per month (€216 incl. VAT): $7,815 of usage at API rates, 39 times its price.");
  await expect(cost).toContainText("Codex plan at €103 incl. VAT per month: $1,173 of usage at API rates.");
  await expect(page.locator(".fl-faq details")).toHaveCount(7);
  await expect(page.locator("#questions").getByRole("link", { name: "Talk to our team" })).toHaveAttribute("href", /^mailto:/);
  await context.close();
});

test("the hero states the promise next to an animated illustration", async ({ page }) => {
  await page.goto("/fleet");
  await expect(page.locator("#promesse .fl-hero__lead")).toHaveText("Coût maîtrisé, contrôle sur chaque Poste, preuves pour l’audit.");
  const visual = page.locator("#promesse .fl-visual");
  await expect(visual).toHaveAttribute("role", "img");
  await expect(visual).toHaveAttribute("aria-label", /Politique signée/);
  // L'illustration ne porte qu'une clé masquée, jamais une valeur.
  await expect(visual).toContainText("AKIA••••••••");
});

test("the Fleet page defines the platform, shows what it supports and its three solutions", async ({ page }) => {
  await page.goto("/fleet");
  await expect(page.locator("#modules h2")).toHaveText("Pilotez toute votre architecture IA en un seul endroit : abonnements, clés API et modèles hébergés chez vous.");
  const supported = page.locator("#modules .fl-supported");
  await expect(supported).toContainText("Pris en charge");
  await expect(supported.locator("li")).toHaveText([/Claude\s+Claude Code/, /ChatGPT\s+Codex/, /Modèles par API/, /Vos modèles\s+hébergés chez vous/]);
  // Aucun fournisseur d'API nommé tant que la version de LiteLLM n'est pas épinglée.
  await expect(supported).not.toContainText(/Mistral|Gemini|Bedrock|Azure/);
  const modules = page.locator("#modules .fl-module");
  await expect(modules.locator("h3")).toHaveText(["Solution FinOps", "Solution cybersécurité", "Solution architecture et stratégie IA"]);
  await expect(modules.locator(".fl-module__name")).toHaveText(["Fleet Sièges", "Fleet Guard", "Fleet Gateway"]);
  await expect(modules.nth(2)).toContainText("Disponible pour pilote");
  await expect(modules.nth(2)).not.toContainText(/\b20\d{2}\b/);
  await expect(modules.nth(1).getByRole("link", { name: /Secret Guard/ })).toHaveAttribute("href", "/secret-guard");
});

test("the reasons grid shows only the sourced measurement, and labels its demo data", async ({ page }) => {
  await page.goto("/fleet");
  const section = page.locator("#pourquoi");
  await expect(section.locator(".fl-tile h3")).toHaveText(["Coût", "Tarif", "Pilotage FinOps", "Une sécurité unique pour toutes vos IA"]);
  const cost = section.locator(".fl-tile--cost");
  await expect(cost).toContainText("Profitez des forfaits d’abonnement entreprise");
  await expect(cost).toContainText("Mesuré chez xSOM en septembre 2026, sur deux assistants : 8 988 $ d’usage au tarif API.");
  await expect(cost).toContainText("Forfait Claude à 200 $ par mois (216 € TTC) : 7 815 $ d’usage au tarif API, 39 fois son prix.");
  await expect(cost).toContainText("Forfait Codex à 103 € TTC par mois : 1 173 $ d’usage au tarif API.");
  await expect(cost).toContainText("Relevé avec ccusage (outil libre)");
  // Les seuls montants de la grille sont ceux de la mesure, montrée par sa capture.
  const others = await section.locator(".fl-tile:not(.fl-tile--cost)").allInnerTexts();
  for (const text of others) {
    expect(text).not.toMatch(/\d\s?%/);
    expect(text).not.toMatch(/\d\s?(€|\$)|(€|\$)\s?\d/);
  }
  await expect(cost).not.toContainText(/\b190\b|\b41\b/);
  await expect(section.locator(".fl-demo")).toHaveCount(2);
  await expect(section.locator(".fl-demo").first()).toHaveText("Démonstration · données illustratives");
  await expect(section.getByRole("link", { name: "Demander la simulation pour votre entreprise" })).toHaveAttribute("href", /^mailto:/);
  await expect(section).toContainText("Simulation · hypothèses affichées");
  await expect(section.getByRole("link", { name: "Demander un tarif" })).toHaveAttribute("href", /^mailto:.*tarif/);
});

test("the ccusage capture opens large and scrolls inside its frame on a phone", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/fleet`);
  const thumb = page.locator(".fl-capture__thumb img");
  await expect(thumb).toHaveAttribute("src", "/signal-media/xsom-ccusage-2026-09.webp");
  await expect(thumb).toHaveAttribute("alt", /\$7814\.73.*\$1173\.27.*\$8988\.00/);
  await page.getByRole("button", { name: /Voir le relevé ccusage/ }).click();
  const dialog = page.locator(".fl-capture__dialog");
  await expect(dialog).toBeVisible();
  const frame = dialog.locator(".fl-capture__scroll");
  expect(await frame.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await dialog.getByRole("button", { name: /Fermer le relevé/ }).click();
  await expect(dialog).toBeHidden();
  await context.close();
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
