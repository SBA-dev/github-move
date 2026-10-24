import type { Lecon, Matiere, Niveau } from "../../catalogue/domain/index.ts";
import type { Etoiles } from "./etoiles.ts";

export type LeconId = string;

export type EntreesDuParcours = Readonly<{
  lecons: readonly Lecon[];
  niveau: Niveau;
  meilleuresEtoiles: ReadonlyMap<LeconId, Etoiles>;
}>;

export type LeconDuParcours = Readonly<{ lecon: LeconId; place: number }>;

export type Parcours = Readonly<{ lecons: readonly LeconDuParcours[] }>;

export function parcoursDeLaMatiere(entrees: EntreesDuParcours, matiere: Matiere): Parcours {
  const lecons = entrees.lecons
    .filter((lecon) => lecon.matiere.code === matiere.code && lecon.niveau.valeur === entrees.niveau.valeur)
    .sort(parOrdrePuisIdentifiant)
    .map((lecon, index) => ({ lecon: lecon.id, place: index + 1 }));
  return { lecons };
}

function parOrdrePuisIdentifiant(a: Lecon, b: Lecon): number {
  return a.ordre - b.ordre || a.id.localeCompare(b.id);
}
