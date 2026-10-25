import type { PlanDuTestDeDepart } from "./plan-du-test-de-depart.ts";
import type { ReponseDonnee } from "./reponse.ts";

export type TestDeDepartTermineAEnregistrer = Readonly<{
  test: string;
  enfant: string;
  questions: PlanDuTestDeDepart;
  /** Un élément par question du plan : les tirages consommés pour elle, dans l'ordre. */
  tirages: readonly (readonly (readonly string[])[])[];
  reponses: readonly (readonly ReponseDonnee[])[];
  termineeLe: Date;
}>;
