export type IssueDuRecord = "premierRecord" | "nouveauRecord" | "recordInchange" | "aucunRecord";

export type FaitDeRecord = {
  type: "NouveauRecordDeFluence";
  enfant: string;
  lecon: string;
  exercice: string;
  ancienRecord: number;
  nouveauRecord: number;
};

export type EtatDuRecord = {
  enfant: string;
  lecon: string;
  exercice: string;
  meilleurScore?: number;
};

export class RecordDeFluence {
  private faits: FaitDeRecord[] = [];

  private constructor(private etat: EtatDuRecord) {}

  static commencer(enfant: string, lecon: string, exercice: string): RecordDeFluence {
    return new RecordDeFluence({ enfant, lecon, exercice });
  }

  static reconstituer(etat: EtatDuRecord): RecordDeFluence {
    return new RecordDeFluence({ ...etat });
  }

  get enfant(): string {
    return this.etat.enfant;
  }

  get lecon(): string {
    return this.etat.lecon;
  }

  get exercice(): string {
    return this.etat.exercice;
  }

  get meilleurScore(): number | undefined {
    return this.etat.meilleurScore;
  }

  proposer(score: number): IssueDuRecord {
    if (score <= 0) return "aucunRecord";

    const ancienRecord = this.etat.meilleurScore;
    if (ancienRecord === undefined) {
      this.etat.meilleurScore = score;
      return "premierRecord";
    }
    if (score <= ancienRecord) return "recordInchange";

    this.etat.meilleurScore = score;
    this.faits.push({
      type: "NouveauRecordDeFluence",
      enfant: this.enfant,
      lecon: this.lecon,
      exercice: this.exercice,
      ancienRecord,
      nouveauRecord: score,
    });
    return "nouveauRecord";
  }

  retirerFaits(): FaitDeRecord[] {
    const faits = this.faits;
    this.faits = [];
    return faits;
  }
}
