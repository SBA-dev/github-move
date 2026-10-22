import { expect } from "@playwright/test";
import { Then, When } from "./fixtures.ts";

When("j'ouvre Savanturier", async ({ page }) => {
  await page.goto("/");
});

Then("je vois le nom de l'application", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Savanturier" })).toBeVisible();
});

Then("la page tient dans la largeur de l'écran", async ({ page }) => {
  const debordement = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(debordement).toBeLessThanOrEqual(0);
});
