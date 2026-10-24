import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  // La story #8 (PWA) tourne sur le build de production : playwright.pwa.config.ts.
  features: ["features/**/*.feature", "!features/8-*.feature"],
  steps: "features/steps/**/*.ts",
});

// Décision 0020 : les scénarios attendent surtout le réseau (projet Supabase en ligne), pas le processeur.
// Chaque scénario prépare ses propres données (suffixe propre au worker, features/steps/fixtures.ts) :
// ils peuvent tourner en parallèle, même dans un seul fichier .feature. Au-delà de 3 workers sur 4 cœurs,
// le serveur de dev et les navigateurs saturent la machine (dépassements de délai mesurés le 2026-10-24).
export default defineConfig({
  testDir,
  fullyParallel: true,
  workers: Number(process.env.E2E_WORKERS ?? 3),
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "tablette", use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 } } },
    { name: "telephone", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 740 }, hasTouch: true } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
  },
});
