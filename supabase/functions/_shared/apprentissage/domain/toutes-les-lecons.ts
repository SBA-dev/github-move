import type { Matiere, Niveau } from "../../catalogue/domain/index.ts";
import { matieresDuParcours, parcoursDeLaMatiere } from "./parcours.ts";
import type { EntreesDuParcours, EtatDansLeParcours, LeconDesClassesDAvant, LeconId } from "./parcours.ts";

export type FiltreDesLecons = Readonly<{ matiere?: Matiere; niveau?: Niveau }>;

export type LeconDeToutesLesLecons = Readonly<{
  lecon: LeconId;
  matiere: Matiere;
  niveau: Niveau;
  titre: string;
  etat: EtatDansLeParcours;
}>;

export type ClasseDAvant = Readonly<{ niveau: Niveau; lecons: readonly LeconDesClassesDAvant[] }>;

export type ToutesLesLecons = Readonly<{
  lecons: readonly LeconDeToutesLesLecons[];
  leconsDesClassesDAvant: readonly ClasseDAvant[];
}>;

export function toutesLesLecons(entrees: EntreesDuParcours, _filtre: FiltreDesLecons): ToutesLesLecons {
  return {
    lecons: matieresDuParcours(entrees).flatMap((matiere) => leconsDeLaMatiere(entrees, matiere)),
    leconsDesClassesDAvant: [],
  };
}

function leconsDeLaMatiere(entrees: EntreesDuParcours, matiere: Matiere): LeconDeToutesLesLecons[] {
  return parcoursDeLaMatiere(entrees, matiere).lecons.map(({ lecon, titre, etat }) => ({
    lecon,
    matiere,
    niveau: entrees.niveau,
    titre,
    etat,
  }));
}
