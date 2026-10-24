import { toutesLesMatieres } from "../../catalogue/domain/index.ts";
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

export type LeconDuParcours = Readonly<{ lecon: LeconId; titre: string; place: number; etat: EtatDansLeParcours }>;

export type LeconReussieDUneClasseAuDessus = Readonly<{
  lecon: LeconId;
  niveau: Niveau;
  titre: string;
  etoiles: Etoiles;
}>;

export type Parcours = Readonly<{
  lecons: readonly LeconDuParcours[];
  leconsReussiesDesClassesAuDessus: readonly LeconReussieDUneClasseAuDessus[];
  prochaineLecon: LeconId | undefined;
  nombreDeLeconsReussies: number;
  nombreDeLecons: number;
}>;

export function matieresDuParcours(entrees: EntreesDuParcours): Matiere[] {
  return toutesLesMatieres().filter((matiere) => leconsDeLaMatiere(entrees, matiere).length > 0);
}

export function parcoursDeLaMatiere(entrees: EntreesDuParcours, matiere: Matiere): Parcours {
  const ordonnees = leconsDeLaMatiere(entrees, matiere).sort(parOrdrePuisIdentifiant);
  const prochaineLecon = ordonnees.find((lecon) => !entrees.meilleuresEtoiles.has(lecon.id))?.id;
  const lecons = ordonnees.map((lecon, index) => ({
    lecon: lecon.id,
    titre: lecon.titre,
    place: index + 1,
    etat: etatDeLaLecon(lecon.id, entrees.meilleuresEtoiles, prochaineLecon),
  }));
  const nombreDeLeconsReussies = ordonnees.filter((lecon) => entrees.meilleuresEtoiles.has(lecon.id)).length;
  return {
    lecons,
    leconsReussiesDesClassesAuDessus: leconsReussiesDesClassesAuDessus(entrees, matiere),
    prochaineLecon,
    nombreDeLeconsReussies,
    nombreDeLecons: ordonnees.length,
  };
}

function leconsReussiesDesClassesAuDessus(
  entrees: EntreesDuParcours,
  matiere: Matiere,
): LeconReussieDUneClasseAuDessus[] {
  return entrees.lecons
    .filter((lecon) => lecon.matiere.code === matiere.code && lecon.niveau.estAuDessusDe(entrees.niveau))
    .sort((a, b) => ordreDesNiveaux(a, b) || parOrdrePuisIdentifiant(a, b))
    .flatMap((lecon) => {
      const etoiles = entrees.meilleuresEtoiles.get(lecon.id);
      return etoiles ? [{ lecon: lecon.id, niveau: lecon.niveau, titre: lecon.titre, etoiles }] : [];
    });
}

function ordreDesNiveaux(a: Lecon, b: Lecon): number {
  if (a.niveau.estAuDessusDe(b.niveau)) return 1;
  return b.niveau.estAuDessusDe(a.niveau) ? -1 : 0;
}

function leconsDeLaMatiere(entrees: EntreesDuParcours, matiere: Matiere): Lecon[] {
  return entrees.lecons.filter((lecon) =>
    lecon.matiere.code === matiere.code && lecon.niveau.valeur === entrees.niveau.valeur
  );
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
