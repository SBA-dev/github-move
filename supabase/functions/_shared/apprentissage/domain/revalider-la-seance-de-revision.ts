import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
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
  SeanceDeRevisionIncoherente,
  SeanceDeRevisionNonFinie,
  TirageHorsDuGenerateur,
  TirageInvalide,
  TirageManquant,
} from "./erreurs.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { FileDeRevision, QuestionRetenue } from "./file-de-revision.ts";
import { questionDeRevision } from "./question-de-revision.ts";
import type { Jour } from "./jour.ts";
import { jourDeLAppareil } from "./jour-de-l-appareil.ts";
import { rejouerLaReponse } from "./rejouer-la-reponse.ts";
import { REPONSES_AU_PLUS_PAR_QUESTION } from "./revalider-la-seance.ts";
import { SeanceDeRevision, type SeanceDeRevisionTerminee, seanceDeRevisionTerminee } from "./seance-de-revision.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "./seance-de-revision-terminee-a-enregistrer.ts";
import { tireurDeLaQuestionEnvoyee } from "./tireur.ts";

const NOMBRE_MAXIMAL_DE_QUESTIONS = 10;

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

export type SeanceDeRevisionRevalidee = {
  readonly fait: SeanceDeRevisionTerminee;
  /** Dues mais que la bibliothèque ne sait plus poser : le cas d'usage les oublie de la file. */
  readonly questionsIntrouvables: readonly CleDeQuestion[];
};

export function revaliderLaSeanceDeRevision(
  envoi: SeanceDeRevisionTermineeAEnregistrer,
  file: FileDeRevision,
  lecons: readonly Lecon[],
  niveau: Niveau,
): SeanceDeRevisionRevalidee {
  try {
    return rejouer(envoi, file, lecons, niveau);
  } catch (erreur) {
    if (ERREURS_DE_REJEU.some((classe) => erreur instanceof classe)) {
      throw new SeanceDeRevisionIncoherente(erreur as Error);
    }
    throw erreur;
  }
}

function rejouer(
  envoi: SeanceDeRevisionTermineeAEnregistrer,
  file: FileDeRevision,
  lecons: readonly Lecon[],
  niveau: Niveau,
): SeanceDeRevisionRevalidee {
  verifierLaForme(envoi);
  const jour = jourDeLAppareil(envoi.jour, envoi.termineeLe);
  const { rejouables, introuvables: questionsIntrouvables } = trier(envoi, file, jour, lecons, niveau);
  if (rejouables.length === 0) {
    return { fait: seanceDeRevisionTerminee({ ...envoi, jour, resultats: [] }), questionsIntrouvables };
  }
  const seance = SeanceDeRevision.commencer({
    id: envoi.id,
    enfant: envoi.enfant,
    plan: { questions: rejouables.map(({ retenue }) => retenue) },
    lecons,
    tireurDe: (identite) => tireurDeLaQuestionEnvoyee(envoi, identite),
    niveau,
  });
  rejouables.forEach(({ rang, retenue: { identite } }) => {
    const reponses = envoi.reponses[rang] ?? [];
    if (reponses.length > REPONSES_AU_PLUS_PAR_QUESTION) throw incoherente("trop de réponses à une question");
    reponses.forEach((reponse) => {
      if (seance.questionEnCours()?.identite.valeur !== identite.valeur) {
        throw incoherente("une réponse est donnée après la réussite de la question");
      }
      rejouerLaReponse(seance, reponse);
    });
    if (seance.questionEnCours()?.identite.valeur === identite.valeur) {
      throw incoherente("une question posée ne finit pas par la bonne réponse");
    }
  });
  return { fait: seance.terminer(envoi.termineeLe, jour), questionsIntrouvables };
}

type QuestionRejouable = { readonly rang: number; readonly retenue: QuestionRetenue };

/** Parmi les questions de l'envoi : celles à rejouer, et celles dues mais que la bibliothèque ne sait plus poser. */
function trier(
  envoi: SeanceDeRevisionTermineeAEnregistrer,
  file: FileDeRevision,
  jour: Jour,
  lecons: readonly Lecon[],
  niveau: Niveau,
): { rejouables: QuestionRejouable[]; introuvables: CleDeQuestion[] } {
  const dues = file.questionsDues(jour);
  const rejouables: QuestionRejouable[] = [];
  const introuvables: CleDeQuestion[] = [];
  envoi.questions.forEach((cle, rang) => {
    const retenue = dues.find(({ identite }) => identite.valeur === cle.valeur);
    if (!retenue) return;
    if (estPosable(retenue, envoi, lecons, niveau)) rejouables.push({ rang, retenue });
    else introuvables.push(cle);
  });
  return { rejouables, introuvables };
}

function estPosable(
  { identite, origine }: QuestionRetenue,
  envoi: SeanceDeRevisionTermineeAEnregistrer,
  lecons: readonly Lecon[],
  niveau: Niveau,
): boolean {
  const lecon = lecons.find(({ id }) => id === origine.leconDOrigine);
  return lecon !== undefined &&
    questionDeRevision(lecon, origine, identite, tireurDeLaQuestionEnvoyee(envoi, identite), niveau) !== undefined;
}

function verifierLaForme(envoi: SeanceDeRevisionTermineeAEnregistrer): void {
  const { questions, tirages, reponses } = envoi;
  if (questions.length > NOMBRE_MAXIMAL_DE_QUESTIONS) throw incoherente("trop de questions");
  if (new Set(questions.map(({ valeur }) => valeur)).size !== questions.length) {
    throw incoherente("une question est posée deux fois");
  }
  if (tirages.length !== questions.length) throw incoherente("il faut un tirage par question");
  if (reponses.length !== questions.length) throw incoherente("il faut une liste de réponses par question");
}

function incoherente(raison: string): SeanceDeRevisionIncoherente {
  return new SeanceDeRevisionIncoherente(new Error(raison));
}
