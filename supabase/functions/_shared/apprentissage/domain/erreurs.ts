export class ExerciceIntrouvable extends Error {
  constructor() {
    super("Cet exercice n'existe pas dans la leçon.");
    this.name = "ExerciceIntrouvable";
  }
}

export class LeconSansExercice extends Error {
  constructor() {
    super("La leçon n'a aucun exercice à jouer.");
    this.name = "LeconSansExercice";
  }
}

export class NombreDeQuestionsInconnu extends Error {
  constructor(type: string) {
    super(`Le nombre de questions d'un exercice « ${type} » n'est pas encore défini.`);
    this.name = "NombreDeQuestionsInconnu";
  }
}
