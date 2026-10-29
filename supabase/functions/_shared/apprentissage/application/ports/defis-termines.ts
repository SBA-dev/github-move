import type { DefiReleve } from "../../domain/defis-de-la-matiere.ts";
import type { DefiTermine } from "../../domain/seance-de-defi.ts";
import type { FileDeRevisionALEcrire, IssueDeLEnregistrement } from "./seances-terminees.ts";

export interface DefisTermines {
  /** Les défis relevés du profil (matière, classe, numéro de la partie). */
  releves(enfant: string): Promise<readonly DefiReleve[]>;

  /**
   * Écrit le défi terminé et la file de révision d'un seul geste (tout ou rien).
   * `dejaEnregistree` : le défi (même identifiant) existait, rien n'est écrit (idempotence).
   * `conflit` : la version de la file stockée n'est plus `file.versionLue`, rien n'est écrit.
   */
  enregistrer(fait: DefiTermine, file: FileDeRevisionALEcrire): Promise<IssueDeLEnregistrement>;
}
