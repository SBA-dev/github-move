import type { ResultatDuTestDeDepart } from "../../domain/resultat-du-test-de-depart.ts";

export type IssueDeLEnregistrementDuTestDeDepart = "enregistre" | "dejaEnregistre";

export interface ResultatsDesTestsDeDepart {
  de(enfant: string): Promise<ResultatDuTestDeDepart | null>;

  /**
   * Réunit les leçons du résultat avec ce qui est déjà enregistré pour l'enfant et garde le `faitLe` le plus récent,
   * de façon atomique (deux envois concurrents ne s'écrasent pas).
   * `dejaEnregistre` : l'identifiant du test est déjà connu, rien n'est écrit (idempotence).
   */
  enregistrer(resultat: ResultatDuTestDeDepart, test: string): Promise<IssueDeLEnregistrementDuTestDeDepart>;
}
