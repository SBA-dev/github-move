import type { QueteDuJour } from "@domain/motivation";
import { lireLesLecturesDuParcours } from "../parcours/useLecturesDuParcours.ts";
import { lireLaFileDeRevision } from "../revision/lire-la-file-de-revision.ts";
import { avecDelaiMaximal } from "../reseau/avec-delai-maximal.ts";
import { DELAI_MAXIMAL_DE_LECTURE_EN_MS } from "../reseau/delai-maximal-de-lecture.ts";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { derniereSeanceTerminee } from "./derniere-seance-terminee.ts";
import { entreesDuJour } from "./entrees-du-jour.ts";
import { faitsDuJourDuProfil } from "./faits-du-jour-du-profil.ts";
import { queteDuJourDeLAccueil } from "./quete-du-jour.ts";

async function lireLaQuete(profil: string, niveau: string): Promise<QueteDuJour | undefined> {
  const maintenant = new Date();
  try {
    const [lectures, derniere, faits, file] = await Promise.all([
      lireLesLecturesDuParcours(profil),
      derniereSeanceTerminee(profil),
      faitsDuJourDuProfil(profil, maintenant),
      lireLaFileDeRevision(profil),
    ]);
    const dues = file?.questionsDues(jourDuNavigateur(maintenant)).length;
    return queteDuJourDeLAccueil(entreesDuJour(lectures, derniere?.lecon, niveau), dues, faits);
  } catch {
    return undefined;
  }
}

/** La quête du jour du profil telle que l'appareil la connaît à cet instant ; `undefined` si une lecture échoue ou dépasse le délai maximal. */
export function lireLaQueteDuJour(profil: string, niveau: string): Promise<QueteDuJour | undefined> {
  return avecDelaiMaximal(lireLaQuete(profil, niveau), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}
