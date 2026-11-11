import type { Exercice, Lecon } from "../../catalogue/domain/index.ts";
import { ClavierPropose } from "./clavier-propose.ts";
import { texteALireDeLEtape } from "./etape-de-lecon-lue.ts";
import { consigneAffichee } from "./exercices/consigne-affichee.ts";
import { questionsDeConjugaison } from "./exercices/conjugaison.ts";
import { indicationDuGeste } from "./exercices/indication-du-geste.ts";
import { questionDeLEcoute } from "./exercices/phrases-des-exercices-a-choix.ts";
import { phraseDuCalcul } from "./exercices/phrases-du-calcul.ts";
import { questionsDeTrous } from "./exercices/trous.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";
import { QuestionDeDictee } from "./question-de-dictee.ts";

/** Les textes bruts que l'écran fait dire en français, sans doublon, hors calculs tirés au hasard. */
export function textesDitsDansLaLecon(lecon: Lecon): readonly string[] {
  const textes = [
    ...lecon.etapes.map(texteDeLEtape),
    ...lecon.exercices.flatMap((exercice) => [
      consigneAffichee(exercice),
      indicationDuGeste(exercice.type),
      ...textesDeLExercice(exercice),
    ]),
  ];
  return [...new Set(textes.filter((texte) => texte !== undefined))];
}

function texteDeLEtape(etape: Lecon["etapes"][number]): string {
  return texteALireDeLEtape(etape).join(" ");
}

function textesDeLExercice(exercice: Exercice): string[] {
  switch (exercice.type) {
    case "bulles":
      return exercice.questions.map(({ question }) => question);
    case "lecture":
      return [exercice.texte, ...exercice.questions.map(({ question }) => question)];
    case "dictee":
      return exercice.mots.map((mot) => texteDitDeLaDictee(mot, exercice.consigne));
    case "calcul":
      return (exercice.operations ?? []).map(phraseDuCalcul);
    case "ecoute":
      return exercice.items.map(questionDeLEcoute);
    case "trous":
      return questionsDeTrous(exercice).map(({ enonce }) => enonce);
    case "conjugaison":
      return questionsDeConjugaison(exercice).map(({ enonce }) => enonce);
    case "memoriser":
      return [...exercice.vers];
    default:
      return [];
  }
}

function texteDitDeLaDictee(mot: Extract<Exercice, { type: "dictee" }>["mots"][number], consigne: string): string {
  const clavier = ClavierPropose.depuisTirage(MotAEcrire.de(mot.mot), []);
  return new QuestionDeDictee(mot, consigne, clavier).texteDit();
}
