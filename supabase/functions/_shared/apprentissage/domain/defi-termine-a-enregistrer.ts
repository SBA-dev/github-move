import type { Matiere, Niveau } from "../../catalogue/domain/index.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { ReponseDonnee } from "./reponse.ts";

export type DefiTermineAEnregistrer = Readonly<{
  id: string;
  enfant: string;
  defi: Readonly<{ matiere: Matiere; niveau: Niveau; numero: number }>;
  questions: readonly CleDeQuestion[];
  /** Un élément par question : les choix tirés pour elle, dans leur ordre initial. */
  tirages: readonly (readonly string[])[];
  reponses: readonly (readonly ReponseDonnee[])[];
  termineeLe: Date;
  jour: string;
}>;
