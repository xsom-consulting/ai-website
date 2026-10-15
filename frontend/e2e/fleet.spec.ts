import { expect, test } from "@playwright/test";

test("Fleet states its pilot scope before the visitor contacts the team", async ({ page }) => {
  await page.goto("/fleet");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vos usages IA, des règles communes.");
  await expect(page.locator("#promesse")).toContainText("Programme pilote 2026");
  await expect(page.locator("#promesse")).toContainText("Postes couverts");
  await expect(page.locator("#engagements")).toContainText("ChatGPT dans le navigateur, Copilot");
  await expect(page.locator("#engagements")).toContainText("se vérifie au cadrage du pilote");
  await expect(page.locator("#modules h3")).toHaveText(["Suivre les abonnements et les coûts", "Contrôler avant l’envoi", "Encadrer les accès aux modèles"]);
  await expect(page.locator("#modules")).toContainText("Disponible pour pilote");
});

test("cost evidence is a dated estimate, never a saving guarantee", async ({ page }) => {
  await page.goto("/fleet");
  const cost = page.locator("#pourquoi");
  await expect(cost).toContainText("septembre 2026");
  await expect(cost).toContainText("un utilisateur");
  await expect(cost).toContainText("Équivalent API estimé");
  await expect(cost).toContainText("ni une économie promise");
  await expect(cost).toContainText("Simulation · hypothèses affichées");
  await expect(cost).toContainText("7 815 $");
  await expect(cost).toContainText("1 173 $");
  await expect(cost).not.toContainText("× 39");
  await expect(cost.getByRole("link", { name: "Demander un tarif" })).toHaveAttribute("href", /^mailto:/);
});

test("the evidence capture opens and closes by keyboard on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fleet");
  const trigger = page.getByRole("button", { name: /Voir le relevé ccusage/ });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.locator(".fl-capture__scroll").evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("demo chapters seek the real film and disclose illustrative data", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fleet");
  const film = page.locator("#fonctionnement video").first();
  await expect(film).toHaveAttribute("preload", "none");
  expect(await film.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  await expect(page.locator("#fonctionnement figcaption")).toContainText("Démonstration · données illustratives");
  const chapter = page.locator(".fl-chapter").nth(2);
  await chapter.click();
  await expect(chapter).toHaveAttribute("aria-current", "step");
  await expect.poll(() => film.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(19);
});

test("FAQ remains usable and source links lead to the published engine", async ({ page }) => {
  await page.goto("/fleet");
  const first = page.locator("#questions summary").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#questions details").first()).toHaveAttribute("open", "");
  await expect(page.getByRole("link", { name: "Code source de Secret Guard", exact: true })).toHaveAttribute("href", "https://github.com/xsom-consulting/secret-guard");
});

for (const width of [390, 768, 1440]) {
  test(`Fleet stays readable in both languages at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/fleet");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const menu = page.getByRole("button", { name: "Menu", exact: true });
    if (await menu.isVisible()) await menu.click();
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your AI usage, shared rules.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator("#engagements")).toContainText("outside the stated scope");
  });
}

test("Fleet never claims certification or names a real customer", async ({ request }) => {
  const text = (await (await request.get("/", { headers: { host: "fleet.xsom.fr" } })).text()).toLowerCase();
  for (const word of ["certifié", "garanti", "conforme", "validé par"]) expect(text).not.toContain(word);
});
