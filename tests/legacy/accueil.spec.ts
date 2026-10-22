import { expect, test } from "@playwright/test";
import { ouvrirApplicationActuelle } from "./ouvrir.ts";

test("l'accueil propose de créer un profil enfant", async ({ page }) => {
  await ouvrirApplicationActuelle(page);
  await expect(page.getByRole("heading", { level: 1, name: "Savanturier" })).toBeVisible();
  await expect(page.locator("#f-prenom")).toBeVisible();
});

test("le profil enfant n'a plus de réglage de temps d'écran", async ({ page }) => {
  await ouvrirApplicationActuelle(page);
  await expect(page.locator("#f-prenom")).toBeVisible();
  await expect(page.locator("#f-temps")).toHaveCount(0);
});
