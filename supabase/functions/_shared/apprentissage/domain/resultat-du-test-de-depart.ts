import { TestDeDepartDUnAutreEnfant } from "./erreurs.ts";
import type { TestDeDepartTermine } from "./test-de-depart.ts";

export type EtatDuResultatDuTestDeDepart = {
  enfant: string;
  faitLe: Date;
  leconsReussies: ReadonlySet<string>;
};

export class ResultatDuTestDeDepart {
  private constructor(private etat: EtatDuResultatDuTestDeDepart) {}

  static premier(fait: TestDeDepartTermine, leconsReussies: ReadonlySet<string>): ResultatDuTestDeDepart {
    return new ResultatDuTestDeDepart({ enfant: fait.enfant, faitLe: fait.termineeLe, leconsReussies });
  }

  static reconstituer(etat: EtatDuResultatDuTestDeDepart): ResultatDuTestDeDepart {
    return new ResultatDuTestDeDepart({ ...etat });
  }

  get enfant(): string {
    return this.etat.enfant;
  }

  get faitLe(): Date {
    return this.etat.faitLe;
  }

  get leconsReussies(): ReadonlySet<string> {
    return this.etat.leconsReussies;
  }

  enregistrer(fait: TestDeDepartTermine, leconsReussies: ReadonlySet<string>): void {
    if (fait.enfant !== this.enfant) throw new TestDeDepartDUnAutreEnfant();
    this.etat.faitLe = fait.termineeLe;
    this.etat.leconsReussies = new Set([...this.etat.leconsReussies, ...leconsReussies]);
  }
}
