export class LeconMalFormee extends Error {
  constructor(raison: string) {
    super(`Cette leçon est mal formée : ${raison}.`);
    this.name = "LeconMalFormee";
  }
}
