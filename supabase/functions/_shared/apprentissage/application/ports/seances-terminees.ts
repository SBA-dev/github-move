import type { ResultatDeLaLecon } from "../../domain/resultat-de-la-lecon.ts";
import type { SeanceTerminee } from "../../domain/seance.ts";

export type IssueDeLEnregistrement = "enregistree" | "dejaEnregistree" | "conflit";

export interface SeancesTerminees {
  /**
   * Écrit la séance et le résultat de la leçon d'un seul geste (tout ou rien).
   * `dejaEnregistree` : la séance existait, rien n'est écrit (idempotence).
   * `conflit` : le nombre de séances stocké n'est plus `nombreDeSeancesLu`, rien n'est écrit.
   */
  enregistrerAvecLeResultat(
    fait: SeanceTerminee,
    resultat: ResultatDeLaLecon,
    nombreDeSeancesLu: number,
  ): Promise<IssueDeLEnregistrement>;

  /** Écrit une séance qui ne touche pas au résultat de la leçon (fluence seule). */
  enregistrerSansResultat(fait: SeanceTerminee): Promise<"enregistree" | "dejaEnregistree">;
}
