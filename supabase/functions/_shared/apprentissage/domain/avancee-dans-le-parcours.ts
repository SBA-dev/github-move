import type { LeconId, Parcours } from "./parcours.ts";

export type AvanceeDansLeParcours = Readonly<{
  depuis: LeconId;
  jusqua: Readonly<{ genre: "lecon"; lecon: LeconId }> | Readonly<{ genre: "finDuParcours" }>;
}>;

export function avanceeDansLeParcours(
  _prochaineLeconConnue: LeconId | undefined,
  _parcours: Parcours,
): AvanceeDansLeParcours | undefined {
  return undefined;
}
