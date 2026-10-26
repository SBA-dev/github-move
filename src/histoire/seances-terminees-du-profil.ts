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

/** Les derniers identifiants lus au serveur, par profil : ils servent à « Mes médailles » et à l'écran de l'épisode quand une lecture ultérieure échoue (sans réseau). */
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

/** Les identifiants lus au serveur à l'instant, ou `undefined` quand le serveur n'a pas pu être lu ; une lecture réussie est gardée en mémoire. */
async function lireLesIdentifiantsAuServeur(profil: string): Promise<readonly string[] | undefined> {
  const [seancesDuServeur, revisionsDuServeur] = await Promise.all([
    lireLesIdentifiantsDesSeancesTerminees(profil),
    lireLesIdentifiantsDesSeancesDeRevisionTerminees(profil),
  ]);
  if (seancesDuServeur === undefined || revisionsDuServeur === undefined) return undefined;
  const identifiants = [...seancesDuServeur, ...revisionsDuServeur];
  derniersIdentifiantsLusAuServeur.set(profil, identifiants);
  return identifiants;
}

async function reunirAvecLAppareil(profil: string, duServeur: readonly string[] | undefined): Promise<SeancesTermineesDuProfil | undefined> {
  return duServeur && SeancesTermineesDuProfil.reunir(duServeur, await identifiantsConnusDeLAppareil(profil));
}

/**
 * Les séances terminées du profil lues au serveur à l'instant (séances et séances de révision), avec celles de l'appareil.
 * `undefined` quand le serveur ne peut pas être lu : jamais de repli sur une lecture ancienne, pour ne pas annoncer à tort un épisode.
 */
export async function seancesTermineesDuProfilLuesAuServeur(profil: string): Promise<SeancesTermineesDuProfil | undefined> {
  return reunirAvecLAppareil(profil, await lireLesIdentifiantsAuServeur(profil));
}

/**
 * Les séances terminées du profil, avec repli sur la dernière lecture du serveur gardée en mémoire (sans réseau).
 * `undefined` quand le serveur n'a jamais pu être lu pour ce profil : on ne dit rien.
 */
export async function seancesTermineesDuProfilAvecRepliSurLaDerniereLecture(profil: string): Promise<SeancesTermineesDuProfil | undefined> {
  const duServeur = await lireLesIdentifiantsAuServeur(profil);
  return reunirAvecLAppareil(profil, duServeur ?? derniersIdentifiantsLusAuServeur.get(profil));
}
