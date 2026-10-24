import { parcoursDeLaMatiere } from "./parcours.ts";
import type { EntreesDuParcours, LeconId } from "./parcours.ts";

export function leconSuivanteDansLeParcours(entrees: EntreesDuParcours, lecon: LeconId): LeconId | undefined {
  const leconJouee = entrees.lecons.find((candidate) => candidate.id === lecon);
  if (!leconJouee) return undefined;
  const { lecons } = parcoursDeLaMatiere(entrees, leconJouee.matiere);
  const place = lecons.findIndex((leconDuParcours) => leconDuParcours.lecon === lecon);
  return lecons.slice(place + 1).find((leconDuParcours) => leconDuParcours.etat.genre !== "reussie")?.lecon;
}
