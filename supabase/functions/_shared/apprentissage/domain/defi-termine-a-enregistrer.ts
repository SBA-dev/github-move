import type { DefiReleve } from "./defis-de-la-matiere.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { ReponseDonnee } from "./reponse.ts";

export type DefiTermineAEnregistrer = Readonly<{
  id: string;
  enfant: string;
  defi: DefiReleve;
  questions: readonly CleDeQuestion[];
  /** Un élément par question : les choix tirés pour elle, dans leur ordre initial. */
  tirages: readonly (readonly string[])[];
  reponses: readonly (readonly ReponseDonnee[])[];
  termineeLe: Date;
  jour: string;
}>;
