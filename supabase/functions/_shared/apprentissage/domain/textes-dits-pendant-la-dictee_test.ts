import { assertArrayIncludes } from "@std/assert";
import { ClavierPropose } from "./clavier-propose.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";
import { QuestionDeDictee } from "./question-de-dictee.ts";
import { textesDitsPendantLaDictee } from "./textes-dits-pendant-la-dictee.ts";

Deno.test("les textes dits pendant une question de dictée, à chaque allure", () => {
  const motDicte = { mot: "chat", phrase: "Le chat dort." };
  const clavier = ClavierPropose.depuisTirage(MotAEcrire.de(motDicte.mot), []);
  const question = new QuestionDeDictee(motDicte, "Écris le mot.", clavier);

  const textesDits = textesDitsPendantLaDictee(question);

  assertArrayIncludes(textesDits.lente, [question.motADire()]);
  assertArrayIncludes(textesDits.normale, [question.texteDit()]);
});

Deno.test("le mot dicté est aussi dit à l'allure normale", () => {
  const motDicte = { mot: "chat", phrase: "Le chat dort." };
  const clavier = ClavierPropose.depuisTirage(MotAEcrire.de(motDicte.mot), []);
  const question = new QuestionDeDictee(motDicte, "Écris le mot.", clavier);

  const textesDits = textesDitsPendantLaDictee(question);

  assertArrayIncludes(textesDits.normale, [question.motADire()]);
});
