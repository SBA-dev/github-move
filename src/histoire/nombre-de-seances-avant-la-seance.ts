import { DELAI_MAXIMAL_DE_LECTURE_EN_MS } from "../seance/fin-de-seance/meilleures-etoiles-du-profil-lues.ts";
import { avecDelaiMaximal } from "../reseau/avec-delai-maximal.ts";
import { seancesTermineesDuProfil } from "./seances-terminees-du-profil.ts";

/** Le nombre de séances terminées d'avant la séance qui commence, ou `undefined` si le serveur n'a pas pu être lu à temps. */
export function lireLeNombreDeSeancesAvantLaSeance(profil: string): Promise<number | undefined> {
  return avecDelaiMaximal(seancesTermineesDuProfil(profil).then((seances) => seances?.nombre()), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}
