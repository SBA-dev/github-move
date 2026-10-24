import type { PlanDuTestDeDepart } from "./plan-du-test-de-depart.ts";
import type { ReponseDonnee } from "./reponse.ts";

export type TestDeDepartTermineAEnregistrer = Readonly<{
  test: string;
  enfant: string;
  questions: PlanDuTestDeDepart;
  tirages: readonly (readonly string[])[];
  reponses: readonly (readonly ReponseDonnee[])[];
  termineeLe: Date;
}>;
