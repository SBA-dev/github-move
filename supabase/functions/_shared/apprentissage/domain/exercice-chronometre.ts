import type { ExerciceFluence, Operation } from "../../catalogue/domain/index.ts";
import { FluenceFinie, FluenceNonCommencee, TirageManquant } from "./erreurs.ts";
import type { Tireur } from "./tireur.ts";

const MILLISECONDES_PAR_SECONDE = 1000;

export class ExerciceChronometre {
  private debut: Date | undefined;
  private operation: Operation;
  private reussis = 0;
  private fausses = 0;

  private constructor(private readonly exercice: ExerciceFluence, private readonly tireur: Tireur) {
    this.operation = this.tirerUneOperation();
  }

  static pour(exercice: ExerciceFluence, tireur: Tireur): ExerciceChronometre {
    return new ExerciceChronometre(exercice, tireur);
  }

  get score(): number {
    return this.reussis;
  }

  get reponsesFausses(): number {
    return this.fausses;
  }

  get enonce(): string {
    return this.operation.q;
  }

  demarrer(maintenant: Date): void {
    this.debut = maintenant;
  }

  tempsRestant(maintenant: Date): number {
    return this.exercice.duree - this.secondesEcoulees(maintenant);
  }

  estFinie(maintenant: Date): boolean {
    return this.tempsRestant(maintenant) <= 0;
  }

  repondre(nombre: number, maintenant: Date): "juste" | "fausse" {
    if (this.estFinie(maintenant)) throw new FluenceFinie();
    if (nombre !== this.operation.r) {
      this.fausses++;
      return "fausse";
    }
    this.reussis++;
    this.operation = this.tirerUneOperation();
    return "juste";
  }

  private secondesEcoulees(maintenant: Date): number {
    if (this.debut === undefined) throw new FluenceNonCommencee();
    return (maintenant.getTime() - this.debut.getTime()) / MILLISECONDES_PAR_SECONDE;
  }

  private tirerUneOperation(): Operation {
    const [operation] = this.tireur.operations({ ...this.exercice.generateur, combien: 1 });
    if (operation === undefined) throw new TirageManquant();
    return operation;
  }
}
