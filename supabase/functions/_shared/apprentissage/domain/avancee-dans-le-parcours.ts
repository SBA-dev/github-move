import type { LeconId, Parcours } from "./parcours.ts";

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
  return parcours.lecons.some((nouvelle) =>
    nouvelle.lecon === parcours.prochaineLecon &&
    parcours.lecons.some((connue) => connue.lecon === prochaineLeconConnue && nouvelle.place < connue.place)
  );
}

function estDevenueReussie(lecon: LeconId, parcours: Parcours): boolean {
  return parcours.lecons.some(
    (uneLecon) =>
      uneLecon.lecon === lecon &&
      (uneLecon.etat.genre === "reussie" || uneLecon.etat.genre === "reussieAuTestDeDepart"),
  );
}
