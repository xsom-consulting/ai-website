import { expect, test } from "@playwright/test";

/**
 * La page xSOM Fleet, lue comme un dossier de présentation : la couverture (la plateforme
 * en un mot et son schéma), trois piliers en chapitres numérotés (sécurité, FinOps,
 * stratégie), la démo vidéo, les licences et engagements, les questions et l'appel
 * final. Un indicateur de progression discret. Le film est produit à part (`films/`) :
 * la page doit tenir sans lui, et ne rien télécharger quand le mouvement est réduit.
 */
const CHAPTERS = ["securite", "finops", "strategie", "film", "engagements", "questions"];
const FILM_CHAPTERS = ["choose", "policy", "coverage", "invisible", "costs", "proof"];

test("the cover names the platform in a few words, next to its diagram", async ({ page }) => {
  await page.goto("/fleet");
  await expect(page.locator("h1")).toHaveText("La gestion de l’IA d’entreprise.");
  await expect(page.locator("#promesse .xp-cover__lead")).toHaveText("Vos abonnements, vos clés API et vos modèles, gouvernés depuis une seule console.");
  await expect(page.locator("#promesse").getByRole("link", { name: "Demander une démonstration" })).toHaveAttribute("href", /^mailto:/);
  const flow = page.locator("#promesse .fl-flow");
  await expect(flow).toHaveAttribute("role", "img");
  await expect(flow).toHaveAttribute("aria-label", /vos IA.*xSOM Fleet.*vos équipes/);
  await expect(flow.locator(".fl-module b")).toHaveText(["Fleet Guard", "Fleet Sièges", "Fleet Gateway"]);
  // Les marques des Fournisseurs : usage nominatif, « Pris en charge », sans partenariat.
  const supported = page.locator("#promesse .fl-supported");
  await expect(supported).toContainText("Pris en charge");
  await expect(supported.locator("li")).toHaveText([/Claude\s+Claude Code/, /ChatGPT\s+Codex/]);
  await expect(supported).toContainText("sans partenariat ni approbation");
  // Aucun fournisseur d'API nommé tant que la version de LiteLLM n'est pas épinglée.
  await expect(page.locator("main")).not.toContainText(/Mistral|Gemini|Bedrock|Azure/);
});

test("the header follows the chapters and offers sign-in next to the demo request", async ({ page }) => {
  await page.goto("/fleet");
  const menu = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(menu.getByRole("link")).toHaveText(["Plateforme", "Sécurité", "FinOps", "Stratégie", "Démo vidéo", "Questions"]);
  await expect(menu.getByRole("link", { name: "Sécurité" })).toHaveAttribute("href", "/fleet#securite");
  const header = page.locator("header.home-header");
  const signIn = header.getByRole("link", { name: "Se connecter" });
  await expect(signIn).toHaveAttribute("href", "https://plateforme.xsom.fr");
  await expect(signIn).toHaveAttribute("data-variant", "ghost");
  await expect(header.getByRole("link", { name: "Demander une démonstration" })).toHaveAttribute("data-variant", "solid");
});

test("on a phone, the menu folds and keeps sign-in in its panel", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/fleet`);
  const signIn = page.locator("header.home-header").getByRole("link", { name: "Se connecter" });
  await expect(signIn).toBeHidden();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(signIn).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Démo vidéo" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await context.close();
});

test("the chapters are numbered in reading order, with a discreet progress rail", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/fleet");
  for (const [index, id] of CHAPTERS.entries()) {
    await expect(page.locator(`#${id}`)).toHaveAttribute("data-n", String(index + 1).padStart(2, "0"));
  }
  // Sur la couverture, le rail est caché ; il apparaît avec le premier chapitre.
  const rail = page.getByRole("navigation", { name: "Chapitres de la page" });
  await expect(rail).toBeHidden();
  await page.locator("#finops").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 300));
  await expect(rail.getByRole("link")).toHaveCount(CHAPTERS.length);
  await expect(rail.getByRole("link", { name: /FinOps/ })).toHaveAttribute("aria-current", "step");
});

test("security: the secret is stopped on the workstation, with the agent's exact message", async ({ page }) => {
  await page.goto("/fleet");
  const section = page.locator("#securite");
  await expect(section.locator("h2")).toHaveText("Les meilleures IA, accessibles en toute sécurité.");
  const flow = section.locator(".fl-guard");
  await expect(flow).toHaveAttribute("role", "img");
  // Catalogue `hook.*` de l'Agent xSOM, mot pour mot ; la clé est masquée.
  await expect(flow).toContainText("Envoi bloqué par xSOM Fleet : un secret a été détecté sur ce Poste. Sa valeur n’est ni affichée ni transmise.");
  await expect(flow).toContainText("Règle aws_access_key_id : Identifiant de clé d’accès AWS");
  await expect(flow).toContainText("AKIA••••••••");
  await expect(flow).toContainText("La valeur ne sort jamais de cette zone");
  await expect(section).toContainText("Une Politique signée, vérifiée puis appliquée sur chaque Poste.");
  await expect(section.getByRole("link", { name: /Lire le code de Secret Guard/ })).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");
});

