import type { FileDeRevision } from "../../domain/file-de-revision.ts";
import type { ResultatDeLaLecon } from "../../domain/resultat-de-la-lecon.ts";
import type { SeanceTerminee } from "../../domain/seance.ts";

export type IssueDeLEnregistrement = "enregistree" | "dejaEnregistree" | "conflit";

export type FileDeRevisionALEcrire = { readonly file: FileDeRevision; readonly versionLue: number };

export interface SeancesTerminees {
  /**
   * Écrit la séance et le résultat de la leçon d'un seul geste (tout ou rien).
   * `dejaEnregistree` : la séance existait, rien n'est écrit (idempotence).
   * `conflit` : le nombre de séances stocké n'est plus `nombreDeSeancesLu`, ou la version de la file n'est plus
   * `file.versionLue`, rien n'est écrit.
   */
  enregistrerAvecLeResultat(
    fait: SeanceTerminee,
    resultat: ResultatDeLaLecon,
    nombreDeSeancesLu: number,
    file?: FileDeRevisionALEcrire,
  ): Promise<IssueDeLEnregistrement>;

  /** Écrit une séance qui ne touche pas au résultat de la leçon (fluence seule). */
  enregistrerSansResultat(fait: SeanceTerminee): Promise<"enregistree" | "dejaEnregistree">;
}
