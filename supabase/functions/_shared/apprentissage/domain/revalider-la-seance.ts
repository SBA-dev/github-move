import type { Lecon } from "../../catalogue/domain/index.ts";
import {
  BonneReponseAbsenteDesChoix,
  ChoixInconnu,
  EtiquetteDejaPlacee,
  EtiquetteInconnue,
  ExerciceIntrouvable,
  GroupeInconnu,
  JeNeSaisPasDejaDit,
  JeNeSaisPasEnFluence,
  JourIncoherent,
  JourInvalide,
  LeconSansExercice,
  MotIncomplet,
  PasDeQuestionEnCours,
  PasDEtapeDeLeconEnCours,
  QuestionDejaReussie,
  ReponseIncompatible,
  ReponseRangeeSousUneAutreQuestion,
  SeanceDejaFinie,
  SeanceIncoherente,
  SeanceNonFinie,
  TirageEnTrop,
  TirageHorsDuGenerateur,
  TirageInvalide,
  TirageManquant,
} from "./erreurs.ts";
import { jourDeLAppareil } from "./jour-de-l-appareil.ts";
import type { ReponseDonnee } from "./reponse.ts";
import { Seance, type SeanceTerminee } from "./seance.ts";
import type { SeanceTermineeAEnregistrer } from "./seance-terminee-a-enregistrer.ts";

const REPONSES_PAR_SECONDE_AU_PLUS_EN_FLUENCE = 3;
const REPONSES_AU_PLUS_PAR_QUESTION = 200;

const ERREURS_DE_REJEU = [
  BonneReponseAbsenteDesChoix,
  ChoixInconnu,
  EtiquetteDejaPlacee,
  EtiquetteInconnue,
  GroupeInconnu,
  JourIncoherent,
  JourInvalide,
  ExerciceIntrouvable,
  JeNeSaisPasDejaDit,
  JeNeSaisPasEnFluence,
  LeconSansExercice,
  MotIncomplet,
  PasDeQuestionEnCours,
  PasDEtapeDeLeconEnCours,
  QuestionDejaReussie,
  ReponseIncompatible,
  ReponseRangeeSousUneAutreQuestion,
  SeanceDejaFinie,
  SeanceNonFinie,
  TirageEnTrop,
  TirageHorsDuGenerateur,
  TirageInvalide,
  TirageManquant,
];

export function revaliderLaSeance(
  lecon: Lecon,
  envoi: SeanceTermineeAEnregistrer,
): SeanceTerminee {
  try {
    return rejouer(lecon, envoi);
  } catch (erreur) {
    if (ERREURS_DE_REJEU.some((classe) => erreur instanceof classe)) {
      throw new SeanceIncoherente(erreur as Error);
    }
    throw erreur;
  }
}

function rejouer(lecon: Lecon, envoi: SeanceTermineeAEnregistrer): SeanceTerminee {
  const seance = Seance.reconstituer(lecon, envoi);
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  envoi.reponses.forEach((reponsesDeLaQuestion, rang) => {
    const fluence = seance.fluenceEnCours(envoi.termineeLe);
    const estUneFluence = fluence !== undefined;
    const reponsesAuPlus = fluence === undefined
      ? REPONSES_AU_PLUS_PAR_QUESTION
      : fluence.tempsRestant * REPONSES_PAR_SECONDE_AU_PLUS_EN_FLUENCE;
    if (reponsesDeLaQuestion.length > reponsesAuPlus) {
      throw new SeanceIncoherente(new Error(`${reponsesDeLaQuestion.length} réponses à la question ${rang + 1}`));
    }
    if (estUneFluence) seance.demarrerLaFluence(envoi.termineeLe);
    reponsesDeLaQuestion.forEach((reponse) => {
      if (seance.questionEstReussie(rang)) throw new QuestionDejaReussie();
      rejouerLaReponse(seance, reponse, rang, envoi.termineeLe);
    });
    if (estUneFluence) seance.finirLaFluence();
    if (!seance.questionEstReussie(rang)) throw new SeanceNonFinie();
  });
  seance.verifierQueTousLesTiragesOntServi();
  const jour = envoi.jour === undefined ? undefined : jourDeLAppareil(envoi.jour, envoi.termineeLe);
  return seance.terminer(envoi.termineeLe, jour);
}

function rejouerLaReponse(seance: Seance, reponse: ReponseDonnee, rang: number, maintenant: Date): void {
  const etiquetteDeLaQuestion = seance.etiquetteDeClasserALaQuestion(rang);
  if (
    reponse.genre === "placement" && etiquetteDeLaQuestion !== undefined && reponse.etiquette !== etiquetteDeLaQuestion
  ) {
    throw new ReponseRangeeSousUneAutreQuestion(reponse.etiquette);
  }
  if (reponse.genre === "jeNeSaisPas") seance.direJeNeSaisPas(seance.etiquetteDeLaQuestion(rang));
  else seance.repondre(reponse, maintenant);
}
