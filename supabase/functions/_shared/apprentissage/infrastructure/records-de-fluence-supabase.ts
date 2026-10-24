import type { RecordsDeFluence } from "../application/ports/records-de-fluence.ts";
import type { RecordDeFluence } from "../domain/record-de-fluence.ts";

/** Adaptateur provisoire : la table des records arrive avec le câblage de la base. */
export class RecordsDeFluenceSupabase implements RecordsDeFluence {
  lire(_enfant: string, _lecon: string, _exercice: string): Promise<RecordDeFluence | null> {
    return Promise.reject(new Error("Records de fluence : pas encore câblé."));
  }

  enregistrer(_record: RecordDeFluence): Promise<void> {
    return Promise.reject(new Error("Records de fluence : pas encore câblé."));
  }
}
