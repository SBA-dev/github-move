import { Jour, type SeanceDeRevisionTermineeAEnregistrer } from "@domain/apprentissage";
import { enReponseEnvoyee, type ReponseEnvoyee } from "../seance/fin-de-seance/corps-de-la-seance.ts";

/** Le corps JSON attendu par l'Edge Function `terminer-la-seance-de-revision`. */
export type CorpsDeLaSeanceDeRevision = {
  readonly id: string;
  readonly enfant: string;
  readonly questions: readonly string[];
  readonly tirages: readonly (readonly string[])[];
  readonly reponses: readonly (readonly ReponseEnvoyee[])[];
  readonly termineeLe: string;
  readonly jour: string;
};

export function enCorpsDeLaSeanceDeRevision(envoi: SeanceDeRevisionTermineeAEnregistrer): CorpsDeLaSeanceDeRevision {
  return {
    id: envoi.id,
    enfant: envoi.enfant,
    questions: envoi.questions.map(({ valeur }) => valeur),
    tirages: envoi.tirages,
    reponses: envoi.reponses.map((reponses) => reponses.map(enReponseEnvoyee)),
    termineeLe: envoi.termineeLe.toISOString(),
    jour: envoi.jour,
  };
}

function estUnJourValide(valeur: unknown): boolean {
  if (typeof valeur !== "string") return false;
  try {
    Jour.de(valeur);
    return true;
  } catch {
    return false;
  }
}

export function estUnCorpsDeSeanceDeRevision(valeur: unknown): valeur is CorpsDeLaSeanceDeRevision {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { id, enfant, questions, tirages, reponses, termineeLe, jour } = valeur as Record<string, unknown>;
  return typeof id === "string" && typeof enfant === "string" && Array.isArray(questions) && Array.isArray(tirages) &&
    Array.isArray(reponses) && typeof termineeLe === "string" && estUnJourValide(jour);
}
