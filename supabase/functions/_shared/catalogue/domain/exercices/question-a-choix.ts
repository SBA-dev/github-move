import { LeconMalFormee } from "../erreurs.ts";
import { enObjet, liste, listeDeTextes, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";

export type QuestionAChoix = Readonly<{
  question: string;
  choix: readonly string[];
  reponse: string;
  aide?: string;
}>;

export type ChoixEtReponse = Readonly<{ choix: readonly string[]; reponse: string }>;

const NOMBRE_MINIMAL_DE_CHOIX = 2;

export function lireQuestionAChoix(brut: unknown): QuestionAChoix {
  const question = enObjet(brut, "une question");
  return Object.freeze({
    question: texteRequis(question.question, "l'énoncé d'une question"),
    ...lireChoixEtReponse(question),
    aide: texteFacultatif(question.aide, "l'aide d'une question"),
  });
}

export function lireQuestionsAChoix(brut: unknown): readonly QuestionAChoix[] {
  const questions = liste(brut, "les questions");
  if (questions.length === 0) throw new LeconMalFormee("l'exercice n'a aucune question à poser");
  return Object.freeze(questions.map(lireQuestionAChoix));
}

export function lireChoixEtReponse(brut: Objet): ChoixEtReponse {
  const choix = Object.freeze([...new Set(listeDeTextes(brut.choix, "les choix"))]);
  const reponse = texteRequis(brut.reponse, "la réponse");
  if (choix.length < NOMBRE_MINIMAL_DE_CHOIX) throw new LeconMalFormee("une question n'a pas deux choix différents");
  if (!choix.includes(reponse)) throw new LeconMalFormee("la réponse n'est pas parmi les choix");
  return { choix, reponse };
}
