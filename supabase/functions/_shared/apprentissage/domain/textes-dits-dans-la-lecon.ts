import type {
  Exercice,
  ExerciceBulles,
  ExerciceLecture,
  ExerciceMemoriser,
  ExerciceTrous,
  ItemDEcoute,
  Lecon,
  MotDicte,
} from "../../catalogue/domain/index.ts";
import { ClavierPropose } from "./clavier-propose.ts";
import { texteALireDeLEtape } from "./etape-de-lecon-lue.ts";
import { consigneAffichee } from "./exercices/consigne-affichee.ts";
import { questionsDeConjugaison } from "./exercices/conjugaison.ts";
import { indicationDuGeste } from "./exercices/indication-du-geste.ts";
import { annonceDeLEcoute, invitationApresLeDernierVers } from "./exercices/paroles-de-la-poesie.ts";
import { aideParDefaut, explicationDeLaReponse, questionDeLEcoute } from "./exercices/phrases-des-exercices-a-choix.ts";
import { phraseDuCalcul } from "./exercices/phrases-du-calcul.ts";
import { questionsDeTrous } from "./exercices/trous.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";
import { PlanDeMemorisation } from "./plan-de-memorisation.ts";
import { AIDE_APRES_UNE_ERREUR, QuestionDeDictee } from "./question-de-dictee.ts";

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
    case "lecture":
      return textesDesQuestionsAChoix(exercice);
    case "dictee":
      return exercice.mots.flatMap((mot) => textesDeLaDictee(mot, exercice.consigne));
    case "calcul":
      return (exercice.operations ?? []).map(phraseDuCalcul);
    case "ecoute":
      return exercice.items.flatMap((item) => textesDeLEcoute(item));
    case "trous":
      return textesDesTrous(exercice);
    case "conjugaison":
      return questionsDeConjugaison(exercice).flatMap(({ enonce, aide }) => [enonce, aide]);
    case "memoriser":
      return textesDeLaPoesie(exercice);
    default:
      return [];
  }
}

function textesDesQuestionsAChoix(exercice: ExerciceBulles | ExerciceLecture): string[] {
  const texteDeLecture = exercice.type === "lecture" ? [exercice.texte] : [];
  return [
    ...texteDeLecture,
    ...exercice.questions.flatMap(({ question, aide }) => [question, aide ?? aideParDefaut(exercice.type)]),
  ];
}

function textesDeLEcoute(item: ItemDEcoute): string[] {
  const felicitation = explicationDeLaReponse("ecoute", item)?.morceaux.at(-1)?.texte;
  return [questionDeLEcoute(item), item.aide ?? aideParDefaut("ecoute"), ...(felicitation ? [felicitation] : [])];
}

function textesDesTrous(exercice: ExerciceTrous): string[] {
  return [...questionsDeTrous(exercice).map(({ enonce }) => enonce), aideParDefaut("trous")];
}

function textesDeLaPoesie(exercice: ExerciceMemoriser): string[] {
  const plan = PlanDeMemorisation.de(exercice);
  return [
    annonceDeLEcoute(exercice),
    ...exercice.vers,
    invitationApresLeDernierVers(exercice),
    plan.ordreDesVers.consigne,
    plan.motsCaches.consigne,
  ].filter((texte) => texte !== undefined);
}

function textesDeLaDictee(mot: MotDicte, consigne: string): string[] {
  const clavier = ClavierPropose.depuisTirage(MotAEcrire.de(mot.mot), []);
  const question = new QuestionDeDictee(mot, consigne, clavier);
  return [question.texteDit(), question.suiteDeLaFelicitation(), AIDE_APRES_UNE_ERREUR];
}
