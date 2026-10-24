import { estUneChanson, type ExerciceMemoriser } from "../../../catalogue/domain/index.ts";

export function annonceDeLEcoute(exercice: ExerciceMemoriser): string {
  const geste = estUneChanson(exercice) ? "chanter" : "redire";
  return `Écoute bien, je te le dis vers par vers. Ensuite, à toi de le ${geste} !`;
}

export function invitationApresLeDernierVers(exercice: ExerciceMemoriser): string {
  const geste = estUneChanson(exercice) ? "Chante" : "Redis";
  return `À toi ! ${geste} tout le texte, tranquillement. Quand c'est bon, on joue !`;
}

export function carteDeLaPoesie(exercice: ExerciceMemoriser): string {
  return exercice.auteur ? `${exercice.titre} — ${exercice.auteur}` : `${exercice.titre}`;
}
