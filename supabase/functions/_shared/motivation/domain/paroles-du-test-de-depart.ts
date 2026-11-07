import { vocatif } from "./vocatif.ts";

function proposition(prenom?: string): string {
  return `Bonjour${
    vocatif(prenom)
  } ! Veux-tu faire un petit jeu de questions ? Ce n'est pas une interrogation : ça m'aide à savoir ce que tu sais déjà, pour commencer au bon endroit. Tu peux dire « Je ne sais pas », c'est permis !`;
}

export function proposerLeTestDeDepart(prenom: string): string {
  return proposition(prenom);
}

export function proposerLeTestDeDepartSansPrenom(): string {
  return proposition();
}

export const CONSIGNE_DU_TEST_DE_DEPART =
  "C'est parti ! Réponds tranquillement. Si tu ne sais pas, touche « Je ne sais pas ».";

function remerciement(leconsCochees: number, prenom?: string): string {
  if (leconsCochees === 0) {
    return `Merci${vocatif(prenom)} ! Maintenant, je sais par où commencer. Ton parcours t'attend !`;
  }
  const connues = leconsCochees === 1 ? "1 leçon : je l'ai cochée" : `${leconsCochees} leçons : je les ai cochées`;
  return `Merci${vocatif(prenom)} ! Tu connais déjà ${connues}. Ton parcours t'attend !`;
}

export function remercierApresLeTestDeDepart(prenom: string, leconsCochees: number): string {
  return remerciement(leconsCochees, prenom);
}

export function remercierApresLeTestDeDepartSansPrenom(leconsCochees: number): string {
  return remerciement(leconsCochees);
}
