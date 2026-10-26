import { SeancesTermineesDuProfil } from "@domain/motivation";
import { parentConnecte } from "../famille/profils/lecture-des-profils-supabase.ts";
import { SeancesDeRevisionGardeesSurLAppareil } from "../revision/seances-de-revision-gardees-sur-l-appareil.ts";
import { identifiantsDesSeancesDeRevisionTermineesPendantLUtilisation } from "../revision/seances-de-revision-terminees-pendant-l-utilisation.ts";
import {
  lireLesIdentifiantsDesSeancesDeRevisionTerminees,
  lireLesIdentifiantsDesSeancesTerminees,
} from "../seance/fin-de-seance/lecture-des-identifiants-de-seances-supabase.ts";
import { SeancesGardeesSurLAppareil } from "../seance/fin-de-seance/seances-gardees-sur-l-appareil.ts";
import { identifiantsDesSeancesTermineesPendantLUtilisation } from "../seance/fin-de-seance/seances-terminees-pendant-l-utilisation.ts";

/** Les derniers identifiants lus au serveur, par profil : ils servent quand une lecture ultérieure échoue (sans réseau). */
const derniersIdentifiantsLusAuServeur = new Map<string, readonly string[]>();

/** Les identifiants des séances que l'appareil connaît en dehors du serveur : séances gardées et séances jouées dans ce navigateur. */
async function identifiantsConnusDeLAppareil(profil: string): Promise<readonly string[]> {
  const parent = await parentConnecte();
  const [gardees, revisionsGardees] = parent === undefined
    ? [[], []]
    : await Promise.all([new SeancesGardeesSurLAppareil().lire(parent), new SeancesDeRevisionGardeesSurLAppareil().lire(parent)]);
  return [
    ...gardees.filter(({ enfant }) => enfant === profil).map(({ seance }) => seance),
    ...revisionsGardees.filter(({ enfant }) => enfant === profil).map(({ id }) => id),
    ...identifiantsDesSeancesTermineesPendantLUtilisation(profil),
    ...identifiantsDesSeancesDeRevisionTermineesPendantLUtilisation(profil),
  ];
}

/**
 * Les séances terminées du profil, comptées par identifiant : serveur (séances et séances de révision), séances gardées sur l'appareil,
 * séances jouées dans ce navigateur. `undefined` quand le serveur n'a jamais pu être lu pour ce profil : on ne dit rien.
 */
export async function seancesTermineesDuProfil(profil: string): Promise<SeancesTermineesDuProfil | undefined> {
  const [seancesDuServeur, revisionsDuServeur, deLAppareil] = await Promise.all([
    lireLesIdentifiantsDesSeancesTerminees(profil),
    lireLesIdentifiantsDesSeancesDeRevisionTerminees(profil),
    identifiantsConnusDeLAppareil(profil),
  ]);
  if (seancesDuServeur !== undefined && revisionsDuServeur !== undefined) {
    derniersIdentifiantsLusAuServeur.set(profil, [...seancesDuServeur, ...revisionsDuServeur]);
  }
  const derniersLus = derniersIdentifiantsLusAuServeur.get(profil);
  return derniersLus && SeancesTermineesDuProfil.reunir(derniersLus, deLAppareil);
}
