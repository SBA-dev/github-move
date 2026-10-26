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
import { jourDeLaSeance } from "../seance/jour-de-la-seance.ts";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { lireLesJoursDesSeancesDeRevisionRecentes, lireLesSeancesTermineesRecentes } from "./lecture-des-seances-du-jour-supabase.ts";

/** Les séances terminées du profil encore gardées sur l'appareil, sans réseau ou pas encore envoyées. */
export async function seancesGardees(parent: string | undefined, profil: string): Promise<readonly SeanceTermineeConnue[]> {
  if (parent === undefined) return [];
  const gardees = await new SeancesGardeesSurLAppareil().lire(parent);
  return gardees
    .filter((corps) => corps.enfant === profil)
    .map((corps) => ({ corps, termineeLe: new Date(corps.termineeLe) }))
    .filter(({ termineeLe }) => !Number.isNaN(termineeLe.getTime()))
    .map(({ corps, termineeLe }) => ({ lecon: corps.lecon, termineeLe, jour: jourDeLaSeance(corps.jour, termineeLe) }));
}

/** Les jours des séances de révision terminées du profil encore gardées sur l'appareil. */
export async function joursDesRevisionsGardees(parent: string | undefined, profil: string): Promise<readonly string[]> {
  if (parent === undefined) return [];
  const gardees = await new SeancesDeRevisionGardeesSurLAppareil().lire(parent);
  return gardees.filter((corps) => corps.enfant === profil).map((corps) => corps.jour);
}

/** Les séances terminées que l'appareil connaît pour le profil (serveur, séances gardées, séances jouées dans ce navigateur), chacune avec le jour de l'appareil où elle a été finie. */
export async function faitsDuJourDuProfil(profil: string, maintenant: Date): Promise<FaitsDuJour> {
  const aujourdhui = jourDuNavigateur(maintenant);
  const parent = await parentConnecte();
  const [duServeur, gardees, revisionsDuServeur, revisionsGardees] = await Promise.all([
    lireLesSeancesTermineesRecentes(profil, maintenant),
    seancesGardees(parent, profil),
    lireLesJoursDesSeancesDeRevisionRecentes(profil, aujourdhui.plus(-1).toString()),
    joursDesRevisionsGardees(parent, profil),
  ]);
  const seances = [...(duServeur ?? []), ...gardees, ...seancesTermineesPendantLUtilisation(profil)];
  const joursDesRevisions = [...(revisionsDuServeur ?? []), ...revisionsGardees, ...joursDesSeancesDeRevisionTermineesPendantLUtilisation(profil)];
  return faitsDuJour({
    aujourdhui,
    seancesTerminees: seances.map(({ lecon, jour }) => ({ lecon, jour })),
    seancesDeRevisionTerminees: joursDesRevisions.map((jour) => ({ jour: Jour.de(jour) })),
  });
}
