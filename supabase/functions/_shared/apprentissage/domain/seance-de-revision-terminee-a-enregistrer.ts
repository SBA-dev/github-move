import type { CleDeQuestion } from "./cle-de-question.ts";
import type { ReponseDonnee } from "./reponse.ts";

export type SeanceDeRevisionTermineeAEnregistrer = Readonly<{
  id: string;
  enfant: string;
  questions: readonly CleDeQuestion[];
  /** Un élément par question : les choix tirés pour elle, dans leur ordre initial. */
  tirages: readonly (readonly string[])[];
  reponses: readonly (readonly ReponseDonnee[])[];
  termineeLe: Date;
  jour: string;
}>;
