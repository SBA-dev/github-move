import type { EntreesDuSuivi } from "./entrees-du-suivi.ts";
import { leconReussie, leconsDeLaClasseEnCours, meilleuresEtoilesDeLaLecon } from "./etat-de-la-lecon.ts";

export type ChiffresDuSuivi = Readonly<{
  leconsReussies: number;
  etoiles: number;
  seancesJouees: number;
  erreursCorrigeesPourDeBon: number;
}>;

export function chiffresDuSuivi(entrees: EntreesDuSuivi): ChiffresDuSuivi {
  const lecons = leconsDeLaClasseEnCours(entrees);
  const idsDeLaClasse = new Set(lecons.map((lecon) => lecon.id));
  const seancesDeLaClasse = entrees.seances.filter((seance) => idsDeLaClasse.has(seance.lecon));
  return {
    leconsReussies: lecons.filter((lecon) => leconReussie(entrees, lecon.id)).length,
    etoiles: lecons.reduce((somme, lecon) => somme + meilleuresEtoilesDeLaLecon(entrees, lecon.id), 0),
    seancesJouees: seancesDeLaClasse.length + entrees.nombreDeSeancesDeRevision,
    erreursCorrigeesPourDeBon: entrees.erreursCorrigeesPourDeBon,
  };
}
