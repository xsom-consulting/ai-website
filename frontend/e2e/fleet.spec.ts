import { expect, test } from "@playwright/test";

/**
 * La page xSOM Fleet, lue comme un dossier de présentation : la couverture (la plateforme
 * en un mot et son schéma), trois piliers en chapitres numérotés (sécurité, FinOps,
 * stratégie), les options sur le schéma d’une entreprise type, la démo vidéo, les licences et engagements, les questions et l'appel
 * final. Un indicateur de progression discret. Le film est produit à part (`films/`) :
 * la page doit tenir sans lui, et ne rien télécharger quand le mouvement est réduit.
 */
const CHAPTERS = ["securite", "finops", "strategie", "options", "film", "engagements", "questions"];
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
  // Aucun fournisseur d'API nommé tant que la version de LiteLLM n'est pas épinglée, sauf
  // sur la carte des options, où l'île des Fournisseurs d'IA les cite pour décrire.
  const outsideMap = await page.locator("main").evaluate((main) => {
    const copy = main.cloneNode(true) as HTMLElement;
    copy.querySelectorAll("#options .fl-map").forEach((map) => map.remove());
    return copy.textContent ?? "";
  });
  expect(outsideMap).not.toMatch(/Mistral|Gemini|Bedrock|Azure/);
});

