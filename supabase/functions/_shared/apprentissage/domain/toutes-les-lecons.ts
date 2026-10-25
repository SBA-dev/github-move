import { Niveau, toutesLesMatieres } from "../../catalogue/domain/index.ts";
import type { Lecon, Matiere } from "../../catalogue/domain/index.ts";
import { ordreDesNiveaux, parOrdrePuisIdentifiant } from "./ordre-des-lecons.ts";
import {
  estReussie,
  etatHorsDuParcours,
  leconsDeLaMatiere as leconsDeLaClasse,
  matieresDuParcours,
  parcoursDeLaMatiere,
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
  return {
    lecons: [
      ...matieresDuParcours(entrees).flatMap((matiere) => leconsDeLaMatiere(entrees, matiere)),
      ...leconsDAuDessusMontrees(entrees),
    ],
    leconsDesClassesDAvant: classesDAvant(entrees),
  };
}

function leconsDAuDessusMontrees(entrees: EntreesDuParcours): LeconDeToutesLesLecons[] {
  const matieres = toutesLesMatieres();
  const classeAuDessus = Niveau.tous().find((niveau) => niveau.estAuDessusDe(entrees.niveau));
  const matieresReussies = matieres.filter((matiere) => matiereReussieDuNiveau(entrees, matiere));
  const montrees = (lecon: Lecon) =>
    estReussie(entrees, lecon.id) ||
    (lecon.niveau.valeur === classeAuDessus?.valeur &&
      matieresReussies.some((matiere) => matiere.code === lecon.matiere.code));
  const rangDeLaMatiere = (lecon: Lecon) => matieres.findIndex((matiere) => matiere.code === lecon.matiere.code);
  return entrees.lecons
    .filter((lecon) => lecon.niveau.estAuDessusDe(entrees.niveau) && montrees(lecon))
    .sort((a, b) => ordreDesNiveaux(a, b) || rangDeLaMatiere(a) - rangDeLaMatiere(b) || parOrdrePuisIdentifiant(a, b))
    .map((lecon) => ({
      lecon: lecon.id,
      matiere: lecon.matiere,
      niveau: lecon.niveau,
      titre: lecon.titre,
      etat: etatHorsDuParcours(entrees, lecon.id),
    }));
}

function classesDAvant(entrees: EntreesDuParcours): ClasseDAvant[] {
  const matieres = toutesLesMatieres();
  const rangDeLaMatiere = (lecon: Lecon) => matieres.findIndex((matiere) => matiere.code === lecon.matiere.code);
  return Niveau.tous()
    .filter((niveau) => entrees.niveau.estAuDessusDe(niveau))
    .map((niveau) => ({
      niveau,
      lecons: entrees.lecons
        .filter((lecon) => lecon.niveau.valeur === niveau.valeur)
        .sort((a, b) => rangDeLaMatiere(a) - rangDeLaMatiere(b) || parOrdrePuisIdentifiant(a, b))
        .map((lecon) => ({
          lecon: lecon.id,
          niveau: lecon.niveau,
          titre: lecon.titre,
          etat: etatHorsDuParcours(entrees, lecon.id),
        })),
    }))
    .filter(({ lecons }) => lecons.length > 0);
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
