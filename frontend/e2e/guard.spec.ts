import { expect, test } from "@playwright/test";

/**
 * guard.xsom.fr, Secret Guard : le moteur open source. La page dit ce qu'il fait, son
 * code ouvert et son rôle dans xSOM Fleet. Elle ne propose aucun téléchargement
 * d'extension et ne fixe aucun prix : l'extension VS Code est « en préparation ».
 */
test("the Secret Guard page says what it is, how it works, and links the open code", async ({ page }) => {
  // L'ancienne adresse de l'extension mène à la page du produit.
  await page.goto("/extension");
  await expect(page).toHaveURL(/\/secret-guard$/);

  await expect(page.locator(".guard-header .brand__name")).toHaveText("Secret Guard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Repérer les secrets");
  await expect(page.locator(".sg-hero")).toContainText("Apache-2.0");
  await expect(page.locator(".sg-hero")).toContainText("sans réseau et sans modèle de langage");
  const source = page.locator(".sg-hero").getByRole("link", { name: /Voir le code source/ });
  await expect(source).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");
  const fond = page.locator(".sg-hero__video");
  await expect(fond).toHaveAttribute("poster", "/signal-media/secret-guard-loop.jpg");
  await expect(fond).toHaveAttribute("preload", "none");

  // Le schéma : le filtre et ses trois couches, dont le Pack signé que distribue Fleet Guard.
  const couches = page.locator("#fonctionnement .sg-layers li");
  await expect(couches).toHaveCount(3);
  await expect(couches.nth(1)).toContainText("Entropie");
  await expect(couches.nth(2)).toContainText("Fleet Guard");

  await expect(page.locator("#open-source")).toContainText("Licence Apache-2.0");
  await expect(page.locator("#open-source").getByRole("link", { name: /Ouvrir le dépôt sur GitHub/ })).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");
});

test("the paid offers now lead to Fleet Guard, and the extension is only announced", async ({ page }) => {
  await page.goto("/secret-guard");
  const fleet = page.locator("#fleet");
  await expect(fleet).toContainText("Fleet Guard");
  await expect(fleet).toContainText("Pro et Entreprise");
  await expect(fleet.getByRole("link", { name: /Découvrir xSOM Fleet/ })).toHaveAttribute("href", "/fleet#modules");
  const extension = page.locator(".sg-extension");
  await expect(extension).toContainText("Une nouvelle version de l’extension VS Code, branchée sur ce moteur, est en préparation.");
  // Ni fichier à télécharger, ni prix, ni lien vers l'ancien dépôt.
  const html = await page.content();
  expect(html).not.toMatch(/\.vsix/i);
  expect(html).not.toContain("poc-AI_guard");
  expect(html).not.toContain("jt33120");
  expect(html).not.toMatch(/\d+\s?€/);
  await expect(page.getByRole("link", { name: /Télécharger/ })).toHaveCount(0);
});

test("the Secret Guard page carries its own title, Open Graph poster and JSON-LD", async ({ request }) => {
  const html = await (await request.get("/", { headers: { host: "guard.xsom.fr" } })).text();
  expect(html).toContain('property="og:image" content="https://guard.xsom.fr/signal-media/secret-guard-loop.jpg"');
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
  expect(json).toBeTruthy();
  const data = JSON.parse(json!);
  expect(data["@type"]).toBe("SoftwareSourceCode");
  expect(data.license).toBe("https://www.apache.org/licenses/LICENSE-2.0");
  expect(data.codeRepository).toBe("https://github.com/xsom-consulting/secret-guard");
  expect(data.offers).toBeUndefined();
});

test("the Secret Guard page speaks English with the same sections", async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  await context.addCookies([{ name: "xsom_lang", value: "en", url: baseURL! }]);
  const page = await context.newPage();
  await page.goto("/secret-guard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Spot secrets");
  await expect(page.locator("#fleet")).toContainText("Pro and Enterprise");
  await expect(page.locator(".sg-extension")).toContainText("A new version of the VS Code extension, built on this engine, is in preparation.");
  await context.close();
});

for (const width of [390, 768, 1440]) {
  test(`the Secret Guard page stays contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/secret-guard");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) {
      // Trois points en colonnes serrées tiendraient dans 390 px sans déborder : ils
      // doivent être EMPILÉS.
      const points = page.locator("#open-source .sg-points li");
      const first = await points.nth(0).boundingBox();
      const second = await points.nth(1).boundingBox();
      expect(second!.y).toBeGreaterThan(first!.y);
    }
  });
}
