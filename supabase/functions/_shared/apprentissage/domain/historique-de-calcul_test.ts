import { assertEquals } from "@std/assert";
import { historiqueDeCalcul } from "./historique-de-calcul.ts";

Deno.test("l'historique de calcul ne compte que les réponses de calcul et de fluence, et ignore les séances sans calcul", () => {
  const parTypeDesSeances = [
    {
      calcul: { reussites: 3, erreurs: 1 },
      fluence: { reussites: 2, erreurs: 2 },
      colonne: { reussites: 4, erreurs: 5 },
    },
    { chiffre: { reussites: 6, erreurs: 0 }, colonne: { reussites: 1, erreurs: 1 } },
    { fluence: { reussites: 5, erreurs: 0 } },
  ];

  const historique = historiqueDeCalcul(parTypeDesSeances);

  assertEquals(historique, [{ reussites: 5, erreurs: 3 }, { reussites: 5, erreurs: 0 }]);
});
