import type { Hasard } from "./hasard.ts";
import type { Humeur } from "./humeur.ts";
import { tirerDans } from "./paroles.ts";

export type InvitationAJouer = { readonly texte: string; readonly humeur: Humeur };

const INVITATIONS_A_JOUER: readonly string[] = [
  "À toi de jouer maintenant !",
  "C'est parti, à toi !",
  "Prêt ? On joue !",
];

const ANNONCES_D_EXERCICE: readonly string[] = [
  "Nouveau défi",
  "Jeu suivant",
  "Place au jeu",
];

export function accueillirSurLaPageDeLaLecon(prenom: string): string {
  return `Coucou ${prenom} ! Je t'explique la leçon, et après, on joue. Tu peux aussi choisir directement un jeu.`;
}

export function inviterAJouerApresLesEtapes(hasard: Hasard): InvitationAJouer {
  return { texte: tirerDans(INVITATIONS_A_JOUER, hasard), humeur: "applaudit" };
}

export function annoncerExerciceSuivant(titre: string, hasard: Hasard): string {
  return `${tirerDans(ANNONCES_D_EXERCICE, hasard)} : ${titre} !`;
}
