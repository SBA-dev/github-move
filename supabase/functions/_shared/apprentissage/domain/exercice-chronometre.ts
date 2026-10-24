import type { ExerciceFluence, Operation } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { FluenceFinie, FluenceNonCommencee, TirageManquant } from "./erreurs.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { ReponseDonnee } from "./reponse.ts";
import { carteDuCalcul } from "./exercices/phrases-du-calcul.ts";
import { enonceTire } from "./tirage-d-operations.ts";
import type { Tireur } from "./tireur.ts";

export type FluenceEnCours = Readonly<{
  carte: string;
  tempsRestant: number;
  score: number;
  demarree: boolean;
  finie: boolean;
  jeNeSaisPasPropose: false;
}>;

const MILLISECONDES_PAR_SECONDE = 1000;

export class ExerciceChronometre implements QuestionSuivie {
  readonly type = "fluence";
  readonly cle: CleDeQuestion;
  readonly erreurs = 0;
  readonly bonneReponseMontree = false;
  private debut: Date | undefined;
  private operation: Operation;
  private reussis = 0;
  private fausses = 0;
  private tempsEcoule = false;
  private readonly operationsTirees: Operation[] = [];
  private readonly reponsesDonnees: ReponseDonnee[] = [];

  private constructor(private readonly exercice: ExerciceFluence, private readonly tireur: Tireur) {
    this.cle = CleDeQuestion.de("fluence", this.nom);
    this.operation = this.tirerUneOperation();
  }

  static pour(exercice: ExerciceFluence, tireur: Tireur): ExerciceChronometre {
    return new ExerciceChronometre(exercice, tireur);
  }

  get nom(): string {
    return this.exercice.titre ?? this.exercice.generateur.op;
  }

  get reussie(): boolean {
    return this.tempsEcoule;
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

  reponses(): ReponseDonnee[] {
    return [...this.reponsesDonnees];
  }

  tirages(): string[][] {
    return this.operationsTirees.map((operation) => [enonceTire(operation)]);
  }

  finir(): void {
    this.tempsEcoule = true;
  }

  demarrer(maintenant: Date): void {
    this.debut = maintenant;
  }

  tempsRestant(maintenant: Date): number {
    return this.exercice.duree - this.secondesEcoulees(maintenant);
  }

  enCours(maintenant: Date): FluenceEnCours {
    const demarree = this.debut !== undefined;
    return {
      carte: carteDuCalcul(this.operation),
      tempsRestant: demarree ? Math.max(0, Math.ceil(this.tempsRestant(maintenant))) : this.exercice.duree,
      score: this.reussis,
      demarree,
      finie: this.tempsEcoule || (demarree && this.estFinie(maintenant)),
      jeNeSaisPasPropose: false,
    };
  }

  estFinie(maintenant: Date): boolean {
    return this.tempsRestant(maintenant) <= 0;
  }

  repondre(nombre: number, maintenant: Date): "juste" | "fausse" {
    if (this.estFinie(maintenant)) throw new FluenceFinie();
    this.reponsesDonnees.push({ genre: "nombre", valeur: nombre });
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
    this.operationsTirees.push(operation);
    return operation;
  }
}