test("the header follows the chapters and offers sign-in next to the demo request", async ({ page }) => {
  await page.goto("/fleet");
  const menu = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(menu.getByRole("link")).toHaveText(["Plateforme", "Sécurité", "FinOps", "Stratégie", "Options", "Démo vidéo", "Questions"]);
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

test("options: the typical company map is a keyboard tablist, product kept apart from consulting", async ({ page }) => {
  await page.goto("/fleet");
  const section = page.locator("#options");
  await expect(section.locator("h2")).toHaveText("Ce que fait xSOM Fleet, à chaque endroit de l’entreprise.");
  const zones = section.getByRole("tablist", { name: "Zones de l’entreprise" });
  await expect(zones.getByRole("tab")).toHaveCount(7);
  const devices = zones.getByRole("tab", { name: /Développeurs et leurs Postes/ });
  await expect(devices).toHaveAttribute("aria-selected", "true");
  const panel = section.getByRole("tabpanel");
  await expect(panel.locator("h3")).toHaveText("Développeurs et leurs Postes");
  await expect(panel.locator("h4")).toHaveText(["Produit installable", "Conseil et intégration"]);
  await expect(panel.locator('.fl-opt[data-kind="product"] h5').first()).toHaveText("Agent xSOM et Réglages administrés imposés");
  await expect(panel.locator('.fl-opt[data-kind="consulting"] h5')).toContainText(["Recette de couverture par outil et par version"]);
  // Clavier : flèches, Entrée pour zoomer, Échap pour revenir à la vue d'ensemble.
  await devices.focus();
  await page.keyboard.press("ArrowRight");
  const proxy = zones.getByRole("tab", { name: /Proxy d’entreprise/ });
  await expect(proxy).toBeFocused();
  await expect(proxy).toHaveAttribute("aria-selected", "true");
  await expect(panel.locator("h3")).toHaveText("Proxy d’entreprise");
  await expect(panel).toContainText("Restriction de locataire sur le proxy");
  const overview = section.getByRole("button", { name: "Zoomer sur la zone" });
  await expect(overview).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Enter");
  await expect(section.getByRole("button", { name: "Vue d’ensemble" })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(overview).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("End");
  await expect(zones.getByRole("tab", { name: /Console xSOM Fleet/ })).toHaveAttribute("aria-selected", "true");
  // Un clic choisit la zone ; « Plus de détails » ouvre les limites, les prérequis et les sources.
  await zones.getByRole("tab", { name: /Serveurs internes/ }).click();
  const verdict = panel.locator(".fl-opt", { hasText: "Serveur de verdict pour les Inference hooks" });
  await expect(verdict.locator(".fl-tag").first()).toHaveText("Produit, avec mise en place en conseil");
  await verdict.getByText("Plus de détails").click();
  await expect(verdict).toContainText("Contrôle après l’envoi");
  await expect(verdict.getByRole("link", { name: "Anthropic" }).first()).toHaveAttribute("href", /^https:\/\/platform\.claude\.com\//);
  await expect(section).toContainText("Catalogue d’options du 22/10/2026");
  await expect(section).toContainText("Schéma de principe");
});

/** L’écart, en pixels, entre le centre d’une zone de la carte et le centre de la carte. */
async function offCentre(page: import("@playwright/test").Page, zone: string) {
  await page.waitForTimeout(700); // fin de la transition du zoom
  return page.locator("#options .fl-map__svg").evaluate((svg, id) => {
    const frame = svg.getBoundingClientRect();
    const box = svg.querySelector(`.fl-iso__zone[data-zone="${id}"]`)!.getBoundingClientRect();
    return Math.hypot(box.x + box.width / 2 - (frame.x + frame.width / 2), box.y + box.height / 2 - (frame.y + frame.height / 2));
  }, zone);
}

test("options: the isometric map switches between the blind spot and the company under control", async ({ page }) => {
  await page.goto("/fleet");
  const section = page.locator("#options");
  const map = section.locator(".fl-map");
  await section.scrollIntoViewIfNeeded();
  // Sept zones dessinées, quatre flux de demandes, et la boucle d’animation qui tourne à l’écran.
  await expect(map.locator(".fl-iso__zone")).toHaveCount(7);
  await expect(map.locator(".fl-iso__flow")).toHaveCount(4);
  await expect(map.locator(".fl-iso__exchange")).toHaveCount(1);
  await expect(map.locator(".fl-iso__cost")).toHaveCount(3);
  await expect(map).toHaveAttribute("data-animating", "");
  await expect(map.locator(".fl-iso__requests .fl-iso__dot").first()).toBeAttached();
  // Les réponses des modèles redescendent, et les échanges avec les Externes circulent.
  await expect(map.locator(".fl-iso__requests .fl-iso__reply").first()).toBeAttached({ timeout: 10_000 });
  await expect(map.locator(".fl-iso__requests .fl-iso__dot--exchange").first()).toBeAttached();
  // Les Fournisseurs d'IA, cités pour décrire, sur leur île.
  await expect(map.locator('.fl-iso__zone[data-zone="cloud"] .fl-iso__brand')).toHaveText(["Claude", "ChatGPT", "Azure OpenAI", "Microsoft Copilot", "Gemini", "Mistral", "Bedrock"]);
  await expect(section.locator(".fl-map__legend li")).toHaveText(["Demande envoyée à une IA", "Secret dans la demande", "Secret remplacé au point de contrôle", "Réponse du modèle, en retour", "Échange entre vos agents et les Externes", "Usage et coûts vers la console, sous contrôle", "Événements sans contenu vers la console", "Pointillés : le Groupe"]);
  // Angle mort par défaut : points d’interrogation, aucun bouclier.
  const modes = section.getByRole("group", { name: "État de l’entreprise" });
  const blind = modes.getByRole("button", { name: "Angle mort" });
  const control = modes.getByRole("button", { name: "Sous contrôle" });
  await expect(blind).toHaveAttribute("aria-pressed", "true");
  await expect(map.locator(".fl-iso__shield").first()).toBeHidden();
  await expect(map.locator(".fl-iso__unknowns")).toBeVisible();
  // En angle mort, ni usage ni coûts ne remontent à la console ; les échanges et les réponses restent.
  await expect(map.locator(".fl-iso__costs")).toBeHidden();
  await expect(map.locator(".fl-iso__exchange")).toBeVisible();
  const panel = section.getByRole("tabpanel");
  await expect(panel.locator('.fl-state[data-current="true"]')).toHaveAttribute("data-state", "blind");
  await expect(panel.locator('.fl-state[data-state="blind"]')).toContainText("L’assistant de code lit le dépôt");
  // Sous contrôle : les boucliers se posent, l’état « Sous contrôle » passe devant.
  await control.click();
  await expect(control).toHaveAttribute("aria-pressed", "true");
  await expect(map).toHaveAttribute("data-mode", "control");
  await expect(map.locator(".fl-iso__shield")).toHaveCount(6);
  await expect(map.locator('.fl-iso__shield[data-shield="postes-dev"]')).toBeVisible();
  await expect(map.locator(".fl-iso__unknowns")).toBeHidden();
  await expect(map.locator('.fl-iso__cost[data-from="cloud"]')).toBeVisible();
  await expect(map.locator(".fl-iso__requests .fl-iso__dot--cost").first()).toBeVisible();
  await expect(panel.locator('.fl-state[data-current="true"]')).toHaveAttribute("data-state", "control");
  await expect(panel.locator('.fl-state[data-current="true"]')).toContainText("L’Agent xSOM contrôle chaque envoi sur le Poste.");
  await expect(panel.locator(".fl-map__module")).toContainText("Fleet Guard");
  // Un clic sur un bâtiment choisit sa zone et zoome dessus.
  await map.locator('.fl-iso__zone[data-zone="console"] .fl-iso__hl--top').click();
  await expect(section.getByRole("tab", { name: /Console xSOM Fleet/ })).toHaveAttribute("aria-selected", "true");
  await expect(panel.locator(".fl-map__module")).toContainText("Fleet Sièges");
  await expect(map).toHaveAttribute("data-zoomed", "");
  expect(await offCentre(page, "console")).toBeLessThan(12);
  // Hors de l’écran, la boucle d’animation s’arrête.
  await page.locator("#questions").scrollIntoViewIfNeeded();
  await expect(map).not.toHaveAttribute("data-animating", "");
  await blind.scrollIntoViewIfNeeded();
  await expect(map).toHaveAttribute("data-animating", "");
});

test("options: under reduced motion, the requests stand still along the flows", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/fleet");
  const map = page.locator("#options .fl-map");
  await map.scrollIntoViewIfNeeded();
  // Les demandes vers les IA : trois par flux, sans les échanges ni les remontées de coûts.
  const frozen = map.locator(".fl-iso__requests[data-frozen] .fl-iso__dot:not(.fl-iso__dot--exchange, .fl-iso__dot--cost)");
  await expect(frozen).toHaveCount(12);
  await expect(map.locator('.fl-iso__requests[data-frozen] .fl-iso__dot--secret')).toHaveCount(4);
  await expect(map.locator(".fl-iso__requests[data-frozen] .fl-iso__reply")).toHaveCount(8);
  await expect(map.locator('.fl-iso__requests[data-frozen] .fl-iso__dot--exchange')).toHaveCount(2);
  await expect(map.locator('.fl-iso__requests[data-frozen] .fl-iso__dot--cost')).toHaveCount(3);
  await expect(map.locator('.fl-iso__requests[data-frozen] .fl-iso__dot--cost').first()).toBeHidden();
  await page.waitForTimeout(400);
  await expect(map).not.toHaveAttribute("data-animating", "");
  expect(await map.locator(".fl-iso__requests:not([data-frozen]) circle").count()).toBe(0);
  // Sous contrôle, les secrets passés au bouclier sont verts ; celui qui ne l’a pas encore atteint reste rouge.
  await page.getByRole("button", { name: "Sous contrôle" }).click();
  await expect(map.locator('.fl-iso__requests[data-frozen] .fl-iso__dot--stopped')).toHaveCount(3);
  await expect(map.locator('.fl-iso__requests[data-frozen] .fl-iso__dot--secret')).toHaveCount(1);
  await expect(map.locator('.fl-iso__requests[data-frozen] .fl-iso__dot--cost').first()).toBeVisible();
  await context.close();
});

test("options: the comparison matrix lists every published option by level, FinOps included", async ({ page }) => {
  await page.goto("/fleet");
  const matrix = page.getByRole("region", { name: "Matrice de comparaison des options" });
  await expect(matrix.locator('th[scope="rowgroup"]')).toHaveText(["Web (navigateur)", "Poste et applications de bureau", "Code et assistants de code", "API (applications et agents)", "Cloud des Fournisseurs", "FinOps et preuves"]);
  await expect(matrix.locator('tbody th[scope="row"]')).toHaveCount(22);
  const row = matrix.locator("#matrice-cloud-serveur-verdict");
  await expect(row.locator("th")).toHaveText("Serveur de verdict pour les Inference hooks");
  await expect(row.locator("td").nth(1)).toHaveText("Livré, recette réelle à faire");
  await expect(row.locator(".fl-mx__cell").first()).toHaveText("Oui");
  await expect(matrix.locator("#matrice-finops-sieges")).toContainText("Fleet Sièges");
});

test("options: on a 360 px phone, the map and the matrix stay inside the page", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 780 } });
  const page = await context.newPage();
  const outside: string[] = [];
  page.on("request", (request) => { if (new URL(request.url()).origin !== new URL(baseURL!).origin) outside.push(request.url()); });
  await page.goto(`${baseURL}/fleet`);
  await page.locator("#options").scrollIntoViewIfNeeded();
  await expect(page.locator('#options .fl-map')).toHaveAttribute("data-layout", "narrow");
  await page.getByRole("tab", { name: /Métiers/ }).click();
  await expect(page.getByRole("tabpanel").locator("h3")).toHaveText("Métiers");
  await page.getByRole("tab", { name: /Cloud des Fournisseurs/ }).click();
  expect(await offCentre(page, "cloud")).toBeLessThan(8);
  const frame = page.locator(".fl-mx__scroll");
  expect(await frame.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(outside).toEqual([]);
  await context.close();
});