test("FinOps: the real measurement, the labelled simulation, then the console in tabs", async ({ page }) => {
  await page.goto("/fleet");
  const section = page.locator("#finops");
  await expect(section.locator("h2")).toHaveText("Pilotage FinOps : réduisez fortement votre budget IA.");
  const measure = section.locator(".fl-measure");
  await expect(measure).toContainText("× 39");
  await expect(measure).toContainText("Le forfait Claude à 200 $ par mois (216 € TTC) a couvert 7 815 $ d’usage au tarif API.");
  await expect(measure).toContainText("103 € TTC");
  await expect(measure).toContainText("1 173 $");
  await expect(measure).toContainText("Relevé avec ccusage (outil libre)");
  await expect(measure).toContainText("ccusage monthly --since 20260901 --until 20260930");

  const sankey = section.locator(".fl-sankey-card");
  await expect(sankey).toContainText("Simulation · hypothèses affichées");
  await expect(sankey).toContainText("Hypothèses : budget mensuel fictif de 100 k€");
  await expect(section.getByRole("link", { name: "Demander la simulation pour votre entreprise" })).toHaveAttribute("href", /^mailto:.*simulation/);

  const tabs = section.getByRole("tablist", { name: "Vues de la console" });
  await expect(tabs.getByRole("tab")).toHaveText(["Coûts", "Sièges"]);
  const costs = section.getByRole("tabpanel", { name: "Coûts" });
  await expect(costs).toBeVisible();
  await expect(costs.locator("img")).toHaveAttribute("src", /fleet-console-costs\.webp/);
  await expect(costs).toContainText("Démonstration · données illustratives");
  await tabs.getByRole("tab", { name: "Coûts" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Sièges" })).toHaveAttribute("aria-selected", "true");
  const seats = section.getByRole("tabpanel", { name: "Sièges" });
  await expect(seats).toBeVisible();
  await expect(seats).toContainText("Démonstration · données illustratives");
  await expect(seats).toContainText("Un Siège au-delà du Plafond est refusé.");
  await expect(costs).toBeHidden();
});

test("every console capture and every demo figure is labelled as demonstration", async ({ page }) => {
  await page.goto("/fleet");
  const frames = page.locator(".fl-frame");
  await expect(frames).toHaveCount(2);
  for (const frame of await frames.all()) await expect(frame.locator(".xp-pill--demo")).toHaveText("Démonstration · données illustratives");
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

test("strategy: Fleet Gateway is offered for pilot, names no model and shows no amount", async ({ page }) => {
  await page.goto("/fleet");
  const section = page.locator("#strategie");
  await expect(section.locator("h2")).toHaveText("Une vraie stratégie IA, optimisée.");
  await expect(section).toContainText("Fleet Gateway · disponible pour pilote");
  const gateway = section.locator(".fl-gw");
  await expect(gateway).toHaveAttribute("role", "img");
  await expect(gateway).toContainText("Politique de sélection");
  await expect(gateway).toContainText("Illustration");
  await expect(gateway).toContainText("Déploiement progressif");
  const text = await gateway.innerText();
  expect(text).not.toMatch(/\d\s?(%|€|\$)|(€|\$)\s?\d/);
  expect(text).not.toMatch(/\b20\d{2}\b/);
});

test("the film is the one presentation film, declared without downloading it up front", async ({ page }) => {
  await page.goto("/fleet");
  await expect(page.locator("video")).toHaveCount(1);
  const section = page.locator("#film");
  await expect(section.locator("h2")).toHaveText("Voyez-le en 72 secondes.");
  const film = section.locator("video");
  await expect(film).toHaveAttribute("src", "/signal-media/xsom-fleet-how-v2-fr.mp4");
  await expect(film).toHaveAttribute("poster", "/signal-media/xsom-fleet-how-v2-fr.jpg");
  await expect(film).toHaveAttribute("preload", "none");
  await expect(film).toHaveAttribute("aria-label", /voix off/);
  await expect(section.getByRole("button", { name: "Activer le son" })).toBeVisible();
  await expect(section.locator(".fl-chapter")).toHaveCount(FILM_CHAPTERS.length);
  for (const id of FILM_CHAPTERS) await expect(page.locator(`#etape-${id}`)).toHaveCount(1);
  await expect(section.locator("figcaption", { hasText: "Démonstration · données illustratives" })).toHaveCount(1);
});

test("licences, sources and commitments, then the questions and the final call", async ({ page }) => {
  await page.goto("/fleet");
  const section = page.locator("#engagements");
  await expect(section.locator("h2")).toHaveText("Licences, sources et engagements.");
  await expect(section.locator(".fl-badge strong")).toHaveText(["Apache-2.0", "MIT", "SBOM", "UE ou chez vous", "0 prompt", "Dossier de preuves"]);
  await expect(section.getByRole("link", { name: /Code source de Secret Guard/ })).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");
  for (const text of ["LiteLLM", "CycloneDX", "Union européenne", "JSON et en PDF", "chaînés"]) await expect(section).toContainText(text);
  await expect(page.locator("#questions details")).toHaveCount(7);
  const final = page.locator(".xp-final");
  await expect(final.getByRole("link", { name: "Demander une démonstration" })).toHaveAttribute("href", /^mailto:/);
  await expect(final.getByRole("link", { name: "Demander un tarif" })).toHaveAttribute("href", /^mailto:.*tarif/);
});

test("the page shows no price range and no unsourced figure outside the measurement", async ({ page }) => {
  await page.goto("/fleet");
  const text = await page.locator("main").innerText();
  // Les seuls montants : la mesure ccusage, la simulation (en k€) et les captures de démonstration.
  const amounts = text.match(/\d[\d\s ,.]*\s?(?:\$|€|k€)|\$\s?\d[\d,.]*|€\s?\d[\d,.]*/g) ?? [];
  const allowed = /^(200 \$|216 €|7 815 \$|103 € TTC|103 €|1 173 \$|\d+ k€|25 476,00 \$|44 043,62 \$)$/;
  for (const amount of amounts) expect(amount.trim().replace(/\s+/g, " ").replace(/ /g, " ")).toMatch(allowed);
});

test("the Fleet page speaks English with the same chapters", async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  await context.addCookies([{ name: "xsom_lang", value: "en", url: baseURL! }]);
  const page = await context.newPage();
  await page.goto("/fleet");
  await expect(page.locator("h1")).toHaveText("Enterprise AI management.");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link")).toHaveText(["Platform", "Security", "FinOps", "Strategy", "Video demo", "Questions"]);
  await expect(page.locator("header.home-header").getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "https://plateforme.xsom.fr");
  await expect(page.locator("#securite h2")).toHaveText("The best AI, made safe to use.");
  await expect(page.locator("#securite .fl-guard")).toContainText("Sending blocked by xSOM Fleet: a secret was detected on this Poste. Its value is neither displayed nor transmitted.");
  await expect(page.locator("#finops h2")).toHaveText("FinOps steering: cut your AI budget sharply.");
  await expect(page.locator("#finops .fl-measure")).toContainText("The Claude plan at $200 per month (€216 incl. VAT) covered $7,815 of usage at API rates.");
  await expect(page.locator("#finops")).toContainText("Simulation · assumptions shown");
  await expect(page.locator("#finops")).toContainText("The console is shown in French.");
  await expect(page.locator(".fl-frame .xp-pill--demo").first()).toHaveText("Demonstration · illustrative data");
  await expect(page.locator("#strategie h2")).toHaveText("A real AI strategy, optimised.");
  await expect(page.locator("#film h2")).toHaveText("See it in 80 seconds.");
  await expect(page.locator("#film video")).toHaveAttribute("src", "/signal-media/xsom-fleet-how-v2-en.mp4");
  await expect(page.locator("#film").getByRole("button", { name: "Turn sound on" })).toBeVisible();
  await expect(page.locator("#engagements .fl-badge strong")).toHaveCount(6);
  await expect(page.locator("#questions details")).toHaveCount(7);
  await context.close();
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
  await expect(page.locator("h1")).toHaveText("La gestion de l’IA d’entreprise.");
  // Rien n'est masqué : la révélation au défilement ne s'applique pas.
  expect(await page.locator(".reveal").evaluateAll((nodes) => nodes.filter((n) => getComputedStyle(n).opacity !== "1").length)).toBe(0);
  expect(videos).toEqual([]);
  expect(errors).toEqual([]);
  await context.close();
});

for (const width of [390, 768, 1024, 1440]) {
  test(`the Fleet page stays contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/fleet");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("the Fleet page carries its own title, Open Graph image and JSON-LD", async ({ request }) => {
  const html = await (await request.get("/", { headers: { host: "fleet.xsom.fr" } })).text();
  expect(html).toContain("<title>xSOM Fleet · la gestion de l’IA d’entreprise</title>");
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

test("the old sections and films are gone", async ({ page, request }) => {
  await page.goto("/fleet");
  for (const id of ["modules", "pourquoi", "fonctionnement", "home-film"]) await expect(page.locator(`#${id}`)).toHaveCount(0);
  const html = await page.content();
  expect(html).not.toContain("xsom-fleet-hero");
  for (const file of ["xsom-fleet-hero-fr.mp4", "xsom-fleet-how-orgs-fr.mp4", "xsom-fleet-hero-v2-fr.mp4"]) {
    expect((await request.get(`/signal-media/${file}`)).status()).toBe(404);
  }
});

test("the Fleet page names no real customer and promises no certification", async ({ request }) => {
  for (const lang of ["fr", "en"]) {
    const html = (await (await request.get("/", { headers: { host: "fleet.xsom.fr", cookie: `xsom_lang=${lang}` } })).text()).toLowerCase();
    for (const word of ["certifié", "certified", "garanti", "guarantee", "conforme", "compliant", "orchestrateur", "orchestrator", "partenaire", "validé par"]) expect(html).not.toContain(word);
  }
});
