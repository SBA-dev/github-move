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
  | { genre: "accomplie"; quete: "revision" | "lecon" }
  | { genre: "aucune" }
  | { genre: "sansQuete" };

export function queteDuJour(
  propositions: PropositionsDuJour,
  faits: FaitsDuJour,
): QueteDuJour {
  const { leconDuJour, nombreDeQuestionsDues } = propositions;
  if (leconDuJour.genre === "inconnue" || nombreDeQuestionsDues === undefined) {
    return { genre: "sansQuete" };
  }
  if (faits.nombreDeSeancesDeRevisionTermineesDuJour > 0) {
    return { genre: "accomplie", quete: "revision" };
  }
  if (nombreDeQuestionsDues > 0) {
    return { genre: "revision", nombreDeQuestionsDues };
  }
  if (leconDuJour.genre === "aucuneLeconPourTaClasse") {
    return { genre: "sansQuete" };
  }
  if (faits.leconsDesSeancesTermineesDuJour.length > 0) {
    return { genre: "accomplie", quete: "lecon" };
  }
  if (leconDuJour.genre === "aJouer") {
    return {
      genre: "lecon",
      lecon: leconDuJour.lecon,
      titre: leconDuJour.titre,
    };
  }
  if (leconDuJour.genre === "parcoursFini") {
    return { genre: "aucune" };
  }
  return { genre: "sansQuete" };
}
