import { Niveau, toutesLesMatieres } from "../../catalogue/domain/index.ts";
import type { Lecon, Matiere } from "../../catalogue/domain/index.ts";
import { ordreDesNiveaux, parOrdrePuisIdentifiant } from "./ordre-des-lecons.ts";
import {
  classeJusteAuDessus,
  estReussie,
  estUneClasseAuDessus,
  estUneClasseDAvant,
  etatHorsDuParcours,
  leconsDeLaClasse,
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

export type LeconsDUnNiveau = Readonly<{ niveau: Niveau; lecons: readonly LeconDesClassesDAvant[] }>;

export type ToutesLesLecons = Readonly<{
  lecons: readonly LeconDeToutesLesLecons[];
  leconsDesClassesDAvant: readonly LeconsDUnNiveau[];
}>;

export function toutesLesLecons(entrees: EntreesDuParcours, filtre: FiltreDesLecons): ToutesLesLecons {
  const retenue = ({ matiere, niveau }: { matiere: Matiere; niveau: Niveau }) =>
    (filtre.matiere === undefined || matiere.code === filtre.matiere.code) &&
    (filtre.niveau === undefined || niveau.valeur === filtre.niveau.valeur);
  return {
    lecons: [
      ...matieresDuParcours(entrees).flatMap((matiere) => leconsDeLaMatiere(entrees, matiere)),
      ...leconsDAuDessusMontrees(entrees),
    ].filter(retenue),
    leconsDesClassesDAvant: classesDAvant(entrees, retenue),
  };
}

function leconsDAuDessusMontrees(entrees: EntreesDuParcours): LeconDeToutesLesLecons[] {
  const matieres = toutesLesMatieres();
  const auDessus = estUneClasseAuDessus(entrees);
  const classeAuDessus = classeJusteAuDessus(entrees.niveau);
  const matieresReussies = matieres.filter((matiere) => matiereReussieDuNiveau(entrees, matiere));
  const montrees = (lecon: Lecon) =>
    estReussie(entrees, lecon.id) ||
    (lecon.niveau.valeur === classeAuDessus?.valeur &&
      matieresReussies.some((matiere) => matiere.code === lecon.matiere.code));
  return entrees.lecons
    .filter((lecon) => auDessus(lecon.niveau) && montrees(lecon))
    .sort((a, b) => ordreDesNiveaux(a, b) || parMatiereOrdrePuisIdentifiant(a, b))
    .map((lecon) => ({
      lecon: lecon.id,
      matiere: lecon.matiere,
      niveau: lecon.niveau,
      titre: lecon.titre,
      etat: etatHorsDuParcours(entrees, lecon.id),
    }));
}

const matieresDuCatalogue = toutesLesMatieres();
const rang = (lecon: Lecon) => matieresDuCatalogue.findIndex((matiere) => matiere.code === lecon.matiere.code);

function parMatiereOrdrePuisIdentifiant(a: Lecon, b: Lecon): number {
  return rang(a) - rang(b) || parOrdrePuisIdentifiant(a, b);
}

function classesDAvant(entrees: EntreesDuParcours, retenue: (lecon: Lecon) => boolean): LeconsDUnNiveau[] {
  return Niveau.tous()
    .filter(estUneClasseDAvant(entrees))
    .map((niveau) => ({
      niveau,
      lecons: entrees.lecons
        .filter((lecon) => lecon.niveau.valeur === niveau.valeur && retenue(lecon))
        .sort(parMatiereOrdrePuisIdentifiant)
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

export type ChoixDuFiltre = Readonly<{ matieres: readonly Matiere[]; niveaux: readonly Niveau[] }>;

export function choixDuFiltre(entrees: EntreesDuParcours): ChoixDuFiltre {
  const { lecons, leconsDesClassesDAvant } = toutesLesLecons(entrees, {});
  const identifiants = new Set(
    [...lecons, ...leconsDesClassesDAvant.flatMap((classe) => classe.lecons)].map(({ lecon }) => lecon),
  );
  const presentes = entrees.lecons.filter((lecon) => identifiants.has(lecon.id));
  return {
    matieres: toutesLesMatieres().filter((matiere) => presentes.some((lecon) => lecon.matiere.code === matiere.code)),
    niveaux: Niveau.tous().filter((niveau) => presentes.some((lecon) => lecon.niveau.valeur === niveau.valeur)),
  };
}
