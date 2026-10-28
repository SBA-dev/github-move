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
  const nouvelleProchaineLecon = parcours.prochaineLecon;
  return {
    depuis: prochaineLeconConnue,
    jusqua: nouvelleProchaineLecon === undefined
      ? { genre: "finDuParcours" }
      : { genre: "lecon", lecon: nouvelleProchaineLecon },
  };
}
