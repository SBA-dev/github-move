import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

// Story #45 : contrôles après publication, à l'adresse de production (adresse gratuite d'alwaysdata).
// Aucune préparation ni aucun nettoyage par les tests : seuls le parent de test de la production et son
// profil « Pilote », créés à la main. La clé service_role n'a donc rien à faire ici.
const adresseDeProduction = process.env.ADRESSE_DE_PRODUCTION;
if (!adresseDeProduction) {
  throw new Error("ADRESSE_DE_PRODUCTION est absente : les contrôles de production ne démarrent pas sans l'adresse à contrôler.");
}
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY est définie : les contrôles de production ne démarrent jamais avec une clé service_role.");
}

const testDir = defineBddConfig({
  features: "features/45-*.feature",
  steps: "features/steps/**/*.ts",
  outputDir: ".features-gen-production",
  tags: "@production",
});

export default defineConfig({
  testDir,
  outputDir: "test-results-production",
  workers: 1,
  use: {
    baseURL: adresseDeProduction,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "tablette", use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 } } },
    { name: "telephone", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 740 }, hasTouch: true } },
  ],
});
