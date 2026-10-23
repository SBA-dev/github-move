import type { SeanceTerminee } from "../../domain/seance.ts";

export interface SeancesTerminees {
  /** Renvoie false si la séance était déjà enregistrée (idempotence). */
  enregistrer(fait: SeanceTerminee): Promise<boolean>;
}
