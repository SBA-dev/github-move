import type { SeancesTerminees } from "../application/ports/seances-terminees.ts";
import type { SeanceTerminee } from "../domain/seance.ts";

export class SeancesTermineesEnMemoire implements SeancesTerminees {
  private readonly seances = new Map<string, SeanceTerminee>();

  enregistrer(fait: SeanceTerminee): Promise<boolean> {
    if (this.seances.has(fait.seance)) return Promise.resolve(false);
    this.seances.set(fait.seance, fait);
    return Promise.resolve(true);
  }

  toutes(): SeanceTerminee[] {
    return [...this.seances.values()];
  }
}
