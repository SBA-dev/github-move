import { defineConfig, devices } from "@playwright/test";

// Tests de caractérisation de l'application actuelle (app/), avant toute correction de bug.
export default defineConfig({
  testDir: "tests/legacy",
  use: {
    baseURL: "http://localhost:8765",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "tablette", use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 } } },
    { name: "telephone", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, hasTouch: true } },
  ],
  webServer: {
    command: "python3 -m http.server 8765 --directory app",
    url: "http://localhost:8765",
    reuseExistingServer: true,
  },
});
