import type { Matiere } from "../../catalogue/domain/index.ts";
import { matieresDuParcours, parcoursDeLaMatiere } from "./parcours.ts";
import type { EntreesDuParcours } from "./parcours.ts";

export type TuileDeMatiere = Readonly<{
  matiere: Matiere;
  nombreDeLeconsReussies: number;
  nombreDeLecons: number;
}>;

export function tuilesDeMatiere(entrees: EntreesDuParcours): TuileDeMatiere[] {
  return matieresDuParcours(entrees).map((matiere) => {
    const { nombreDeLeconsReussies, nombreDeLecons } = parcoursDeLaMatiere(entrees, matiere);
    return { matiere, nombreDeLeconsReussies, nombreDeLecons };
  });
}
