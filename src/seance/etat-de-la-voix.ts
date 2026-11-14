import { type EtatDeLaVoix, textesDitsPendantLaDictee, type QuestionDeDictee } from "@domain/apprentissage";
import type { Voix } from "../voix/index.ts";

/** La dictée dit le mot à l'allure normale, puis lentement : la voix n'est présente que si les deux sont possibles. */
export function etatDeLaVoixPourLaDictee(
  { son, peutDire }: Pick<Voix, "son" | "peutDire">,
  question: QuestionDeDictee,
): EtatDeLaVoix {
  const textes = textesDitsPendantLaDictee(question);
  if (!peutDire(textes.normale, "normale") || !peutDire(textes.lente, "lente")) return "lectureImpossible";
  return son === "muet" ? "muet" : "disponible";
}
