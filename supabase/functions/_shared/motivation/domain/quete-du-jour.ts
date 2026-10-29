import type { FaitsDuJour } from "./objectif-du-jour.ts";

export type LeconDuJourProposee =
  | { genre: "aJouer"; lecon: string; titre: string }
  | { genre: "parcoursFini" }
  | { genre: "aucuneLeconPourTaClasse" }
  | { genre: "inconnue" };

export type PropositionsDuJour = {
  leconDuJour: LeconDuJourProposee;
  nombreDeQuestionsDues: number | undefined;
};

export type QueteDuJour =
  | { genre: "revision"; nombreDeQuestionsDues: number }
  | { genre: "sansQuete" };

export function queteDuJour(
  propositions: PropositionsDuJour,
  _faits: FaitsDuJour,
): QueteDuJour {
  const { leconDuJour, nombreDeQuestionsDues } = propositions;
  if (leconDuJour.genre === "inconnue" || nombreDeQuestionsDues === undefined) {
    return { genre: "sansQuete" };
  }
  if (nombreDeQuestionsDues > 0) {
    return { genre: "revision", nombreDeQuestionsDues };
  }
  return { genre: "sansQuete" };
}
