export class ExerciceJoue {
  private reussies = 0;

  constructor(
    readonly position: number,
    readonly titre: string | undefined,
    readonly questions: number,
  ) {}

  get questionsReussies(): number {
    return this.reussies;
  }

  reussirUneQuestion(): void {
    this.reussies++;
  }

  estReussi(): boolean {
    return this.reussies >= this.questions;
  }
}
