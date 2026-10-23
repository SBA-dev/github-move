import { Given, Then, When } from "./fixtures.ts";

// Étapes des scénarios de #16 qui ne se jouent pas encore (périmètre « Cadre seul » arbitré par le PO) :
// poser une étiquette du classer (#18).
// Elles ne simulent aucun comportement : elles échouent clairement
// si le scénario est lancé. Les scénarios concernés sont exclus de l'exécution (voir le rapport de l'E2E).

const DEPEND_DE_18 = "Étape non implémentée : dépend de la story #18 (classer : poser une étiquette) ou #20 (fluence).";

function dependDe(message: string) {
  return async () => {
    throw new Error(message);
  };
}

// --- #18 : poser une étiquette dans une maison

Given(/^Léa joue seulement l'exercice « .+ » de la leçon « .+ »$/, dependDe(DEPEND_DE_18));
Given(/^il ne reste que l'étiquette « .+ » à poser$/, dependDe(DEPEND_DE_18));
When(/^Léa pose l'étiquette « .+ » dans la maison « .+ »$/, dependDe(DEPEND_DE_18));
Then(/^l'exercice « .+ » n'a pas été joué$/, dependDe(DEPEND_DE_18));
