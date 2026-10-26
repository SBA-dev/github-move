import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  // La story #8 (PWA) tourne sur le build de production : playwright.pwa.config.ts.
  features: ["features/**/*.feature", "!features/8-*.feature"],
  steps: "features/steps/**/*.ts",
  // Les scénarios @production visent l'adresse de production (playwright.production.config.ts) et les @pwa le build
  // (playwright.pwa.config.ts) : jamais le serveur de dev. L'option --tags de bddgen remplace ce filtre,
  // d'où le grepInvert des projets, qui s'ajoute aux options de la ligne de commande.
  tags: "not @production and not @pwa",
});

const HORS_DU_SERVEUR_DE_DEV = /@production|@pwa/;

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
    { name: "tablette", use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 } }, grepInvert: HORS_DU_SERVEUR_DE_DEV },
    { name: "telephone", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 740 }, hasTouch: true }, grepInvert: HORS_DU_SERVEUR_DE_DEV },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
  },
});
