import { assertEquals } from "@std/assert";
import { AdaptationDeLaDifficulte } from "./adaptation-de-la-difficulte.ts";

Deno.test("un enfant qui se trompe souvent en calcul a des nombres plus petits", () => {
  const historique = [{ reussites: 4, erreurs: 6 }];

  const adaptation = AdaptationDeLaDifficulte.depuis(historique);

  assertEquals(adaptation.facilite, 0.65);
});

Deno.test("la difficulté ne s'adapte pas avant 6 réponses", () => {
  const historique = [{ reussites: 0, erreurs: 5 }];

  const adaptation = AdaptationDeLaDifficulte.depuis(historique);

  assertEquals(adaptation.facilite, 1);
});

Deno.test("seules les 50 dernières réponses comptent dans l'adaptation de la difficulté", () => {
  const historique = [
    { reussites: 45, erreurs: 5 },
    { reussites: 0, erreurs: 20 },
  ];

  const adaptation = AdaptationDeLaDifficulte.depuis(historique);

  assertEquals(adaptation.facilite, 1);
});

Deno.test("la séance qui dépasse les 50 dernières réponses ne compte que pour la part qui manque", () => {
  const historique = [
    { reussites: 20, erreurs: 20 },
    { reussites: 30, erreurs: 10 },
  ];

  const adaptation = AdaptationDeLaDifficulte.depuis(historique);

  assertEquals(adaptation.facilite, 0.65);
});
