import { expect, test, type Page } from "@playwright/test";

/**
 * Les trois adresses, dans un vrai navigateur. Chromium résout `*.xsom.fr` vers le
 * serveur de test : l'en-tête `Host` est celui que le visiteur aurait demandé, la
 * marque, le menu et les pages sont ceux du site, et rien ne doit échouer : ni erreur
 * de console, ni ressource introuvable.
 */
const PORT = Number(process.env.XSOM_E2E_PORT ?? 3100);

// Mouvement réduit : les films ne se téléchargent pas (leur présence est vérifiée à part,
// dans `site.spec.ts`), si bien que la page atteint le calme réseau sur une machine chargée.
test.use({ launchOptions: { args: ["--host-resolver-rules=MAP *.xsom.fr 127.0.0.1"] }, contextOptions: { reducedMotion: "reduce" } });

function watch(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") problems.push(`${message.type()}: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`HTTP ${response.status()} ${response.url()}`);
  });
  return problems;
}

const sites = [
  { host: "ai.xsom.fr", brand: "xSOM · IA", heading: "La division IA de xSOM.", nav: ["Prestations", "Produits", "Menaces IA", "xSOM Consulting"], paths: ["/", "/menaces", "/mentions-legales"] },
  { host: "fleet.xsom.fr", brand: "xSOM Fleet", heading: "Les meilleures IA pour toute votre entreprise.", nav: ["Pourquoi Fleet", "Comment ça marche", "Engagements", "Questions", "Division IA", "xSOM Consulting"], paths: ["/"] },
  { host: "guard.xsom.fr", brand: "Secret Guard", heading: "Repérer les secrets avant qu’ils ne partent.", nav: ["Comment ça marche", "Open source", "Dans xSOM Fleet", "Division IA", "xSOM Consulting"], paths: ["/", "/cookies"] },
] as const;

for (const site of sites) {
  test(`${site.host} has its brand, its menu and no console error`, async ({ page }) => {
    const problems = watch(page);
    await page.goto(`http://${site.host}:${PORT}/`, { waitUntil: "load" });
    await expect(page.locator(".guard-header .brand__name").first()).toHaveText(site.brand);
    await expect(page.locator("h1").first()).toContainText(site.heading.split(" ").slice(0, 3).join(" "));
    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    await expect(nav.getByRole("link")).toHaveText(site.nav.map((label) => new RegExp(`^${label}`)));
    // Chaque site renvoie au site de conseil, dans son en-tête et son pied de page.
    await expect(nav.getByRole("link", { name: /xSOM Consulting/ })).toHaveAttribute("href", "https://www.xsom.fr");
    await expect(page.locator("footer").getByRole("link", { name: /www\.xsom\.fr/ })).toHaveAttribute("href", "https://www.xsom.fr");
    // Un lien d'un site à l'autre est absolu entre adresses de production.
    await expect(page.locator("footer").getByRole("link", { name: "Secret Guard", exact: true }).first()).toHaveAttribute("href", /^(https:\/\/guard\.xsom\.fr\/|\/)/);
    expect(problems).toEqual([]);
  });

  for (const path of site.paths.filter((p) => p !== "/")) {
    test(`${site.host}${path} loads without console error`, async ({ page }) => {
      const problems = watch(page);
      const response = await page.goto(`http://${site.host}:${PORT}${path}`, { waitUntil: "load" });
      expect(response?.status()).toBe(200);
      await expect(page.locator(".guard-header .brand__name").first()).toHaveText(site.brand);
      expect(problems).toEqual([]);
    });
  }
}

test("a link from one production address to another is absolute", async ({ page }) => {
  await page.goto(`http://ai.xsom.fr:${PORT}/`, { waitUntil: "load" });
  const products = page.locator("#produits");
  await expect(products.getByRole("link", { name: /Découvrir xSOM Fleet/ })).toHaveAttribute("href", "https://fleet.xsom.fr/");
  await expect(products.getByRole("link", { name: /Découvrir Secret Guard/ })).toHaveAttribute("href", "https://guard.xsom.fr/");
  await expect(page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Menaces IA" })).toHaveAttribute("href", "/menaces");
});
