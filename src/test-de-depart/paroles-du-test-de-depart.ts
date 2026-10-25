export function proposerLeTestDeDepart(prenom: string): string {
  return `Bonjour ${prenom} ! Veux-tu faire un petit jeu de questions ? Ce n'est pas une interrogation : ça m'aide à savoir ce que tu sais déjà, pour commencer au bon endroit. Tu peux dire « Je ne sais pas », c'est permis !`;
}

export const CONSIGNE_DU_TEST_DE_DEPART = "C'est parti ! Réponds tranquillement. Si tu ne sais pas, touche « Je ne sais pas ».";

export function remercierApresLeTestDeDepart(prenom: string, leconsCochees: number): string {
  if (leconsCochees === 0) return `Merci ${prenom} ! Maintenant, je sais par où commencer. Ton parcours t'attend !`;
  const connues = leconsCochees === 1 ? "1 leçon : je l'ai cochée" : `${leconsCochees} leçons : je les ai cochées`;
  return `Merci ${prenom} ! Tu connais déjà ${connues}. Ton parcours t'attend !`;
}
