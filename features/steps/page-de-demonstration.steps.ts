import { expect, type Page } from "@playwright/test";
import { Then, When } from "./fixtures.ts";

// Story #58 : la page de démonstration n'existe plus. Ses anciennes adresses mènent à l'accueil, comme toute adresse
// inconnue, en développement comme dans la version publiée (#8).

async function ouvrirSavanturierALAdresse(page: Page, adresse: string) {
  await page.goto(adresse);
  // Une page de test chargée à la demande apparaîtrait après le premier affichage : on laisse l'application finir de se charger.
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
}

async function verifierQueLaPageDeDemonstrationNEstPasAffichee(page: Page) {
  await expect(page.getByText(/démonstration/i)).toHaveCount(0);
  await expect(page.getByTestId("presentation")).toHaveCount(0);
  await expect(page.getByTestId("consigne")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Bonne réponse", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Erreur", exact: true })).toHaveCount(0);
}

When(/^(?:j'ouvre|Paul ouvre|Léa ouvre) Savanturier à l'adresse « (\/[^«»]*) »$/, async ({ page }, adresse: string) => {
  await ouvrirSavanturierALAdresse(page, adresse);
});

Then(/^(?:je ne vois|il ne voit|elle ne voit) aucune page de démonstration$/, async ({ page }) => {
  await verifierQueLaPageDeDemonstrationNEstPasAffichee(page);
});
