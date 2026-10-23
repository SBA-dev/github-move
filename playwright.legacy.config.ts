import { defineConfig, devices } from "@playwright/test";

// Tests de caractérisation de l'application actuelle (app/), avant toute correction de bug.
export default defineConfig({
  testDir: "tests/legacy",
  // Les tests attendent surtout l'application (voix, pauses) : on occupe tous les cœurs.
  workers: "100%",
  use: {
    baseURL: "http://localhost:8765",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "tablette", use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 } } },
    // Sur le téléphone, la bibliothèque n'est jouée que sur un échantillon (voir tests/legacy/bibliotheque.spec.ts).
    {
      name: "telephone",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, hasTouch: true },
      grepInvert: /@bibliotheque-complete/,
    },
  ],
  webServer: {
    command: "python3 -m http.server 8765 --directory app",
    url: "http://localhost:8765",
    reuseExistingServer: true,
  },
});
