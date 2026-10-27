import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

// Story #8 (PWA) : le service worker n'existe que dans le build de production.
// Les scénarios tournent sur `vite preview` (4173), derrière le relais de test (4174)
// qui permet de « publier » une nouvelle version ou une nouvelle leçon.
// Le scénario @acces dépend de la déconnexion (#5) : il est branché avec #5.
const testDir = defineBddConfig({
  features: ["features/8-*.feature", "features/45-*.feature"],
  steps: "features/steps/**/*.ts",
  outputDir: ".features-gen-pwa",
  // #8 : tous les scénarios sauf @acces. #45 : seulement ceux qui ont besoin du service worker (@pwa).
  tags: "(not @issue-45 and not @acces) or (@issue-45 and @pwa and not @production)",
});

export default defineConfig({
  testDir,
  workers: 1,
  use: {
    baseURL: "http://localhost:4174",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "tablette", use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 } } },
    { name: "telephone", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 740 }, hasTouch: true } },
  ],
  webServer: [
    {
      command: "npm run build && npx vite preview --port 4173 --strictPort",
      url: "http://localhost:4173",
      reuseExistingServer: true,
      timeout: 180_000,
    },
    {
      command: "node features/support/serveur-pwa.mjs",
      url: "http://localhost:4174",
      reuseExistingServer: true,
    },
  ],
});
