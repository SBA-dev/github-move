import { expect } from "@playwright/test";
import { Given, Then } from "./fixtures.ts";
import { finirLaParoleJusqua } from "./exercices-a-choix.steps.ts";
import { journal, laisserPasserLeDelaiDeLecture, normaliser } from "./voix.steps.ts";

// Étapes des scénarios de #17 qui dépendent du réglage du parent (#12) : « tout lire à voix haute » et mode dys.
// Les réglages ne sont pas livrés : leur étape échoue clairement. Les étapes qui ne font que constater (ce que Léa
// entend, ce qu'elle voit) sont déjà écrites pour le jour où #12 sera livrée.

const DEPEND_DE_12 = "Étape non implémentée : dépend de la story #12 (réglages du parent : tout lire à voix haute, mode dys).";

Given(/^Paul a réglé « tout lire à voix haute » sur « (?:oui|non) » pour Léa$/, async () => {
  throw new Error(DEPEND_DE_12);
});

Then(/^Léa voit la question et les choix en mode dys : .+$/, async () => {
  throw new Error(DEPEND_DE_12);
});

Then(/^Léa entend ensuite Noisette dire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await finirLaParoleJusqua(page, { type: "texte-lu", texte: normaliser(texte) });
});

Then(/^Léa n'entend pas les choix$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  const { lecture } = await journal(page);
  expect(lecture.texte).not.toMatch(/Est-ce/);
});
