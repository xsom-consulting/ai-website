import { expect, test } from "@playwright/test";

test("the AI homepage is readable before any film is opened", async ({ page }) => {
  const films: string[] = [];
  page.on("request", request => { if (/xsom-ia-home.*mp4/.test(request.url())) films.push(request.url()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Des bases solides pour vos projets IA.");
  await expect(page.locator("#intro .web-button")).toHaveAttribute("href", /^mailto:/);
  await expect(page.locator("#home-film video")).toBeHidden();
  expect(films).toEqual([]);
  await page.getByText("Voir le film de présentation", { exact: true }).click();
  await expect(page.locator("#home-film video")).toBeVisible();
  await expect(page.locator("#home-film video")).toHaveAttribute("src", "/signal-media/xsom-ia-home-fr.mp4");
});

test("services and product status are explicit, without invented customer claims", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#prestations h3")).toHaveText(["Infrastructures IA & cloud souverain", "Données & MLOps", "Sécurité des pipelines IA"]);
  const services = await page.locator("#prestations").innerText();
  expect(services).not.toMatch(/\d\s?(%|€|\$|clients?)/);
  const fleet = page.locator("#produits article").first();
  await expect(fleet).toContainText("programme pilote");
  await expect(fleet.locator("li strong")).toHaveText(["Fleet Sièges", "Fleet Guard", "Fleet Gateway"]);
  await expect(fleet).toContainText("Disponible pour pilote.");
  await expect(fleet.getByRole("link", { name: "Découvrir xSOM Fleet" })).toHaveAttribute("href", "/fleet");
  await expect(page.locator("#produits article").nth(1)).toContainText("Apache-2.0");
});

for (const [name, use] of [["Équipes métier", "workplace"], ["Équipes de développement", "development"], ["Équipes modèles & données", "models"]]) {
  test(`risk navigation preserves the ${use} filter`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: `Explorer les risques : ${name}`, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`menaces\\?use=${use}#definitions$`));
    await expect(page.getByRole("button", { name, exact: true })).toHaveAttribute("aria-pressed", "true");
  });
}

for (const width of [390, 768, 1440]) {
  test(`AI navigation and language work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const toggle = page.locator(".web-toggle");
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await toggle.click();
    }
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Solid foundations for your AI projects.");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("reduced motion keeps content visible and media idle", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#prestations h2")).toBeVisible();
  await page.getByText("Voir le film de présentation", { exact: true }).click();
  expect(await page.locator("#home-film video").evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
});
