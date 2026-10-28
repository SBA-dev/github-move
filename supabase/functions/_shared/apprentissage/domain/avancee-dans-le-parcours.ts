import type { LeconId, Parcours } from "./parcours.ts";

export type AvanceeDansLeParcours = Readonly<{
  depuis: LeconId;
  jusqua: Readonly<{ genre: "lecon"; lecon: LeconId }> | Readonly<{ genre: "finDuParcours" }>;
}>;

export function avanceeDansLeParcours(
  prochaineLeconConnue: LeconId | undefined,
  parcours: Parcours,
): AvanceeDansLeParcours | undefined {
  if (prochaineLeconConnue === undefined || !estDevenueReussie(prochaineLeconConnue, parcours)) return undefined;
  const nouvelleProchaineLecon = parcours.prochaineLecon;
  return {
    depuis: prochaineLeconConnue,
    jusqua: nouvelleProchaineLecon === undefined
      ? { genre: "finDuParcours" }
      : { genre: "lecon", lecon: nouvelleProchaineLecon },
  };
}

function estDevenueReussie(lecon: LeconId, parcours: Parcours): boolean {
  return parcours.lecons.some(
    (uneLecon) =>
      uneLecon.lecon === lecon &&
      (uneLecon.etat.genre === "reussie" || uneLecon.etat.genre === "reussieAuTestDeDepart"),
  );
}
