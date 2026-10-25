export const TITRE_DU_DOCK = "Mes écrans";
export const MES_MATIERES = "Mes matières";
export const A_FAIRE_AUJOURD_HUI = "À faire aujourd'hui";
export const MON_PARCOURS = "Mon parcours";
export const ACCUEIL = "Accueil";
export const TOUTES_LES_LECONS = "Toutes les leçons";
export const COMMENCER = "Commencer";
export const PARCOURS_FINI_FELICITATION = "Bravo !";
export const PARCOURS_FINI = "Tu as fini ton parcours";
export const PARCOURS_FINI_ENCOURAGEMENT = "Rejoue tes leçons préférées pour gagner toutes les étoiles.";
export const A_REVOIR = "À revoir";
export const MON_TEST_DE_DEPART = "Mon test de départ";
export const PROPOSITION_DU_TEST_DE_DEPART = "Quelques questions pour commencer au bon endroit";

export function personnageGuideAttend(personnageGuide: string): string {
  return `${personnageGuide} t'attend pour une nouvelle leçon.`;
}

export const TITRE_DE_L_OBJECTIF = "Objectif du jour";
export const OBJECTIF_DU_JOUR = "Joue 2 leçons aujourd'hui";
export const OBJECTIF_ATTEINT = "Objectif atteint, bravo !";

export function avancementDeLObjectif(nombreJoue: number, nombreVise: number): string {
  return `${nombreJoue} sur ${nombreVise}`;
}
