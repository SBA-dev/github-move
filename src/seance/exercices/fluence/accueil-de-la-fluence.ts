import type { FluenceEnCours } from "@domain/apprentissage";
import { calculsReussis, secondes } from "@domain/motivation";

export function tempsQuiReste(fluence: FluenceEnCours): string {
  return secondes(fluence.tempsRestant);
}

export function scoreDeLaFluence(fluence: FluenceEnCours): string {
  return calculsReussis(fluence.score);
}

const PAS_DE_L_ANNONCE_EN_SECONDES = 15;

function tempsAnnonce({ tempsRestant, finie }: FluenceEnCours): string {
  if (finie) return "Temps écoulé";
  const palier = (Math.ceil(tempsRestant / PAS_DE_L_ANNONCE_EN_SECONDES) - 1) * PAS_DE_L_ANNONCE_EN_SECONDES;
  return palier <= 0
    ? `Il reste moins de ${PAS_DE_L_ANNONCE_EN_SECONDES} secondes`
    : `Il reste plus de ${palier} secondes`;
}

/**
 * Ce que les lecteurs d'écran lisent : le temps qui reste, par paliers de 15 secondes pour ne pas parler à chaque seconde,
 * et le nombre de calculs réussis, qui change à chaque bonne réponse.
 */
export function annonceDeLaFluence(fluence: FluenceEnCours): string {
  return `${tempsAnnonce(fluence)}. ${scoreDeLaFluence(fluence)}.`;
}
