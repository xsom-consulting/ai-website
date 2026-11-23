import { expect, test } from "@playwright/test";

/**
 * guard.xsom.fr, Secret Guard en libre-service : la promesse et l'inscription gratuite,
 * ce que ça fait, comment l'installer, ce qui ne quitte jamais la machine, les licences
 * exactes, puis xSOM Fleet. Le site ne crée aucun compte : le formulaire mène à la page
 * d'inscription de plateforme.xsom.fr, l'adresse dans le fragment (`#email=`).
 */

/** Un Substitut tel que l'écrit le Client Fleet, composé comme dans la page. */
const substituteFr = (ordinal: number, type: string) => `[secret masqué par xSOM n°${ordinal} : ${type}, pas la vraie valeur]`;
const substituteEn = (ordinal: number, type: string) => `[secret masked by xSOM #${ordinal}: ${type}, not the real value]`;

test("the Aparté page states its promise, its free tier and its two calls to action", async ({ page }) => {
  // L'ancienne adresse de l'extension mène à la page du produit.
  await page.goto("/extension");
  await expect(page).toHaveURL(/\/secret-guard$/);

  await expect(page.locator(".ap-brand b")).toHaveText("Aparté");
  const hero = page.locator("#inscription");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Gardez votre IA.");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Rassurez vos clients.");
  await expect(hero).toContainText("Claude Code, Codex, ChatGPT");
  await expect(hero).toContainText("pour les indépendants");
  await expect(hero).toContainText("sans partenariat ni approbation");
  // « Télécharger · 0 € » passe par l'inscription, qui mène au téléchargement.
  await expect(hero.getByRole("link", { name: /Télécharger/ })).toHaveAttribute("href", "https://plateforme.xsom.fr/inscription");
  await expect(hero.getByRole("link", { name: "Essayer sur un Mac" })).toHaveAttribute("href", "#essayer");
  await expect(page.locator(".ap-top").getByRole("link", { name: /Télécharger/ })).toHaveAttribute("href", "https://plateforme.xsom.fr/inscription");
});

test("what it does, how to install it, and what never leaves the machine", async ({ page }) => {
  await page.goto("/secret-guard");
  const does = page.locator("#ce-que-ca-fait");
  await expect(does.locator(".sg-card h3")).toHaveText(["Bloquer", "Masquer", "Captures d’écran", "Une mascotte qui prévient", "Signaler un faux positif"]);
  await expect(does).toContainText("Standard, Discrète, Minimale, Aucune");
  await expect(does.locator(".sg-example")).toContainText("valeur inventée");
  await expect(does.locator(".sg-example__sent")).toContainText(substituteFr(12, "clé d’API"));

  const install = page.locator("#installer");
  await expect(install.locator(".sg-steps li")).toHaveCount(3);
  await expect(install.locator(".sg-systems h3")).toHaveText(["macOS", "Linux", "Windows", "Navigateur"]);
  await expect(install.locator('.sg-systems [data-key="windows"]')).toContainText("Version d’essai");
  await expect(install.locator('.sg-systems [data-key="browser"]')).toContainText("Bientôt");
  await expect(install.locator(".sg-version")).toContainText("Client Fleet 0.9.47, publié le 21 novembre 2026 · moteur v0.10.4");
  await expect(install.getByRole("link", { name: /Créer mon compte gratuit/ })).toHaveAttribute("href", "https://plateforme.xsom.fr/inscription");

  const machine = page.locator("#machine");
  await expect(machine.locator(".sg-layers li")).toHaveCount(3);
  await expect(machine.locator(".sg-layers li").nth(2)).toContainText("Fleet Guard");
  await expect(machine.locator("[data-safe]")).toContainText(substituteFr(1, "jeton GitHub"));
  await expect(machine.locator(".sg-flow__points h3")).toHaveText(["Ni prompt, ni fichier", "Ni valeur de secret", "Des Événements sans contenu"]);
});

