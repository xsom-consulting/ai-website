import { expect, test } from "@playwright/test";

import { THREAT_GLOSSARY } from "../lib/threat-glossary";

const TOTAL = THREAT_GLOSSARY.length;

test("the glossary revendique la couverture d'aucun produit, sauf la fuite de secrets pour Secret Guard", () => {
  // Le glossaire décrit des menaces et leurs parades de référence. Une seule ligne
  // porte le marqueur du moteur open source, et chaque ligne a un texte dans les deux
  // langues.
  expect(THREAT_GLOSSARY.filter((entry) => entry.secretGuard).map((entry) => entry.id)).toEqual(["fuite-de-secrets"]);
  const serialised = JSON.stringify(THREAT_GLOSSARY);
  expect(serialised).not.toContain("AI Guard");
  for (const entry of THREAT_GLOSSARY) {
    for (const lang of ["fr", "en"] as const) {
      expect(entry.copy[lang].title, entry.id).not.toBe("");
      expect(entry.copy[lang].attack, entry.id).not.toBe("");
      expect(entry.copy[lang].mitigation, entry.id).not.toBe("");
    }
  }
});

test("the glossary table combines search, facets and sorting, expands rows and translates", async ({ page }) => {
  let definitionApiRequests = 0;
  await page.route("**/api/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    // La recherche par IA est un enrichissement optionnel : son indisponibilité doit
    // retomber sur le filtre textuel local. Les définitions, elles, ne doivent jamais
    // être chargées depuis une API.
    if (pathname !== "/api/threat-search") definitionApiRequests += 1;
    await route.fulfill({ status: 503, json: { detail: "Public definitions are local content" } });
  });
  await page.goto("/menaces");
  await expect(page.getByRole("heading", { name: "Glossaire des menaces IA", exact: true })).toBeVisible();

  const table = page.getByRole("table");
  const rows = page.locator(".guard-glossary__row");
  // Le compteur de résultats, et lui seul : un second `role="status"` apparaît dès que
  // la recherche par IA a répondu (ou échoué, ici : elle est moquée en 503).
  const status = page.locator('p[role="status"][aria-atomic="true"]');
  const search = page.getByRole("searchbox", { name: "Rechercher une menace", exact: true });
  const uses = page.getByRole("group", { name: "Filtrer par usage IA", exact: true });

  await expect(rows).toHaveCount(TOTAL);
  await expect(status).toHaveText(`${TOTAL} menaces affichées sur ${TOTAL}`);
  for (const name of ["Menace", "Aperçu", "Attaque type · conséquence", "Parade de référence"]) {
    await expect(table.getByRole("columnheader", { name, exact: true })).toBeVisible();
  }
  await expect(page.locator(".guard-glossary__group")).toHaveCount(13);
  await expect(uses.getByRole("button", { name: "Tous les usages", exact: true })).toHaveAttribute("aria-pressed", "true");

  // La recherche ignore accents et casse, et les mots portent sur une même ligne.
  await search.fill("CODE GENERE VULNERABLE");
  await expect(rows).toHaveCount(1);
  await expect(rows.first().getByRole("rowheader")).toContainText("Code généré vulnérable");
  await uses.getByRole("button", { name: "Équipes métier", exact: true }).click();
  await expect(rows).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Aucune menace trouvée", exact: true })).toBeVisible();
  await page.locator(".guard-glossary__empty").getByRole("button", { name: "Réinitialiser les filtres", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(rows).toHaveCount(TOTAL);

  // Les facettes secondaires sont repliées ; chaque filtre actif se retire d'un clic.
  const more = page.locator(".guard-glossary__more");
  await expect(page.getByRole("combobox", { name: "Catégorie", exact: true })).toBeHidden();
  await more.locator("summary").click();
  await page.getByRole("combobox", { name: "Catégorie", exact: true }).selectOption("agents");
  await expect(rows).toHaveCount(THREAT_GLOSSARY.filter((entry) => entry.category === "agents").length);
  await expect(more.locator(".guard-glossary__badge")).toHaveText("1");
  await page.getByRole("button", { name: "Retirer le filtre : Agents", exact: true }).click();
  await expect(rows).toHaveCount(TOTAL);
  await page.getByRole("combobox", { name: "Surface d’attaque", exact: true }).selectOption("people");
  await expect(rows).toHaveCount(THREAT_GLOSSARY.filter((entry) => entry.surface === "people").length);
  await page.getByRole("button", { name: "Réinitialiser les filtres", exact: true }).click();

  // Hors du tri par catégorie, les groupes disparaissent et chaque ligne dit la sienne.
  await page.getByRole("combobox", { name: "Trier par", exact: true }).selectOption("risk");
  await expect(page.locator(".guard-glossary__group")).toHaveCount(0);
  await expect(rows.first().locator(".guard-glossary__kicker")).toBeVisible();
  await page.getByRole("combobox", { name: "Trier par", exact: true }).selectOption("category");

  // Le détail s'ouvre sur place : définition, exemple, état de l'art, outils, figure.
  const rag = page.getByRole("button", { name: "Accès indu aux documents du RAG", exact: true });
  await expect(page.locator("#acces-rag-details")).toBeHidden();
  await rag.click();
  await expect(rag).toHaveAttribute("aria-expanded", "true");
  const details = page.locator("#acces-rag-details");
  await expect(details).toBeVisible();
  await expect(details.getByRole("heading", { name: "Exemple illustratif", exact: true })).toBeVisible();
  await expect(details.getByText("Outils libres", { exact: true })).toBeVisible();
  await expect(details.getByText("État de l’art", { exact: true })).toBeVisible();
  await expect(details.locator(".guard-glossary__source")).toHaveAttribute("href", /^https:\/\/genai\.owasp\.org\//);
  await expect(details.locator(".diag > title")).toHaveCount(1);
  // Aucune revendication de produit sur une menace qui n'est pas la fuite de secrets.
  await expect(details.locator(".guard-glossary__guard")).toHaveCount(0);
  await rag.click();
  await expect(details).toBeHidden();
  await page.getByRole("button", { name: "Injection de prompt indirecte", exact: true }).click();
  // Les marqueurs de flèche sont posés UNE fois pour le document, quel que soit le
  // nombre de figures ouvertes.
  await page.getByRole("button", { name: "Autonomie excessive", exact: true }).click();
  await expect(page.locator(".guard-glossary__details .diag")).toHaveCount(2);
  await expect(page.locator("marker#fx")).toHaveCount(1);
  await expect(page.locator("marker#ax")).toHaveCount(1);

  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByRole("heading", { name: "AI threat glossary", exact: true })).toBeVisible();
  await page.getByRole("group", { name: "Filter by AI use", exact: true }).getByRole("button", { name: "Model & data teams", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search for a threat", exact: true }).fill("poisoning");
  const headers = rows.getByRole("rowheader");
  await expect(headers.filter({ hasText: "Training-data poisoning" })).toHaveCount(1);
  await expect(headers.filter({ hasText: "RAG poisoning" })).toHaveCount(1);
  // Même mot, mais un usage que le filtre écarte : les deux critères se composent.
  await expect(headers.filter({ hasText: "Tool poisoning and rug pull" })).toHaveCount(0);
  expect(definitionApiRequests).toBe(0);
});

test("a deep link opens the row it targets", async ({ page }) => {
  await page.goto("/menaces#code-vulnerable");
  await expect(page.getByRole("button", { name: "Code généré vulnérable", exact: true })).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#code-vulnerable-details")).toBeVisible();
  await expect(page.locator("#code-vulnerable-details .diag > title")).toHaveCount(1);
});

test("the Secret Guard filter is shareable and only keeps secret leakage", async ({ page }) => {
  await page.goto("/menaces?engine=secret-guard");
  await expect(page.getByRole("combobox", { name: "Produit", exact: true })).toHaveValue("secret-guard");
  await expect(page.locator(".guard-glossary__row")).toHaveCount(1);
  await page.locator("#fuite-de-secrets").getByRole("button", { name: "Fuite de secrets", exact: true }).click();
  const panel = page.locator("#fuite-de-secrets-details .guard-glossary__guard");
  await expect(panel).toContainText("Il ne couvre pas le reste de cette menace.");
  await expect(panel.getByRole("link", { name: /Découvrir Secret Guard/ })).toHaveAttribute("href", "/secret-guard");
  await page.getByRole("combobox", { name: "Produit", exact: true }).selectOption("all");
  await expect.poll(() => new URL(page.url()).searchParams.get("engine")).toBeNull();
});

test("the glossary says it describes threats and does not claim a product covers them", async ({ page }) => {
  await page.goto("/menaces");
  await expect(page.locator(".guard-glossary__scope")).toContainText("il ne dit pas qu’un produit les couvre");
  await expect(page.locator("body")).not.toContainText("AI Guard");
  await expect(page.getByRole("link", { name: /Retour à l’accueil IA/ })).toHaveAttribute("href", "/");
});

for (const width of [390, 768, 1440]) {
  test(`the glossary stays contained and usable in both languages at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/menaces");
    const rows = page.locator(".guard-glossary__row");
    await expect(rows).toHaveCount(TOTAL);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    // Sous 1024px, les lignes deviennent des fiches et l'en-tête de colonnes s'efface.
    await expect(page.getByRole("columnheader", { name: "Menace", exact: true })).toBeVisible({ visible: width > 1024 });
    await page.getByRole("group", { name: "Filtrer par usage IA", exact: true }).getByRole("button", { name: "Équipes modèles & données", exact: true }).click();
    await expect(page.locator("#empoisonnement")).toBeVisible();
    await page.getByRole("button", { name: "Empoisonnement des données d’entraînement", exact: true }).click();
    await expect(page.locator("#empoisonnement-details .diag")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    // Sous 900 px, la langue se choisit dans le menu de l'en-tête.
    await page.evaluate(() => window.scrollTo(0, 0));
    const menu = page.getByRole("button", { name: "Menu", exact: true });
    if (await menu.isVisible()) await menu.click();
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.getByRole("heading", { name: "AI threat glossary", exact: true })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Search for a threat", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) {
      const first = await rows.nth(0).boundingBox();
      const second = await rows.nth(1).boundingBox();
      expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1);
    }
  });
}
