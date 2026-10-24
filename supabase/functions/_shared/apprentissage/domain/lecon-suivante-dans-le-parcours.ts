import { parcoursDeLaMatiere } from "./parcours.ts";
import type { EntreesDuParcours, LeconId } from "./parcours.ts";

export function leconSuivanteDansLeParcours(entrees: EntreesDuParcours, lecon: LeconId): LeconId | undefined {
  const leconJouee = entrees.lecons.find((candidate) => candidate.id === lecon);
  if (!leconJouee) return undefined;
  const { lecons } = parcoursDeLaMatiere(entrees, leconJouee.matiere);
  const place = lecons.findIndex((leconDuParcours) => leconDuParcours.lecon === lecon);
  if (place === -1) return undefined;
  const suivantes = lecons.slice(place + 1);
  const premiereNonReussie = suivantes.find((leconDuParcours) => leconDuParcours.etat.genre !== "reussie");
  return (premiereNonReussie ?? suivantes[0])?.lecon;
}
