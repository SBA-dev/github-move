import { assert, assertEquals } from "@std/assert";
import { HasardFixe } from "../test_utils/hasard-fixe.ts";
import { QuestionDuControleParental } from "./question-du-controle-parental.ts";

Deno.test("la question du contrôle parental tire ses deux facteurs entre 6 et 9, indépendamment", () => {
  const hasard = new HasardFixe([7, 8]);

  QuestionDuControleParental.tirer(hasard);

  assertEquals(hasard.tirages, [{ min: 6, max: 9 }, { min: 6, max: 9 }]);
});

Deno.test("la question du contrôle parental s'énonce « combien font 7 × 8 ? »", () => {
  const question = QuestionDuControleParental.tirer(new HasardFixe([7, 8]));

  assertEquals(question.enonce(), "combien font 7 × 8 ?");
});

Deno.test("le produit des deux facteurs est la bonne réponse", () => {
  const question = QuestionDuControleParental.tirer(new HasardFixe([7, 8]));

  assert(question.estBienRepondue("56"));
});

Deno.test("les espaces autour de la réponse sont ignorés", () => {
  const question = QuestionDuControleParental.tirer(new HasardFixe([7, 8]));

  assert(question.estBienRepondue("  56  "));
});

Deno.test("un autre nombre, une saisie vide ou écrite en lettres est une mauvaise réponse", () => {
  const question = QuestionDuControleParental.tirer(new HasardFixe([7, 8]));

  for (const saisie of ["54", "15", "", "cinquante-six"]) {
    assertEquals(question.estBienRepondue(saisie), false, `« ${saisie} »`);
  }
});
