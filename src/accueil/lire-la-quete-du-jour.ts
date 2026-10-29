import { type PropositionsDuJour, type QueteDuJour, queteDuJour } from "@domain/motivation";
import { lireLesLecturesDuParcours } from "../parcours/useLecturesDuParcours.ts";
import { lireLaFileDeRevision } from "../revision/lire-la-file-de-revision.ts";
import { avecDelaiMaximal } from "../reseau/avec-delai-maximal.ts";
import { DELAI_MAXIMAL_DE_LECTURE_EN_MS } from "../reseau/delai-maximal-de-lecture.ts";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { derniereSeanceTerminee } from "./derniere-seance-terminee.ts";
import { entreesDuJour } from "./entrees-du-jour.ts";
import { faitsDuJourDuProfil } from "./faits-du-jour-du-profil.ts";
import { propositionsDuJour } from "./quete-du-jour.ts";

/** Ce que l'appareil sait au lancement de la séance : les propositions du jour et la quête qu'elles donnent. */
export type QueteLueAvantLaSeance = { readonly propositions: PropositionsDuJour; readonly quete: QueteDuJour };

async function lireAvantLaSeance(profil: string, niveau: string): Promise<QueteLueAvantLaSeance | undefined> {
  const maintenant = new Date();
  try {
    const [lectures, derniere, faits, file] = await Promise.all([
      lireLesLecturesDuParcours(profil),
      derniereSeanceTerminee(profil),
      faitsDuJourDuProfil(profil, maintenant),
      lireLaFileDeRevision(profil),
    ]);
    const dues = file?.questionsDues(jourDuNavigateur(maintenant)).length;
    const propositions = propositionsDuJour(entreesDuJour(lectures, derniere?.lecon, niveau), dues);
    return { propositions, quete: queteDuJour(propositions, faits) };
  } catch {
    return undefined;
  }
}

/** La quête du jour au lancement de la séance ; `undefined` si une lecture échoue ou dépasse le délai maximal. */
export function lireLaQueteAvantLaSeance(profil: string, niveau: string): Promise<QueteLueAvantLaSeance | undefined> {
  return avecDelaiMaximal(lireAvantLaSeance(profil, niveau), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}

/**
 * La quête du jour une fois la séance terminée : les propositions d'avant la séance, avec les seuls faits du jour relus.
 * Elle n'attend pas les envois en cours, pour ne pas retarder la phrase de fin.
 */
export function lireLaQueteApresLaSeance(profil: string, propositions: PropositionsDuJour): Promise<QueteDuJour | undefined> {
  const lecture = faitsDuJourDuProfil(profil, new Date()).then((faits) => queteDuJour(propositions, faits)).catch(() => undefined);
  return avecDelaiMaximal(lecture, DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}
