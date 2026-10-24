import { assert, assertEquals } from "@std/assert";
import { leconDeDicteeAvecSaPropreConsigne, seanceDeDictee } from "../../test_utils/lecons-de-dictee.ts";

Deno.test("une dictée qui définit sa propre consigne l'affiche à la place de la consigne par défaut", () => {
  const seance = seanceDeDictee(leconDeDicteeAvecSaPropreConsigne("Écris le nom de l'animal que tu entends."));

  const question = seance.questionDeDicteeEnCours();

  assert(question);
  assertEquals(question.texteAffiche(), "Écris le nom de l'animal que tu entends.");
});
