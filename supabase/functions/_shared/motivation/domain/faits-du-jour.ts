import type { Jour } from "../../apprentissage/domain/jour.ts";
import type { FaitsDuJour } from "./objectif-du-jour.ts";

export type SeanceTermineeDUnJour = { readonly lecon: string; readonly jour: Jour };
export type SeanceDeRevisionTermineeDUnJour = { readonly jour: Jour };

export type SeancesConnues = {
  readonly aujourdhui: Jour;
  readonly seancesTerminees: readonly SeanceTermineeDUnJour[];
  readonly seancesDeRevisionTerminees: readonly SeanceDeRevisionTermineeDUnJour[];
};

export function faitsDuJour(seances: SeancesConnues): FaitsDuJour {
  const estAujourdhui = (seance: { readonly jour: Jour }) => seance.jour.estEgalA(seances.aujourdhui);
  return {
    leconsDesSeancesTermineesDuJour: seances.seancesTerminees.filter(estAujourdhui).map((seance) => seance.lecon),
    nombreDeSeancesDeRevisionTermineesDuJour: seances.seancesDeRevisionTerminees.filter(estAujourdhui).length,
  };
}
