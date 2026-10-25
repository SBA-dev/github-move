import { toutesLesMatieres } from "../../catalogue/domain/index.ts";
import type { Lecon, Matiere, Niveau } from "../../catalogue/domain/index.ts";
import type { Etoiles } from "./etoiles.ts";
import { ordreDesNiveaux, parOrdrePuisIdentifiant } from "./ordre-des-lecons.ts";

export type LeconId = string;

export type EntreesDuParcours = Readonly<{
  lecons: readonly Lecon[];
  niveau: Niveau;
  meilleuresEtoiles: ReadonlyMap<LeconId, Etoiles>;
  leconsReussiesAuTestDeDepart?: ReadonlySet<LeconId>;
}>;

export type EtatDansLeParcours =
  | { genre: "reussie"; etoiles: Etoiles }
  | { genre: "reussieAuTestDeDepart" }
  | { genre: "prochaine" }
  | { genre: "aDecouvrir" };

export type EtatHorsDuParcours = Exclude<EtatDansLeParcours, { genre: "prochaine" }>;

export type LeconDuParcours = Readonly<{ lecon: LeconId; titre: string; place: number; etat: EtatDansLeParcours }>;

export type LeconReussieDUneClasseAuDessus = Readonly<{
  lecon: LeconId;
  niveau: Niveau;
  titre: string;
  etoiles?: Etoiles;
}>;

export type LeconDesClassesDAvant = Readonly<{
  lecon: LeconId;
  niveau: Niveau;
  titre: string;
  etat: EtatHorsDuParcours;
}>;

export type Parcours = Readonly<{
  lecons: readonly LeconDuParcours[];
  leconsDesClassesDAvant: readonly LeconDesClassesDAvant[];
  leconsReussiesDesClassesAuDessus: readonly LeconReussieDUneClasseAuDessus[];
  prochaineLecon: LeconId | undefined;
  nombreDeLeconsReussies: number;
  nombreDeLecons: number;
}>;

export function estReussie(entrees: EntreesDuParcours, lecon: LeconId): boolean {
  return entrees.meilleuresEtoiles.has(lecon) || (entrees.leconsReussiesAuTestDeDepart?.has(lecon) ?? false);
}

export function matieresDuParcours(entrees: EntreesDuParcours): Matiere[] {
  return toutesLesMatieres().filter((matiere) => leconsDeLaMatiere(entrees, matiere).length > 0);
}

export function parcoursDeLaMatiere(entrees: EntreesDuParcours, matiere: Matiere): Parcours {
  const ordonnees = leconsDeLaMatiere(entrees, matiere).sort(parOrdrePuisIdentifiant);
  const prochaineLecon = ordonnees.find((lecon) => !estReussie(entrees, lecon.id))?.id;
  const lecons = ordonnees.map((lecon, index) => ({
    lecon: lecon.id,
    titre: lecon.titre,
    place: index + 1,
    etat: etatDeLaLecon(entrees, lecon.id, prochaineLecon),
  }));
  const nombreDeLeconsReussies = ordonnees.filter((lecon) => estReussie(entrees, lecon.id)).length;
  return {
    lecons,
    leconsDesClassesDAvant: leconsDesClassesDAvant(entrees, matiere),
    leconsReussiesDesClassesAuDessus: leconsReussiesDesClassesAuDessus(entrees, matiere),
    prochaineLecon,
    nombreDeLeconsReussies,
    nombreDeLecons: ordonnees.length,
  };
}

function leconsDesClassesDAvant(entrees: EntreesDuParcours, matiere: Matiere): LeconDesClassesDAvant[] {
  return leconsDesAutresClasses(entrees, matiere, (niveau) => entrees.niveau.estAuDessusDe(niveau))
    .map((lecon) => ({
      lecon: lecon.id,
      niveau: lecon.niveau,
      titre: lecon.titre,
      etat: etatHorsDuParcours(entrees, lecon.id),
    }));
}

function leconsReussiesDesClassesAuDessus(
  entrees: EntreesDuParcours,
  matiere: Matiere,
): LeconReussieDUneClasseAuDessus[] {
  return leconsDesAutresClasses(entrees, matiere, (niveau) => niveau.estAuDessusDe(entrees.niveau))
    .flatMap((lecon) => {
      if (!estReussie(entrees, lecon.id)) return [];
      const etoiles = entrees.meilleuresEtoiles.get(lecon.id);
      return [{ lecon: lecon.id, niveau: lecon.niveau, titre: lecon.titre, etoiles }];
    });
}

function leconsDesAutresClasses(
  entrees: EntreesDuParcours,
  matiere: Matiere,
  estDeLaBonneClasse: (niveau: Niveau) => boolean,
): Lecon[] {
  return toutesLesLeconsDeLaMatiere(entrees, matiere)
    .filter((lecon) => estDeLaBonneClasse(lecon.niveau))
    .sort((a, b) => ordreDesNiveaux(a, b) || parOrdrePuisIdentifiant(a, b));
}

function leconsDeLaMatiere(entrees: EntreesDuParcours, matiere: Matiere): Lecon[] {
  return toutesLesLeconsDeLaMatiere(entrees, matiere).filter((lecon) => lecon.niveau.valeur === entrees.niveau.valeur);
}

function toutesLesLeconsDeLaMatiere(entrees: EntreesDuParcours, matiere: Matiere): Lecon[] {
  return entrees.lecons.filter((lecon) => lecon.matiere.code === matiere.code);
}

function etatDeLaLecon(
  entrees: EntreesDuParcours,
  lecon: LeconId,
  prochaineLecon: LeconId | undefined,
): EtatDansLeParcours {
  return lecon === prochaineLecon ? { genre: "prochaine" } : etatHorsDuParcours(entrees, lecon);
}

function etatHorsDuParcours(entrees: EntreesDuParcours, lecon: LeconId): EtatHorsDuParcours {
  const etoiles = entrees.meilleuresEtoiles.get(lecon);
  if (etoiles) return { genre: "reussie", etoiles };
  return estReussie(entrees, lecon) ? { genre: "reussieAuTestDeDepart" } : { genre: "aDecouvrir" };
}
