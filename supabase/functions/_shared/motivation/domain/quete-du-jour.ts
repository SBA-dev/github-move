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
  | { genre: "lecon"; lecon: string; titre: string }
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
  if (leconDuJour.genre === "aJouer") {
    return {
      genre: "lecon",
      lecon: leconDuJour.lecon,
      titre: leconDuJour.titre,
    };
  }
  return { genre: "sansQuete" };
}
