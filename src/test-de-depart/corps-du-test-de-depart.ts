import type { PlanDuTestDeDepart, TestDeDepartTermineAEnregistrer } from "@domain/apprentissage";
import { enReponseEnvoyee, type ReponseEnvoyee } from "../seance/fin-de-seance/corps-de-la-seance.ts";

/** Le corps JSON attendu par l'Edge Function `terminer-le-test-de-depart`. */
export type CorpsDuTestDeDepart = {
  readonly test: string;
  readonly enfant: string;
  readonly questions: PlanDuTestDeDepart;
  readonly tirages: readonly (readonly (readonly string[])[])[];
  readonly reponses: readonly (readonly ReponseEnvoyee[])[];
  readonly termineeLe: string;
};

export function enCorpsDuTestDeDepart(envoi: TestDeDepartTermineAEnregistrer): CorpsDuTestDeDepart {
  return {
    test: envoi.test,
    enfant: envoi.enfant,
    questions: envoi.questions,
    tirages: envoi.tirages,
    reponses: envoi.reponses.map((reponses) => reponses.map(enReponseEnvoyee)),
    termineeLe: envoi.termineeLe.toISOString(),
  };
}

export function estUnCorpsDuTestDeDepart(valeur: unknown): valeur is CorpsDuTestDeDepart {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { test, enfant, questions, tirages, reponses, termineeLe } = valeur as Record<string, unknown>;
  return typeof test === "string" && typeof enfant === "string" && Array.isArray(questions) && Array.isArray(tirages) &&
    Array.isArray(reponses) && typeof termineeLe === "string";
}
