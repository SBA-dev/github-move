export { Avancement } from "./avancement.ts";
export { ExerciceJoue } from "./exercice-joue.ts";
export type { SegmentDuTexteATrous } from "./exercice-joue.ts";
export { nombreDeQuestions } from "./nombre-de-questions.ts";
export { CleDeQuestion } from "./cle-de-question.ts";
export { ChoixDeSeance } from "./choix-de-seance.ts";
export { ChoixProposes } from "./choix-proposes.ts";
export {
  BonneReponseAbsenteDesChoix,
  ChoixInconnu,
  EtiquetteInconnue,
  ExerciceIntrouvable,
  GroupeInconnu,
  JeNeSaisPasDejaDit,
  LeconIntrouvable,
  LeconSansExercice,
  ParentNonRattache,
  PasDeQuestionEnCours,
  PasDEtapeDeLeconEnCours,
  QuestionDejaReussie,
  SeanceDejaFinie,
  SeanceDejaTerminee,
  SeanceIncoherente,
  SeanceNonFinie,
} from "./erreurs.ts";
export { texteALireDeLEtape } from "./etape-de-lecon-lue.ts";
export { lectureDesChoix } from "./lecture-des-choix.ts";
export {
  explicationDeLaReponse,
  INTRODUCTION_DE_LA_LECTURE,
  MESSAGE_DE_L_ECOUTE_SANS_SON,
  questionDeLEcoute,
} from "./exercices/phrases-des-exercices-a-choix.ts";
export type { GenerateurId } from "./generateur-id.ts";
export type { Hasard } from "./hasard.ts";
export { QuestionJouee } from "./question-jouee.ts";
export type { AideDonnee } from "./question-jouee.ts";
export { Reponse } from "./reponse.ts";
export type { Placement, ReponseDonnee, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
export { PlanDeSeance } from "./plan-de-seance.ts";
export { Seance } from "./seance.ts";
export type { FaitDeSeance, QuestionRatee, ReussitesEtErreurs, SeanceTerminee } from "./seance.ts";
export type { SeanceTermineeAEnregistrer } from "./seance-terminee-a-enregistrer.ts";
export { Etoiles } from "./etoiles.ts";
export type { NombreDEtoiles } from "./etoiles.ts";
export { SeanceId } from "./seance-id.ts";
export { ResultatDeLaLecon } from "./resultat-de-la-lecon.ts";
export type { EtatDuResultat, FaitDeResultat } from "./resultat-de-la-lecon.ts";
export { revaliderLaSeance } from "./revalider-la-seance.ts";