test("the licences are exact, and companies are sent to xSOM Fleet", async ({ page }) => {
  await page.goto("/secret-guard");
  const licences = page.locator("#licences");
  await expect(licences.getByRole("link", { name: /Apache-2\.0/ })).toHaveAttribute("href", "https://www.apache.org/licenses/LICENSE-2.0");
  await expect(licences.getByRole("link", { name: /PolyForm Small Business 1\.0\.0/ })).toHaveAttribute("href", "https://polyformproject.org/licenses/small-business/1.0.0/");
  await expect(licences).toContainText("moins de 100 personnes et moins de 1 M$ de revenu");
  await expect(licences).toContainText("licence écrite de xSOM");
  await expect(licences.getByRole("link", { name: /Ouvrir le dépôt sur GitHub/ })).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");

  const fleet = page.locator("#fleet");
  await expect(fleet).toContainText("Au-delà de 3 Postes");
  await expect(fleet).toContainText("Pro et Entreprise");
  await expect(fleet.getByRole("link", { name: /Découvrir xSOM Fleet/ })).toHaveAttribute("href", "/fleet");

  // Ni extension VS Code de xSOM annoncée, ni fichier, ni prix autre que 0 € (affiché pour les
  // indépendants depuis le 23/11/2026), ni mot interdit. VS Code peut être nommé comme l'éditeur
  // où tourne Claude Code (démonstration, catalogue).
  const html = await page.content();
  expect(html).not.toMatch(/extension VS Code|VS Code extension|en préparation/);
  expect(html).not.toMatch(/\.vsix/i);
  expect(html).not.toContain("poc-AI_guard");
  expect(html).not.toMatch(/(?<![\d,.])(?:[1-9]\d*(?:[.,]\d+)?|0[.,]\d*[1-9]\d*)\s?€/);
  expect(html).not.toMatch(/conforme|certifié|garanti/i);
});

test("the Secret Guard page carries its own title, Open Graph poster and JSON-LD", async ({ request }) => {
  const html = await (await request.get("/", { headers: { host: "guard.xsom.fr" } })).text();
  expect(html).toContain('property="og:image" content="https://guard.xsom.fr/signal-media/secret-guard-loop.jpg"');
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
  expect(json).toBeTruthy();
  const data = JSON.parse(json!);
  expect(data["@type"]).toBe("SoftwareSourceCode");
  expect(data.license).toEqual(["https://www.apache.org/licenses/LICENSE-2.0", "https://polyformproject.org/licenses/small-business/1.0.0/"]);
  expect(data.codeRepository).toBe("https://github.com/xsom-consulting/secret-guard");
  expect(data.offers).toBeUndefined();
});

test("the Secret Guard page speaks English with the same sections", async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  await context.addCookies([{ name: "xsom_lang", value: "en", url: baseURL! }]);
  const page = await context.newPage();
  await page.route("https://plateforme.xsom.fr/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Sign up</title>" }));
  await page.goto("/secret-guard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Keep your AI.");
  await expect(page.locator("#ce-que-ca-fait .sg-example__sent")).toContainText(substituteEn(12, "API key"));
  await expect(page.locator("#licences")).toContainText("PolyForm Small Business 1.0.0");
  await expect(page.locator("#fleet")).toContainText("Pro and Enterprise");
  await expect(page.locator("#inscription").getByRole("link", { name: /Download/ })).toHaveAttribute("href", "https://plateforme.xsom.fr/inscription");
  await context.close();
});

for (const width of [390, 768, 1440]) {
  test(`the Secret Guard page stays contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/secret-guard");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) {
      // Deux licences tiendraient côte à côte dans 390 px : elles doivent être EMPILÉES.
      const points = page.locator("#licences .sg-points li");
      const first = await points.nth(0).boundingBox();
      const second = await points.nth(1).boundingBox();
      expect(second!.y).toBeGreaterThan(first!.y);
    }
  });
}
