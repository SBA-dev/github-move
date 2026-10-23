export class Avancement {
  constructor(readonly questionsReussies: number, readonly total: number) {}

  estComplet(): boolean {
    return this.questionsReussies === this.total;
  }
}
