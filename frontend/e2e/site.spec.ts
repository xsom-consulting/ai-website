import { expect, test } from "@playwright/test";

/**
 * Ce que les trois sites ont en commun : la langue (le français par défaut, résolu côté
 * serveur), l'indexation, le favicon, la réduction des animations, et l'absence de tout
 * ce qui appartenait à l'ancienne console (connexion, inscription, appairage).
 */
test("un visiteur sans cookie reçoit le français, et le document le déclare", async ({ page }) => {
  const reponse = await page.goto("/");

  // L'attribut **et** le texte, dans la même assertion : `lang` valait `fr` en dur
  // pendant que le texte sortait en anglais, si bien qu'un lecteur d'écran lisait de
  // l'anglais avec une voix française.
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("h1")).toHaveText("Conseil et produits pour l’IA d’entreprise.");
  await expect(page).toHaveTitle("xSOM · IA · la division IA de xSOM Consulting");
  const description = await page.locator('head meta[name="description"]').getAttribute("content");
  expect(description).toContain("La division IA de xSOM Consulting : xSOM Fleet");

  // Le français est dans la **première réponse**, pas posé après coup : un robot, qui
  // n'hydrate pas, doit le lire.
  const html = (await reponse?.text()) ?? "";
  expect(html).toContain("Conseil et produits pour l’IA d’entreprise.");
});

test("basculer en anglais tient au rechargement", async ({ page }) => {
  await page.goto("/");
  // `exact` : sans lui, le nom accessible est cherché en sous-chaîne insensible à la casse.
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Consulting and products for enterprise AI.");

  // Le rechargement est le point : la préférence tient dans un cookie que le serveur
  // relit, elle ne vit pas seulement dans l'état d'un composant.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveText("Consulting and products for enterprise AI.");
  await expect(page).toHaveTitle("xSOM · AI · the AI division of xSOM Consulting");
});

test("les pages publiques restent indexables et aucune n'est une console", async ({ page }) => {
  for (const chemin of ["/", "/fleet", "/secret-guard", "/menaces", "/mentions-legales"]) {
    await page.goto(chemin);
    // Un `noindex` posé trop large retirerait le site des résultats sans que rien ne le signale.
    await expect(page.locator('head meta[name="robots"]')).toHaveCount(0);
  }
});

test("rien ne mène à une connexion, une inscription ou un appairage", async ({ page, request }) => {
  for (const chemin of ["/", "/fleet", "/secret-guard", "/menaces", "/mentions-legales"]) {
    await page.goto(chemin);
    const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    for (const href of hrefs) expect(href, `${chemin} → ${href}`).not.toMatch(/\/(login|signup|forgot-password|auth|home|admin|settings|extensions)(\/|\?|$)/);
  }
  // Les routes de la console et de l'appairage de l'extension n'existent plus.
  for (const chemin of ["/login", "/signup", "/forgot-password", "/home", "/api/control/v1/policy", "/api/enrollment/start", "/api/auth/login"]) {
    const reponse = await request.get(chemin, { maxRedirects: 0 });
    expect(reponse.status(), chemin).toBe(404);
  }
});

test("chaque film déclaré et chaque affiche existent", async ({ page, request }) => {
  const declared = new Set<string>();
  for (const chemin of ["/", "/fleet", "/secret-guard"]) {
    await page.goto(chemin);
    const urls = await page.locator("video").evaluateAll((videos) =>
      videos.flatMap((video) => [video.getAttribute("src"), video.getAttribute("poster")].filter((url): url is string => !!url)),
    );
    for (const url of urls) declared.add(url);
  }
  // La couverture de la division IA, Fleet (le film de présentation seul) et Secret
  // Guard : au moins six fichiers, vidéos et affiches.
  expect(declared.size).toBeGreaterThanOrEqual(6);
  for (const url of declared) {
    // Les premiers octets suffisent : on prouve que le fichier est servi, sans le télécharger.
    const reponse = await request.get(url, { headers: { range: "bytes=0-1" } });
    expect([200, 206], url).toContain(reponse.status());
  }
});

test("le site n'exige aucune variable d'environnement : la recherche par IA est facultative", async ({ request }) => {
  // Sans clé, la route répond « indisponible » et le glossaire retombe sur son filtre local.
  const reponse = await request.post("/api/threat-search", { data: { query: "injection de prompt", lang: "fr" } });
  expect([200, 503]).toContain(reponse.status());
  const trop = await request.post("/api/threat-search", { data: { query: "x" } });
  expect(await trop.json()).toEqual({ ids: [] });
});

