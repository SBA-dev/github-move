import type { Lecon } from "../../catalogue/domain/index.ts";
import {
  BonneReponseAbsenteDesChoix,
  ChoixInconnu,
  EtiquetteInconnue,
  ExerciceIntrouvable,
  GroupeInconnu,
  JeNeSaisPasDejaDit,
  LeconSansExercice,
  PasDeQuestionEnCours,
  PasDEtapeDeLeconEnCours,
  QuestionDejaReussie,
  SeanceDejaFinie,
  SeanceIncoherente,
  SeanceNonFinie,
  TirageEnTrop,
  TirageInvalide,
  TirageManquant,
} from "./erreurs.ts";
import type { ReponseDonnee } from "./reponse.ts";
import { Seance, type SeanceTerminee } from "./seance.ts";
import type { SeanceTermineeAEnregistrer } from "./seance-terminee-a-enregistrer.ts";

const ERREURS_DE_REJEU = [
  BonneReponseAbsenteDesChoix,
  ChoixInconnu,
  EtiquetteInconnue,
  GroupeInconnu,
  ExerciceIntrouvable,
  JeNeSaisPasDejaDit,
  LeconSansExercice,
  PasDeQuestionEnCours,
  PasDEtapeDeLeconEnCours,
  QuestionDejaReussie,
  SeanceDejaFinie,
  SeanceNonFinie,
  TirageEnTrop,
  TirageInvalide,
  TirageManquant,
];

export function revaliderLaSeance(lecon: Lecon, envoi: SeanceTermineeAEnregistrer): SeanceTerminee {
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
    reponsesDeLaQuestion.forEach((reponse) => {
      if (seance.questionEstReussie(rang)) throw new QuestionDejaReussie();
      rejouerLaReponse(seance, reponse);
    });
    if (!seance.questionEstReussie(rang)) throw new SeanceNonFinie();
  });
  return seance.terminer(envoi.termineeLe);
}

function rejouerLaReponse(seance: Seance, reponse: ReponseDonnee): void {
  if (reponse.genre === "jeNeSaisPas") seance.direJeNeSaisPas();
  else seance.repondre(reponse);
}
