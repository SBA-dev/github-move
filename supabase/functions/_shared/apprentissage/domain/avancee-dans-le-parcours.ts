import { estUneLeconReussie, type LeconId, type Parcours } from "./parcours.ts";

export type AvanceeDansLeParcours = Readonly<{
  depuis: LeconId;
  jusqua: Readonly<{ genre: "lecon"; lecon: LeconId }> | Readonly<{ genre: "finDuParcours" }>;
}>;

export function avanceeDansLeParcours(
  prochaineLeconConnue: LeconId | undefined,
  parcours: Parcours,
): AvanceeDansLeParcours | undefined {
  if (prochaineLeconConnue === undefined) return undefined;
  if (!estDevenueReussie(prochaineLeconConnue, parcours)) return undefined;
  if (recule(prochaineLeconConnue, parcours)) return undefined;
  return { depuis: prochaineLeconConnue, jusqua: destination(parcours.prochaineLecon) };
}

function destination(nouvelleProchaineLecon: LeconId | undefined): AvanceeDansLeParcours["jusqua"] {
  return nouvelleProchaineLecon === undefined
    ? { genre: "finDuParcours" }
    : { genre: "lecon", lecon: nouvelleProchaineLecon };
}

function recule(prochaineLeconConnue: LeconId, parcours: Parcours): boolean {
  const placeConnue = placeDe(prochaineLeconConnue, parcours);
  const nouvellePlace = placeDe(parcours.prochaineLecon, parcours);
  return placeConnue !== undefined && nouvellePlace !== undefined && nouvellePlace < placeConnue;
}

function placeDe(lecon: LeconId | undefined, parcours: Parcours): number | undefined {
  return parcours.lecons.find((uneLecon) => uneLecon.lecon === lecon)?.place;
}

function estDevenueReussie(lecon: LeconId, parcours: Parcours): boolean {
  return parcours.lecons.some(
    (uneLecon) => uneLecon.lecon === lecon && estUneLeconReussie(uneLecon.etat),
  );
}
