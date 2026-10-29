import type { Matiere, Niveau } from "../../catalogue/domain/index.ts";
import { partiesDuParcours } from "./partie-du-parcours.ts";
import type { LeconId, Parcours } from "./parcours.ts";

export type Defi = Readonly<{ matiere: Matiere; niveau: Niveau; numero: number; lecons: readonly LeconId[] }>;

export function defisDeLaMatiere(parcours: Parcours, matiere: Matiere, niveau: Niveau): Defi[] {
  return partiesDuParcours(parcours)
    .slice(0, -1)
    .map(({ numero, lecons }) => ({ matiere, niveau, numero, lecons }));
}
