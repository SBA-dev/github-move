import { Jour } from "@domain/apprentissage";
import { type FaitsDuJour, faitsDuJour } from "@domain/motivation";
import { parentConnecte } from "../famille/profils/lecture-des-profils-supabase.ts";
import { SeancesDeRevisionGardeesSurLAppareil } from "../revision/seances-de-revision-gardees-sur-l-appareil.ts";
import { joursDesSeancesDeRevisionTermineesPendantLUtilisation } from "../revision/seances-de-revision-terminees-pendant-l-utilisation.ts";
import { SeancesGardeesSurLAppareil } from "../seance/fin-de-seance/seances-gardees-sur-l-appareil.ts";
import {
  type SeanceTermineeConnue,
  seancesTermineesPendantLUtilisation,
} from "../seance/fin-de-seance/seances-terminees-pendant-l-utilisation.ts";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { lireLesJoursDesSeancesDeRevisionRecentes, lireLesSeancesTermineesRecentes } from "./lecture-des-seances-du-jour-supabase.ts";

async function seancesGardees(profil: string): Promise<readonly SeanceTermineeConnue[]> {
  const parent = await parentConnecte();
  if (parent === undefined) return [];
  const gardees = await new SeancesGardeesSurLAppareil().lire(parent);
  return gardees.filter((corps) => corps.enfant === profil).map((corps) => ({ lecon: corps.lecon, termineeLe: new Date(corps.termineeLe) }));
}

async function joursDesRevisionsGardees(profil: string): Promise<readonly string[]> {
  const parent = await parentConnecte();
  if (parent === undefined) return [];
  const gardees = await new SeancesDeRevisionGardeesSurLAppareil().lire(parent);
  return gardees.filter((corps) => corps.enfant === profil).map((corps) => corps.jour);
}

/** Les séances terminées que l'appareil connaît pour le profil (serveur, séances gardées, séances jouées dans ce navigateur), ramenées au jour de l'appareil. */
export async function faitsDuJourDuProfil(profil: string, maintenant: Date): Promise<FaitsDuJour> {
  const aujourdhui = jourDuNavigateur(maintenant);
  const [duServeur, gardees, revisionsDuServeur, revisionsGardees] = await Promise.all([
    lireLesSeancesTermineesRecentes(profil, maintenant),
    seancesGardees(profil),
    lireLesJoursDesSeancesDeRevisionRecentes(profil, aujourdhui.plus(-1).toString()),
    joursDesRevisionsGardees(profil),
  ]);
  const seances = [...(duServeur ?? []), ...gardees, ...seancesTermineesPendantLUtilisation(profil)];
  const joursDesRevisions = [...(revisionsDuServeur ?? []), ...revisionsGardees, ...joursDesSeancesDeRevisionTermineesPendantLUtilisation(profil)];
  return faitsDuJour({
    aujourdhui,
    seancesTerminees: seances.map((seance) => ({ lecon: seance.lecon, jour: jourDuNavigateur(seance.termineeLe) })),
    seancesDeRevisionTerminees: joursDesRevisions.map((jour) => ({ jour: Jour.de(jour) })),
  });
}
