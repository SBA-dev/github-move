import type { ResultatDuTestDeDepart } from "../../domain/resultat-du-test-de-depart.ts";

export type IssueDeLEnregistrementDuTestDeDepart = "enregistre" | "dejaEnregistre";

export interface ResultatsDesTestsDeDepart {
  de(enfant: string): Promise<ResultatDuTestDeDepart | null>;

  /** `dejaEnregistre` : ce test de départ était déjà compté, rien n'est écrit (idempotence). */
  enregistrer(resultat: ResultatDuTestDeDepart, test: string): Promise<IssueDeLEnregistrementDuTestDeDepart>;
}
