import type { SeanceDeRevisionTerminee } from "../../domain/seance-de-revision.ts";
import type { FileDeRevisionALEcrire, IssueDeLEnregistrement } from "./seances-terminees.ts";

export interface SeancesDeRevisionTerminees {
  /**
   * Écrit la séance de révision et la file d'un seul geste (tout ou rien).
   * `dejaEnregistree` : la séance existait, rien n'est écrit (idempotence).
   * `conflit` : la version de la file stockée n'est plus `file.versionLue`, rien n'est écrit.
   */
  enregistrer(fait: SeanceDeRevisionTerminee, file: FileDeRevisionALEcrire): Promise<IssueDeLEnregistrement>;
}