test("the Fleet page speaks English with the same chapters", async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  await context.addCookies([{ name: "xsom_lang", value: "en", url: baseURL! }]);
  const page = await context.newPage();
  await page.goto("/fleet");
  await expect(page.locator("h1")).toHaveText("Enterprise AI management.");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link")).toHaveText(["Platform", "Security", "FinOps", "Strategy", "Options", "Video demo", "Questions"]);
  await expect(page.locator("header.home-header").getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "https://plateforme.xsom.fr");
  await expect(page.locator("#securite h2")).toHaveText("The best AI, made safe to use.");
  await expect(page.locator("#securite .fl-guard")).toContainText("Sending blocked by xSOM Fleet: a secret was detected on this Poste. Its value is neither displayed nor transmitted.");
  await expect(page.locator("#finops h2")).toHaveText("FinOps steering: cut your AI budget sharply.");
  await expect(page.locator("#finops .fl-measure")).toContainText("The Claude plan at $200 per month (€216 incl. VAT) covered $7,815 of usage at API rates.");
  await expect(page.locator("#finops")).toContainText("Simulation · assumptions shown");
  await expect(page.locator("#finops")).toContainText("The console is shown in French.");
  await expect(page.locator(".fl-frame .xp-pill--demo").first()).toHaveText("Demonstration · illustrative data");
  await expect(page.locator("#strategie h2")).toHaveText("A real AI strategy, optimised.");
  await expect(page.locator("#options h2")).toHaveText("What xSOM Fleet does, at every point of the company.");
  await expect(page.locator("#options").getByRole("tablist", { name: "Areas of the company" }).getByRole("tab")).toHaveCount(7);
  await expect(page.locator("#options .fl-map__panel h4")).toHaveText(["Installable product", "Consulting and integration"]);
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
