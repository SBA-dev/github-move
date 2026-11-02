import {
  BonneReponseAbsenteDesChoix,
  ChoixInconnu,
  JeNeSaisPasDejaDit,
  JourIncoherent,
  JourInvalide,
  MotIncomplet,
  PasDeQuestionEnCours,
  QuestionDejaReussie,
  ReponseIncompatible,
  SeanceDeRevisionNonFinie,
  TirageHorsDuGenerateur,
  TirageInvalide,
  TirageManquant,
} from "./erreurs.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { MotEcrit, ReponseDonnee, ReponseEnNombre, ReponseParChoix } from "./reponse.ts";
import { REPONSES_AU_PLUS_PAR_QUESTION } from "./revalider-la-seance.ts";

type SeanceDeQuestions = {
  repondre(reponse: ReponseParChoix | ReponseEnNombre | MotEcrit): unknown;
  direJeNeSaisPas(): AideDonnee;
  questionEnCours(): { readonly identite: CleDeQuestion } | undefined;
};

type Incoherence = (raison: string) => Error;

const ERREURS_DE_REJEU = [
  BonneReponseAbsenteDesChoix,
  ChoixInconnu,
  JeNeSaisPasDejaDit,
  JourIncoherent,
  JourInvalide,
  MotIncomplet,
  PasDeQuestionEnCours,
  QuestionDejaReussie,
  ReponseIncompatible,
  SeanceDeRevisionNonFinie,
  TirageHorsDuGenerateur,
  TirageInvalide,
  TirageManquant,
];

export function rejouerLaReponse(seance: SeanceDeQuestions, reponse: ReponseDonnee): void {
  if (reponse.genre === "jeNeSaisPas") seance.direJeNeSaisPas();
  else if (reponse.genre === "placement") throw new ReponseIncompatible(reponse.genre);
  else seance.repondre(reponse);
}

/** Rejoue les réponses d'une question ; une réponse donnée alors que la question n'est plus en cours est refusée. */
export function rejouerLesReponsesDeLaQuestion(
  seance: SeanceDeQuestions,
  question: CleDeQuestion,
  reponses: readonly ReponseDonnee[],
  incoherence: Incoherence,
): void {
  if (reponses.length > REPONSES_AU_PLUS_PAR_QUESTION) throw incoherence("trop de réponses à une question");
  for (const reponse of reponses) {
    if (seance.questionEnCours()?.identite.valeur !== question.valeur) {
      throw incoherence("une réponse est donnée après la réussite de la question");
    }
    rejouerLaReponse(seance, reponse);
  }
}

export function verifierUnTirageEtDesReponsesParQuestion(
  envoi: {
    readonly questions: readonly unknown[];
    readonly tirages: readonly unknown[];
    readonly reponses: readonly unknown[];
  },
  incoherence: Incoherence,
): void {
  if (envoi.tirages.length !== envoi.questions.length) throw incoherence("il faut un tirage par question");
  if (envoi.reponses.length !== envoi.questions.length) throw incoherence("il faut une liste de réponses par question");
}

/** Les erreurs du rejeu d'un envoi deviennent l'incohérence de cet envoi ; les autres passent. */
export function enveloppantLesErreursDeRejeu<T>(rejeu: () => T, incoherence: (cause: Error) => Error): T {
  try {
    return rejeu();
  } catch (erreur) {
    if (ERREURS_DE_REJEU.some((classe) => erreur instanceof classe)) throw incoherence(erreur as Error);
    throw erreur;
  }
}