test("le favicon est servi, déclaré, et décodable par le navigateur", async ({ page }) => {
  for (const asset of ["xsom-mark.svg", "xsom-mark-light.svg"]) {
    const logo = await page.request.get(`/${asset}`);
    expect(logo.status()).toBe(200);
    expect(logo.headers()["content-type"]).toContain("image/svg+xml");
    expect(await logo.text()).toContain("<svg");
  }
  const reponse = await page.goto("/icon.svg");
  expect(reponse?.status()).toBe(200);
  expect(reponse?.headers()["content-type"]).toContain("image/svg+xml");

  await page.goto("/");
  // Next pose la balise lui-même à partir de `app/icon.svg` ; son absence signifie que
  // le navigateur retomberait sur `/favicon.ico`, qui n'existe pas.
  const href = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(href).toContain("/icon.svg");

  // `naturalWidth > 0` sépare « le fichier arrive » de « le navigateur sait le lire ».
  const decode = await page.evaluate(
    (src) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img.naturalWidth > 0);
        img.onerror = () => resolve(false);
        img.src = src;
      }),
    href as string,
  );
  expect(decode).toBe(true);
});

test("the fonts are the design system's, loaded locally", async ({ page }) => {
  await page.goto("/");
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    const root = getComputedStyle(document.documentElement);
    const family = (token: string) => root.getPropertyValue(token).split(",")[0].trim().replace(/["']/g, "");
    const display = family("--signal-font-display");
    const body = family("--signal-font-body");
    const loaded = [...document.fonts].filter((face) => face.status === "loaded").map((face) => face.family.replace(/["']/g, ""));
    return { display, body, loaded, headingStyle: getComputedStyle(document.querySelector("h2")!).fontFamily, bodyStyle: getComputedStyle(document.body).fontFamily };
  });
  expect(fonts.display.toLowerCase()).toContain("manrope");
  expect(fonts.body.toLowerCase()).toContain("sourcesans");
  expect(fonts.loaded).toContain(fonts.display);
  expect(fonts.loaded).toContain(fonts.body);
  expect(fonts.headingStyle).toContain(fonts.display);
  expect(fonts.bodyStyle).toContain(fonts.body);
});

test("reducing motion reveals the content instead of hiding it for good", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  // L'effet existe bien : sans `is-visible`, la cible est masquée.
  const masquee = await page.evaluate(() => {
    const cible = document.querySelector("#prestations .ai-closing__title") as HTMLElement;
    cible.classList.remove("is-visible");
    document.documentElement.dataset.motion = "on";
    return getComputedStyle(cible).opacity;
  });
  expect(masquee).toBe("0");

  // Et le réglage « Réduire les animations » écrit `off`, pas l'absence de marqueur :
  // un sélecteur de présence gardait l'opacité à zéro sur un contenu que plus rien
  // n'allait révéler.
  const reduite = await page.evaluate(() => {
    const cible = document.querySelector("#prestations .ai-closing__title") as HTMLElement;
    cible.classList.remove("is-visible");
    document.documentElement.dataset.motion = "off";
    return getComputedStyle(cible).opacity;
  });
  expect(reduite).toBe("1");
});

test("a page reached by an internal link still reveals what it hides", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/menaces");
  await page.getByRole("link", { name: "Accueil", exact: true }).first().click();
  await expect(page).toHaveURL(/\/$/);

  // Le layout racine reste monté d'une page à l'autre : sans relevé des cibles à
  // chaque navigation, cette page gardait ses révélations à zéro pour toujours.
  const cible = page.locator("#prestations .ai-closing__title");
  await cible.scrollIntoViewIfNeeded();
  await expect.poll(() => cible.evaluate((n) => getComputedStyle(n).opacity), { timeout: 5_000 }).toBe("1");
});

test("les pages légales décrivent le site tel qu'il est, sans compte ni console", async ({ page }) => {
  await page.goto("/confidentialite");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Politique de confidentialité");
  await expect(page.locator("article")).toContainText("n’ont ni compte, ni connexion");
  await expect(page.locator("article")).toContainText("Mistral AI");
  await expect(page.locator("article")).not.toContainText("Supabase");
  await page.goto("/cookies");
  await expect(page.locator("article")).not.toContainText("Connexion");
  await page.goto("/mentions-legales");
  await expect(page.locator("article")).toContainText("XSOM CONSULTING");
  await expect(page.locator("article")).toContainText("Apache-2.0");
  await page.goto("/conditions-utilisation");
  await expect(page.locator("article")).toContainText("xSOM Fleet et Secret Guard");
});
