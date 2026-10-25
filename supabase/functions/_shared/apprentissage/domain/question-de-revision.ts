import {
  cleDeLaConjugaison,
  cleDeLAddition,
  cleDeLaDictee,
  cleDeLEcoute,
  cleDesBarres,
  cleDuCalcul,
  cleDuClasser,
  cleDUneQuestionALire,
  cleDuTrou,
} from "./cles-des-questions.ts";
import type { Exercice, Lecon, Niveau } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { questionsDeTrous } from "./exercices/trous.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";
import { cleDeLaBoite, QuestionDeBoite } from "./question-de-boite.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import type { QuestionDeDictee } from "./question-de-dictee.ts";
import { QuestionDeProblemeEnBarres } from "./question-de-probleme-en-barres.ts";
import { questionJoueeDuTrou, questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import {
  questionDeCalculEnLigne,
  questionDeClassement,
  questionDeConjugaison,
  questionDeDictee,
} from "./questions-de-l-exercice.ts";
import { relireUneAdditionDuGenerateur } from "./tirage-d-additions.ts";
import { relireUneOperationDuGenerateur } from "./tirage-d-operations.ts";
import type { Tireur } from "./tireur.ts";

export type QuestionDeRevision =
  | Readonly<{ identite: CleDeQuestion; question: QuestionPosee; dictee?: undefined }>
  | Readonly<{ identite: CleDeQuestion; dictee: QuestionDeDictee; question?: undefined }>;

/** Une question que l'exercice sait poser : sa clé se connaît sans tirage, la question se pose avec le tireur. */
type Posable = Readonly<{ cle: CleDeQuestion; poser: () => QuestionPosee | undefined }>;

/**
 * La question retenue, retrouvée par sa clé dans l'exercice d'où elle vient.
 * Seule cette question est posée avec le tireur : le tirage rejoué est celui d'une seule question.
 */
export function questionDeRevision(
  lecon: Lecon,
  origine: OrigineDeLaQuestion,
  identite: CleDeQuestion,
  tireur: Tireur,
  niveau: Niveau,
): QuestionDeRevision | undefined {
  const exercice = lecon.exercices[origine.position];
  if (!exercice) return undefined;
  if (exercice.type === "dictee") {
    const mot = exercice.mots.find((candidat) => cleDeLaDictee(candidat).valeur === identite.valeur);
    return mot && { identite, dictee: questionDeDictee(exercice, mot, tireur) };
  }
  const question = posables(exercice, origine, tireur, niveau)
    .find((candidat) => candidat.cle.valeur === identite.valeur)?.poser();
  return question && { identite, question };
}

function posables(exercice: Exercice, origine: OrigineDeLaQuestion, tireur: Tireur, niveau: Niveau): Posable[] {
  switch (exercice.type) {
    case "bulles":
    case "lecture":
      return exercice.questions.map((q) => ({
        cle: cleDUneQuestionALire(exercice.type, q),
        poser: () => questionsJoueesAvec({ ...exercice, questions: [q] }, tireur)[0],
      }));
    case "ecoute":
      return exercice.items.map((item) => ({
        cle: cleDeLEcoute(item),
        poser: () => questionsJoueesAvec({ ...exercice, items: [item] }, tireur)[0],
      }));
    case "trous":
      return questionsDeTrous(exercice).map((trou) => ({
        cle: cleDuTrou(trou.enonce),
        poser: () => questionJoueeDuTrou(trou, tireur),
      }));
    case "conjugaison":
      return exercice.formes.map((forme) => ({
        cle: CleDeQuestion.de("conjugaison", cleDeLaConjugaison(exercice, forme.pronom)),
        poser: () => questionDeConjugaison(exercice, forme, tireur),
      }));
    case "classer":
      return exercice.items.map((item) => ({
        cle: cleDuClasser(exercice, item),
        poser: () => questionDeClassement(exercice, item, tireur),
      }));
    case "boite":
      return exercice.items.map((item) => ({
        cle: cleDeLaBoite(item),
        poser: () => QuestionDeBoite.pour(item, tireur, niveau),
      }));
    case "barres":
      return exercice.items.map((probleme) => ({
        cle: cleDesBarres(probleme),
        poser: () => QuestionDeProblemeEnBarres.pour(probleme, tireur, niveau),
      }));
    case "calcul": {
      const tiree = origine.tirage !== undefined && exercice.generateur
        ? relireUneOperationDuGenerateur(exercice.generateur, origine.tirage)
        : undefined;
      return (exercice.operations ?? (tiree ? [tiree] : [])).map((operation) => ({
        cle: cleDuCalcul(operation.q),
        poser: () => QuestionDeCalcul.pour(operation, tireur, niveau),
      }));
    }
    case "addition": {
      const tiree = origine.tirage !== undefined && exercice.generateur
        ? relireUneAdditionDuGenerateur(exercice.generateur, origine.tirage)
        : undefined;
      return (exercice.operations ?? (tiree ? [tiree] : [])).map((addition) => ({
        cle: cleDeLAddition(addition),
        poser: () => questionDeCalculEnLigne(addition, tireur, niveau),
      }));
    }
    default:
      return [];
  }
}
