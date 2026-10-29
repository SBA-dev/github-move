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
  const aFaitUneRevisionAujourdhui = faits.nombreDeSeancesDeRevisionTermineesDuJour > 0;
  if (aFaitUneRevisionAujourdhui || nombreDeQuestionsDues > 0) {
    return aFaitUneRevisionAujourdhui
      ? { genre: "accomplie", quete: "revision" }
      : { genre: "revision", nombreDeQuestionsDues };
  }
  return queteDeLecon(leconDuJour, faits);
}

function queteDeLecon(
  leconDuJour: Exclude<LeconDuJourProposee, { genre: "inconnue" }>,
  faits: FaitsDuJour,
): QueteDuJour {
  if (leconDuJour.genre === "aucuneLeconPourTaClasse") {
    return { genre: "sansQuete" };
  }
  if (faits.leconsDesSeancesTermineesDuJour.length > 0) {
    return { genre: "accomplie", quete: "lecon" };
  }
  if (leconDuJour.genre === "parcoursFini") {
    return { genre: "aucune" };
  }
  return { genre: "lecon", lecon: leconDuJour.lecon, titre: leconDuJour.titre };
}

export function queteAccomplieParLaSeance(
  avant: QueteDuJour,
  apres: QueteDuJour,
): boolean {
  return avant.genre !== "accomplie" && apres.genre === "accomplie";
}
