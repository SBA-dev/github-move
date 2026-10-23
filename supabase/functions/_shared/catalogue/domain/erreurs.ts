export class LeconMalFormee extends Error {
  constructor(readonly raison: string) {
    super(`Cette leçon est mal formée : ${raison}.`);
    this.name = "LeconMalFormee";
  }
}

export class SectionDuProgrammeMalFormee extends Error {
  constructor(raison: string) {
    super(`Cette section du programme est mal formée : ${raison}.`);
    this.name = "SectionDuProgrammeMalFormee";
  }
}

export class NiveauInconnu extends Error {
  constructor(readonly niveau: string) {
    super(`Ce niveau est inconnu : « ${niveau} ».`);
    this.name = "NiveauInconnu";
  }
}
