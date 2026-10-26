import { DELAI_MAXIMAL_DE_LECTURE_EN_MS } from "../seance/fin-de-seance/meilleures-etoiles-du-profil-lues.ts";
import { avecDelaiMaximal } from "../reseau/avec-delai-maximal.ts";
import { seancesTermineesDuProfilLuesAuServeur } from "./seances-terminees-du-profil.ts";

/** Le nombre de séances terminées d'avant la séance qui commence, ou `undefined` si le serveur n'a pas pu être lu à temps (jamais de repli sur une lecture ancienne). */
export function lireLeNombreDeSeancesAvantLaSeance(profil: string): Promise<number | undefined> {
  return avecDelaiMaximal(seancesTermineesDuProfilLuesAuServeur(profil).then((seances) => seances?.nombre()), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}
