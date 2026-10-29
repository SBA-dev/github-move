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

export type QueteDuJour = { genre: "sansQuete" };

export function queteDuJour(
  _propositions: PropositionsDuJour,
  _faits: FaitsDuJour,
): QueteDuJour {
  return { genre: "sansQuete" };
}
