import type { Lecon, PassageDuGuideFondamental, ProgrammeCite } from "./lecon.ts";
import { libelleDeLaMatiere } from "./matiere.ts";
import { libelleDuType } from "./type-d-exercice.ts";

export type ExercicePropose = {
  readonly position: number;
  readonly titre: string;
  readonly libelleDuType: string;
};

export type PassagePourLesAdultes = {
  readonly programme: ProgrammeCite;
  readonly guideFondamental?: PassageDuGuideFondamental;
};

export type PageDeLaLecon = {
  readonly titre: string;
  readonly niveauEtMatiere: string;
  readonly exercices: ReadonlyArray<ExercicePropose>;
  readonly passagePourLesAdultes: PassagePourLesAdultes;
};

export function pageDeLaLecon(lecon: Lecon): PageDeLaLecon {
  return {
    titre: lecon.titre,
    niveauEtMatiere: `${lecon.niveau} · ${libelleDeLaMatiere(lecon.matiere)}`,
    exercices: lecon.exercices.map((exercice, position) => ({
      position,
      titre: exercice.titre ?? libelleDuType(exercice.type),
      libelleDuType: libelleDuType(exercice.type),
    })),
    passagePourLesAdultes: { programme: lecon.programme, guideFondamental: lecon.guide },
  };
}
