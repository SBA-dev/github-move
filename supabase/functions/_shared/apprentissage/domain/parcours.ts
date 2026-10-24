import type { Lecon, Matiere, Niveau } from "../../catalogue/domain/index.ts";
import type { Etoiles } from "./etoiles.ts";

export type LeconId = string;

export type EntreesDuParcours = Readonly<{
  lecons: readonly Lecon[];
  niveau: Niveau;
  meilleuresEtoiles: ReadonlyMap<LeconId, Etoiles>;
}>;

export type EtatDansLeParcours =
  | { genre: "reussie"; etoiles: Etoiles }
  | { genre: "prochaine" }
  | { genre: "aDecouvrir" };

export type LeconDuParcours = Readonly<{ lecon: LeconId; place: number; etat: EtatDansLeParcours }>;

export type Parcours = Readonly<{ lecons: readonly LeconDuParcours[]; prochaineLecon: LeconId | undefined }>;

export function parcoursDeLaMatiere(entrees: EntreesDuParcours, matiere: Matiere): Parcours {
  const ordonnees = entrees.lecons
    .filter((lecon) => lecon.matiere.code === matiere.code && lecon.niveau.valeur === entrees.niveau.valeur)
    .sort(parOrdrePuisIdentifiant);
  const prochaineLecon = ordonnees.find((lecon) => !entrees.meilleuresEtoiles.has(lecon.id))?.id;
  const lecons = ordonnees.map((lecon, index) => ({
    lecon: lecon.id,
    place: index + 1,
    etat: etatDeLaLecon(lecon.id, entrees.meilleuresEtoiles, prochaineLecon),
  }));
  return { lecons, prochaineLecon };
}

function etatDeLaLecon(
  lecon: LeconId,
  meilleuresEtoiles: ReadonlyMap<LeconId, Etoiles>,
  prochaineLecon: LeconId | undefined,
): EtatDansLeParcours {
  const etoiles = meilleuresEtoiles.get(lecon);
  if (etoiles) return { genre: "reussie", etoiles };
  return lecon === prochaineLecon ? { genre: "prochaine" } : { genre: "aDecouvrir" };
}

function parOrdrePuisIdentifiant(a: Lecon, b: Lecon): number {
  return a.ordre - b.ordre || a.id.localeCompare(b.id);
}
