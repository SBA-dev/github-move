import { RecordDeFluence } from "../domain/record-de-fluence.ts";

function copie(record: RecordDeFluence): RecordDeFluence {
  return RecordDeFluence.reconstituer({
    enfant: record.enfant,
    lecon: record.lecon,
    exercice: record.exercice,
    meilleurScore: record.meilleurScore,
  });
}

export class RecordsDeFluenceEnMemoire {
  private readonly records = new Map<string, RecordDeFluence>();
  private ecritures = 0;
  private ecritureEnEchec = false;

  lire(enfant: string, lecon: string, exercice: string): Promise<RecordDeFluence | null> {
    const record = this.records.get(JSON.stringify([enfant, lecon, exercice]));
    return Promise.resolve(record ? copie(record) : null);
  }

  echouerALaProchaineEcriture(): void {
    this.ecritureEnEchec = true;
  }

  enregistrer(record: RecordDeFluence): Promise<void> {
    if (this.ecritureEnEchec) {
      this.ecritureEnEchec = false;
      return Promise.reject(new Error("Écriture du record impossible"));
    }
    this.records.set(JSON.stringify([record.enfant, record.lecon, record.exercice]), copie(record));
    this.ecritures++;
    return Promise.resolve();
  }

  nombreDEcritures(): number {
    return this.ecritures;
  }
}
