import { leconDuJour } from "./lecon-du-jour.ts";
import { leconSuivanteDansLeParcours } from "./lecon-suivante-dans-le-parcours.ts";
import type { EntreesDuParcours, LeconId } from "./parcours.ts";

export function leconSuivanteEnFinDeSeance(entrees: EntreesDuParcours, lecon: LeconId): LeconId | undefined {
  const suivante = leconSuivanteDansLeParcours(entrees, lecon);
  if (suivante) return suivante;
  const leconJouee = entrees.lecons.find((candidate) => candidate.id === lecon);
  const jour = leconDuJour({ parcours: entrees, matiereDeLaDerniereSeance: leconJouee?.matiere.code });
  return jour.genre === "aJouer" && jour.lecon !== lecon ? jour.lecon : undefined;
}
