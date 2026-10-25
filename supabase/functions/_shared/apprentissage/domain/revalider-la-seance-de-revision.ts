import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import {
  JourInvalide,
  ReponseIncompatible,
  SeanceDeRevisionIncoherente,
  SeanceDeRevisionNonFinie,
  TirageInvalide,
  TirageManquant,
} from "./erreurs.ts";
import type { FileDeRevision } from "./file-de-revision.ts";
import { Jour, jourDe } from "./jour.ts";
import type { ReponseDonnee } from "./reponse.ts";
import { SeanceDeRevision, type SeanceDeRevisionTerminee } from "./seance-de-revision.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "./seance-de-revision-terminee-a-enregistrer.ts";
import { tireurSelonLesTirages } from "./tireur.ts";

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
  const seance = SeanceDeRevision.commencer({
    id: envoi.id,
    enfant: envoi.enfant,
    plan: {
      questions: envoi.questions.flatMap((cle) =>
        file.questions.filter(({ identite }) => identite.valeur === cle.valeur)
      ),
    },
    lecons,
    tireurDe: (identite) => {
      const rang = envoi.questions.findIndex(({ valeur }) => valeur === identite.valeur);
      return tireurSelonLesTirages([envoi.tirages[rang] ?? []].values());
    },
    niveau,
  });
  envoi.questions.forEach(({ valeur }, rang) => {
    (envoi.reponses[rang] ?? []).forEach((reponse) => {
      if (seance.questionEnCours()?.identite.valeur !== valeur) {
        throw incoherente("une réponse est donnée après la réussite de la question");
      }
      rejouerLaReponse(seance, reponse);
    });
    if (seance.questionEnCours()?.identite.valeur === valeur) {
      throw incoherente("une question posée ne finit pas par la bonne réponse");
    }
  });
  return seance.terminer(envoi.termineeLe, jour);
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
