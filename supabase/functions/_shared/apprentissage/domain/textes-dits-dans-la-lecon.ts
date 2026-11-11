import type { Exercice, Lecon } from "../../catalogue/domain/index.ts";
import { ClavierPropose } from "./clavier-propose.ts";
import { consigneAffichee } from "./exercices/consigne-affichee.ts";
import { phraseDuCalcul } from "./exercices/phrases-du-calcul.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";
import { QuestionDeDictee } from "./question-de-dictee.ts";

/** Les textes bruts que l'écran fait dire en français, sans doublon, hors calculs tirés au hasard. */
export function textesDitsDansLaLecon(lecon: Lecon): readonly string[] {
  const textes = lecon.exercices.flatMap((exercice) => [consigneAffichee(exercice), ...textesDeLExercice(exercice)]);
  return [...new Set(textes.filter((texte) => texte !== undefined))];
}

function textesDeLExercice(exercice: Exercice): string[] {
  switch (exercice.type) {
    case "bulles":
    case "lecture":
      return exercice.questions.map(({ question }) => question);
    case "dictee":
      return exercice.mots.map((mot) => texteDitDeLaDictee(mot, exercice.consigne));
    case "calcul":
      return (exercice.operations ?? []).map(phraseDuCalcul);
    default:
      return [];
  }
}

function texteDitDeLaDictee(mot: Extract<Exercice, { type: "dictee" }>["mots"][number], consigne: string): string {
  const clavier = ClavierPropose.depuisTirage(MotAEcrire.de(mot.mot), []);
  return new QuestionDeDictee(mot, consigne, clavier).texteDit();
}
