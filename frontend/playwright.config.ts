import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.XSOM_E2E_PORT ?? 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * Le site n'a aucune variable d'environnement obligatoire : le serveur de test
 * démarre sans rien. `E2E_SKIP_BUILD=1` réutilise un `.next` déjà construit (la CI
 * construit une fois, puis lance les tests).
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "list",
  use: { baseURL: BASE_URL },
  webServer: {
    command: `${process.env.E2E_SKIP_BUILD === "1" ? "" : "npx next build && "}npx next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Échappatoire pour un poste dont le Chromium préinstallé ne correspond pas
        // à la révision qu'attend la version de `@playwright/test` du dépôt. Sans
        // elle, la suite ne démarre pas et il faut télécharger un navigateur.
        // Non renseignée, le comportement est celui d'avant : Playwright prend le
        // sien. La CI ne la définit pas.
        ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
          ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } }
          : {}),
      },
    },
  ],
});
