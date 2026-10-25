import { expect, type Page } from "@playwright/test";
import { DUREE_D_AFFICHAGE_SANS_VOIX_MS } from "../../supabase/functions/_shared/apprentissage/domain/attente-avant-l-ecran-suivant.ts";
import { Given, Then, When } from "./fixtures.ts";
import { bulle, injecter, leconDeTest } from "./etapes-puis-exercices.steps.ts";
import { elementsDe, exerciceEnCours, jouerJusquAuxEtiquettes, poserEtAttendreLOrdre } from "./classer-ordre-trous.steps.ts";
import { avancerJusquAuxChoix, demarrer, textesDesChoix } from "./exercices-a-choix.steps.ts";
import { aContinueApresLaReussite, boutonContinuerApresLaReussite } from "./etoiles-et-fin-de-seance.steps.ts";
import { consigneAffichee, journal, normaliser, scenario, terminerLaLecture } from "./voix.steps.ts";

// Story #79 : la consigne reste affichée pendant tout l'exercice, la voix bloquée reste signalée, et sans voix la
// félicitation de la dernière bonne réponse attend que l'enfant continue.

// Sans voix, l'écran suivant vient seul au bout d'environ 2 s : pour prouver qu'il ne vient pas, on attend plus longtemps (la durée du domaine plus une marge).
const DELAI_POUR_PROUVER_QUE_RIEN_NE_VIENT_MS = DUREE_D_AFFICHAGE_SANS_VOIX_MS + 600;

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function injecterUnExerciceBulles(page: Page, titre: string, consigne: string, questions: string[]) {
  scenario(page).relitPendantLaQuestion = { relue: false, lotsAvant: undefined };
  await injecter(
    page,
    leconDeTest("test-consigne-visible", titre, [{
      type: "bulles",
      titre,
      consigne,
      questions: questions.map((question) => ({ question, choix: ["1", "2", "3"], reponse: "3" })),
    }]),
  );
}

Given(
  /^une leçon de test « ([^«»]+) » a un exercice bulles de consigne « ([^«»]+) » qui pose « ((?:(?!» puis «).)+) »$/,
  async ({ page }, titre: string, consigne: string, question: string) => {
    await injecterUnExerciceBulles(page, titre, consigne, [question]);
  },
);

Given(
  /^une leçon de test « ([^«»]+) » a un exercice bulles de consigne « ([^«»]+) » qui pose « ([^«»]+) » puis « ([^«»]+) »$/,
  async ({ page }, titre: string, consigne: string, premiere: string, seconde: string) => {
    await injecterUnExerciceBulles(page, titre, consigne, [premiere, seconde]);
  },
);

When(
  /^Léa demande à réécouter la consigne pendant que Noisette lit la question « ([^«»]+) »$/,
  async ({ page }, question: string) => {
    const debut = normaliser(question).slice(0, 12);
    await demarrer(page);
    await expect.poll(async () => {
      const lisaitLaQuestion = (await journal(page)).lecture.texte.includes(debut);
      if (!lisaitLaQuestion) await terminerLaLecture(page);
      return lisaitLaQuestion;
    }, { intervals: [100] }).toBe(true);
    const relire = page.getByRole("button", { name: "Relire la consigne", exact: true });
    await expect(relire).not.toHaveAttribute("aria-disabled", "true");
    const etat = scenario(page);
    etat.relitPendantLaQuestion = { relue: true, lotsAvant: (await journal(page)).lots };
    await relire.click();
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

Then(/^Léa voit la question « ([^«»]+) » avec ses choix$/, async ({ page }, question: string) => {
  await avancerJusquAuxChoix(page);
  await expect(page.getByTestId("question")).toHaveText(normaliser(question));
  expect([...(await textesDesChoix(page))].sort()).toEqual(["1", "2", "3"]);
});

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
