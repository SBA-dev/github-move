import { Given, Then } from "./fixtures.ts";

// Étapes des scénarios qui dépendent des profils enfants et de leur rattachement à un parent (story #11, lot 2).
// Elles ne sont pas implémentées : l'application n'a encore ni profil enfant ni rattachement, et on n'invente pas
// de faux comportement. Elles sont déclarées pour que `bddgen` génère les tests ; les scénarios concernés sont exclus
// de l'exécution par `--grep-invert "dépend de #11"` (voir le rapport) et échouent clairement s'ils sont lancés.

const DEPEND_DE_11 = "Étape non implémentée : dépend de la story #11 (profils enfants et rattachement).";

Given(/^Léa a un profil enfant de niveau \S+$/, async () => {
  throw new Error(DEPEND_DE_11);
});

Given(/^Paul est rattaché au profil enfant de Léa$/, async () => {
  throw new Error(DEPEND_DE_11);
});

Then(/^la déconnexion n'est pas proposée à Léa$/, async () => {
  throw new Error(DEPEND_DE_11);
});

Then(/^Claire ne voit pas le profil enfant de Léa$/, async () => {
  throw new Error(DEPEND_DE_11);
});
