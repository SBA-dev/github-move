import { Niveau } from "../../catalogue/domain/index.ts";
import type { Matiere } from "../../catalogue/domain/index.ts";
import { ordreDesNiveaux, parOrdrePuisIdentifiant } from "./ordre-des-lecons.ts";
import {
  estReussie,
  etatHorsDuParcours,
  leconsDeLaMatiere as leconsDeLaClasse,
  matieresDuParcours,
  parcoursDeLaMatiere,
  toutesLesLeconsDeLaMatiere,
} from "./parcours.ts";
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
  const matieres = matieresDuParcours(entrees);
  return {
    lecons: [
      ...matieres.flatMap((matiere) => leconsDeLaMatiere(entrees, matiere)),
      ...matieres.filter((matiere) => matiereReussieDuNiveau(entrees, matiere))
        .flatMap((matiere) => leconsDeLaClasseAuDessus(entrees, matiere)),
    ],
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

export function matiereReussieDuNiveau(entrees: EntreesDuParcours, matiere: Matiere): boolean {
  const lecons = leconsDeLaClasse(entrees, matiere);
  return lecons.length > 0 && lecons.every((lecon) => estReussie(entrees, lecon.id));
}

function leconsDeLaClasseAuDessus(entrees: EntreesDuParcours, matiere: Matiere): LeconDeToutesLesLecons[] {
  const classeAuDessus = Niveau.tous().find((niveau) => niveau.estAuDessusDe(entrees.niveau));
  return toutesLesLeconsDeLaMatiere(entrees, matiere)
    .filter((lecon) => classeAuDessus !== undefined && lecon.niveau.valeur === classeAuDessus.valeur)
    .sort((a, b) => ordreDesNiveaux(a, b) || parOrdrePuisIdentifiant(a, b))
    .map((lecon) => ({
      lecon: lecon.id,
      matiere,
      niveau: lecon.niveau,
      titre: lecon.titre,
      etat: etatHorsDuParcours(entrees, lecon.id),
    }));
}
