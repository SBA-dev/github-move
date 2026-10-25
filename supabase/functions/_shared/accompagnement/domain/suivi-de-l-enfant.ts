import type { EntreesDuSuivi, ProfilSuivi } from "./entrees-du-suivi.ts";
import { chiffresDuSuivi } from "./chiffres-du-suivi.ts";
import type { ChiffresDuSuivi } from "./chiffres-du-suivi.ts";
import { carteDesCompetences } from "./carte-des-competences.ts";
import type { CarteDesCompetences } from "./carte-des-competences.ts";
import { leconsJouees } from "./lecons-jouees.ts";
import type { TableauDesLeconsJouees } from "./lecons-jouees.ts";

export type SuiviDeLEnfant = Readonly<{
  enfant: ProfilSuivi;
  chiffres: ChiffresDuSuivi;
  carte: CarteDesCompetences;
  leconsJouees: TableauDesLeconsJouees;
}>;

export function suiviDeLEnfant(entrees: EntreesDuSuivi): SuiviDeLEnfant {
  return {
    enfant: entrees.enfant,
    chiffres: chiffresDuSuivi(entrees),
    carte: carteDesCompetences(entrees),
    leconsJouees: leconsJouees(entrees),
  };
}
