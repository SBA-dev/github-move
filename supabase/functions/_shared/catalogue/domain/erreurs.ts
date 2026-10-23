export class TypeDExerciceInconnu extends Error {
  constructor() {
    super("Ce type d'exercice n'existe pas.");
    this.name = "TypeDExerciceInconnu";
  }
}

export class MatiereInconnue extends Error {
  constructor() {
    super("Cette matière n'existe pas.");
    this.name = "MatiereInconnue";
  }
}

export class NiveauInconnu extends Error {
  constructor() {
    super("Ce niveau n'existe pas.");
    this.name = "NiveauInconnu";
  }
}

export class LeconMalFormee extends Error {
  constructor(detail: string) {
    super(`La leçon est mal formée : ${detail}.`);
    this.name = "LeconMalFormee";
  }
}
