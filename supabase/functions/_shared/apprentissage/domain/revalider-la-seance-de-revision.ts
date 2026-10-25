import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import {
  JourInvalide,
  ReponseIncompatible,
  SeanceDeRevisionIncoherente,
  SeanceDeRevisionNonFinie,
  TirageInvalide,
  TirageManquant,
} from "./erreurs.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { FileDeRevision, QuestionRetenue } from "./file-de-revision.ts";
import { questionDeRevision } from "./question-de-revision.ts";
import { Jour, jourDe } from "./jour.ts";
import type { ReponseDonnee } from "./reponse.ts";
import { SeanceDeRevision, type SeanceDeRevisionTerminee, seanceDeRevisionTerminee } from "./seance-de-revision.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "./seance-de-revision-terminee-a-enregistrer.ts";
import { type Tireur, tireurSelonLesTirages } from "./tireur.ts";

const NOMBRE_MAXIMAL_DE_QUESTIONS = 10;
const DECALAGE_UTC_MAXIMAL_A_L_OUEST_EN_MINUTES = 12 * 60;
const DECALAGE_UTC_MAXIMAL_A_L_EST_EN_MINUTES = -14 * 60;

const ERREURS_DE_REJEU = [JourInvalide, ReponseIncompatible, SeanceDeRevisionNonFinie, TirageInvalide, TirageManquant];

export function revaliderLaSeanceDeRevision(
  envoi: SeanceDeRevisionTermineeAEnregistrer,
  file: FileDeRevision,
  lecons: readonly Lecon[],
  niveau: Niveau,
): SeanceDeRevisionTerminee {
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
): SeanceDeRevisionTerminee {
  verifierLaForme(envoi);
  const jour = Jour.de(envoi.jour);
  verifierLeJour(jour, envoi.termineeLe);
  const { rejouables } = trier(envoi, file, jour, lecons, niveau);
  if (rejouables.length === 0) return seanceDeRevisionTerminee({ ...envoi, jour, resultats: [] });
  const seance = SeanceDeRevision.commencer({
    id: envoi.id,
    enfant: envoi.enfant,
    plan: { questions: rejouables.map(({ retenue }) => retenue) },
    lecons,
    tireurDe: (identite) => tireurDeLaQuestion(envoi, identite),
    niveau,
  });
  rejouables.forEach(({ rang, retenue: { identite } }) => {
    envoi.reponses[rang]?.forEach((reponse) => {
      if (seance.questionEnCours()?.identite.valeur !== identite.valeur) {
        throw incoherente("une réponse est donnée après la réussite de la question");
      }
      rejouerLaReponse(seance, reponse);
    });
    if (seance.questionEnCours()?.identite.valeur === identite.valeur) {
      throw incoherente("une question posée ne finit pas par la bonne réponse");
    }
  });
  return seance.terminer(envoi.termineeLe, jour);
}

export function questionsIntrouvablesDeLaSeanceDeRevision(
  envoi: SeanceDeRevisionTermineeAEnregistrer,
  file: FileDeRevision,
  lecons: readonly Lecon[],
  niveau: Niveau,
): CleDeQuestion[] {
  return trier(envoi, file, Jour.de(envoi.jour), lecons, niveau).introuvables;
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
    questionDeRevision(lecon, origine, identite, tireurDeLaQuestion(envoi, identite), niveau) !== undefined;
}

function tireurDeLaQuestion(envoi: SeanceDeRevisionTermineeAEnregistrer, identite: CleDeQuestion): Tireur {
  const rang = envoi.questions.findIndex(({ valeur }) => valeur === identite.valeur);
  return tireurSelonLesTirages([envoi.tirages[rang] ?? []].values());
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

function verifierLeJour(jour: Jour, termineeLe: Date): void {
  const lePlusTot = jourDe(termineeLe, DECALAGE_UTC_MAXIMAL_A_L_OUEST_EN_MINUTES);
  const lePlusTard = jourDe(termineeLe, DECALAGE_UTC_MAXIMAL_A_L_EST_EN_MINUTES);
  if (!lePlusTot.estAvantOuEgal(jour) || !jour.estAvantOuEgal(lePlusTard)) {
    throw incoherente("le jour ne correspond pas à la date de fin");
  }
}

function rejouerLaReponse(seance: SeanceDeRevision, reponse: ReponseDonnee): void {
  if (reponse.genre === "jeNeSaisPas") seance.direJeNeSaisPas();
  else if (reponse.genre === "placement") throw new ReponseIncompatible(reponse.genre);
  else seance.repondre(reponse);
}

function incoherente(raison: string): SeanceDeRevisionIncoherente {
  return new SeanceDeRevisionIncoherente(new Error(raison));
}
