import type { Hasard } from "./hasard.ts";
import type { Humeur } from "./humeur.ts";
import { tirerDans } from "./paroles.ts";

const PHRASES_DE_FIN_DES_ETAPES: readonly string[] = [
  "À toi de jouer maintenant !",
  "C'est parti, à toi !",
  "Prêt ? On joue !",
];

const INTRODUCTIONS_DE_L_EXERCICE: readonly string[] = [
  "Nouveau défi",
  "Jeu suivant",
  "Place au jeu",
];

export type ExerciceAnnonce = {
  readonly titre: string | undefined;
  readonly nombreDExercices: number;
};

export function accueilDeLaLecon(prenom: string): string {
  return `Coucou ${prenom} ! Je t'explique la leçon, et après, on joue. Tu peux aussi choisir directement un jeu.`;
}

export function finDesEtapes(hasard: Hasard): { readonly texte: string; readonly humeur: Humeur } {
  return { texte: tirerDans(PHRASES_DE_FIN_DES_ETAPES, hasard), humeur: "applaudit" };
}

export function annonceDeLExercice(exercice: ExerciceAnnonce, hasard: Hasard): string | undefined {
  if (exercice.nombreDExercices <= 1 || exercice.titre === undefined) return undefined;
  return `${tirerDans(INTRODUCTIONS_DE_L_EXERCICE, hasard)} : ${exercice.titre} !`;
}
