import type { RecordDeFluence } from "../../domain/record-de-fluence.ts";

export interface RecordsDeFluence {
  lire(enfant: string, lecon: string, exercice: string): Promise<RecordDeFluence | null>;
  enregistrer(record: RecordDeFluence): Promise<void>;
}
