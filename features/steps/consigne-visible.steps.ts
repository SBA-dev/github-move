import { expect } from "@playwright/test";
import { DUREE_D_AFFICHAGE_SANS_VOIX_MS } from "../../supabase/functions/_shared/apprentissage/domain/attente-avant-l-ecran-suivant.ts";
import { Given, Then } from "./fixtures.ts";
import { bulle, injecter, leconDeTest } from "./etapes-puis-exercices.steps.ts";
import { elementsDe, exerciceEnCours, jouerJusquAuxEtiquettes, poserEtAttendreLOrdre } from "./classer-ordre-trous.steps.ts";
import { demarrer } from "./exercices-a-choix.steps.ts";
import { aContinueApresLaReussite, boutonContinuerApresLaReussite } from "./etoiles-et-fin-de-seance.steps.ts";
import { consigneAffichee, normaliser, scenario } from "./voix.steps.ts";

// Story #79 : la consigne reste affichée pendant tout l'exercice, la voix bloquée reste signalée, et sans voix la
// félicitation de la dernière bonne réponse attend que l'enfant continue.

// Sans voix, l'écran suivant vient seul au bout d'environ 2 s : pour prouver qu'il ne vient pas, on attend plus longtemps (la durée du domaine plus une marge).
const DELAI_POUR_PROUVER_QUE_RIEN_NE_VIENT_MS = DUREE_D_AFFICHAGE_SANS_VOIX_MS + 600;

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

Given(
  /^une leçon de test « ([^«»]+) » a un exercice bulles de consigne « ([^«»]+) » qui pose « (.+) »$/,
  async ({ page }, titre: string, consigne: string, question: string) => {
    scenario(page).relitPendantLaQuestion = { relue: false, lotsAvant: undefined };
    await injecter(
      page,
      leconDeTest("test-consigne-visible", titre, [{
        type: "bulles",
        titre,
        consigne,
        questions: [{ question, choix: ["1", "2", "3"], reponse: "3" }],
      }]),
    );
  },
);

Given(
  /^Léa en est à la dernière étiquette de l'exercice « ([^«»]+) », « ([^«»]+) »$/,
  async ({ page }, _exercice: string, derniere: string) => {
    await demarrer(page);
    await jouerJusquAuxEtiquettes(page);
    const elements = elementsDe(await exerciceEnCours(page));
    expect(elements[elements.length - 1]).toBe(derniere);
    for (const element of elements.slice(0, -1)) await poserEtAttendreLOrdre(page, element);
    await expect(page.getByTestId("etiquette")).toHaveCount(1);
  },
);

Then(/^Léa ne voit plus la consigne « (.+) »$/, async ({ page }, texte: string) => {
  await expect(consigneAffichee(page).filter({ hasText: normaliser(texte) })).toHaveCount(0);
});

Then(/^l'étiquette « ([^«»]+) » reste à la première place$/, async ({ page }, etiquette: string) => {
  const place = page.getByTestId("place").first();
  await expect(place).toHaveAttribute("data-remplie", "true");
  await expect(place).toHaveText(etiquette);
});

Then(/^Léa voit une félicitation de Noisette$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
});

Then(/^la fin de la séance ne s'affiche pas d'elle-même$/, async ({ page }) => {
  await expect(boutonContinuerApresLaReussite(page)).toBeVisible();
  await page.evaluate((delai) => new Promise<void>((fin) => setTimeout(fin, delai)), DELAI_POUR_PROUVER_QUE_RIEN_NE_VIENT_MS);
  await expect(boutonContinuerApresLaReussite(page)).toBeVisible();
  await expect(page.getByTestId("fin-de-seance")).toHaveCount(0);
});

Then(/^Léa n'a pas eu à continuer$/, async ({ page }) => {
  expect(aContinueApresLaReussite(page)).toBe(false);
  await expect(boutonContinuerApresLaReussite(page)).toHaveCount(0);
});

Then(/^ensuite seulement, Léa voit la consigne « (.+) »$/, async ({ page }, texte: string) => {
  await expect(consigneAffichee(page)).toHaveText(normaliser(texte));
});

Then(/^Léa voit le texte de l'étape de leçon « (.+) »$/, async ({ page }, texte: string) => {
  await expect(bulle(page)).toHaveText(new RegExp(`^\\s*${echapper(normaliser(texte))}\\s*$`));
});
