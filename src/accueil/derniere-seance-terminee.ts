import { parentConnecte } from "../famille/profils/lecture-des-profils-supabase.ts";
import { SeancesGardeesSurLAppareil } from "../seance/fin-de-seance/seances-gardees-sur-l-appareil.ts";
import {
  derniereSeanceTermineePendantLUtilisation,
  type SeanceTermineeConnue,
} from "../seance/fin-de-seance/seances-terminees-pendant-l-utilisation.ts";
import { lireLaDerniereSeanceTerminee } from "./lecture-de-la-derniere-seance-terminee-supabase.ts";

async function seancesGardeesDuProfil(profil: string): Promise<SeanceTermineeConnue[]> {
  const parent = await parentConnecte();
  if (parent === undefined) return [];
  const gardees = await new SeancesGardeesSurLAppareil().lire(parent);
  return gardees.filter((corps) => corps.enfant === profil).map((corps) => ({ lecon: corps.lecon, termineeLe: new Date(corps.termineeLe) }));
}

function laPlusRecente(seances: readonly SeanceTermineeConnue[]): SeanceTermineeConnue | undefined {
  return seances.reduce<SeanceTermineeConnue | undefined>(
    (recente, seance) => (recente && recente.termineeLe > seance.termineeLe ? recente : seance),
    undefined,
  );
}

/** La dernière séance terminée du profil : la plus récente entre le serveur, les séances gardées sur l'appareil et celles jouées dans ce navigateur. */
export async function derniereSeanceTerminee(profil: string): Promise<SeanceTermineeConnue | undefined> {
  const [duServeur, gardees] = await Promise.all([lireLaDerniereSeanceTerminee(profil), seancesGardeesDuProfil(profil)]);
  const pendantLUtilisation = derniereSeanceTermineePendantLUtilisation(profil);
  return laPlusRecente([duServeur, ...gardees, pendantLUtilisation].filter((seance) => seance !== undefined));
}
