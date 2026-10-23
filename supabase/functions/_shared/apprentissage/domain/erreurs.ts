export class ExerciceIntrouvable extends Error {
  constructor(readonly position: number) {
    super(`Cette leçon n'a pas d'exercice à la position ${position}.`);
    this.name = "ExerciceIntrouvable";
  }
}

export class LeconSansExercice extends Error {
  constructor(readonly lecon: string) {
    super(`La leçon ${lecon} n'a aucun exercice : elle ne peut pas être jouée.`);
    this.name = "LeconSansExercice";
  }
}

export class PasDEtapeDeLeconEnCours extends Error {
  constructor() {
    super("Aucune étape de leçon n'est en cours dans cette séance.");
    this.name = "PasDEtapeDeLeconEnCours";
  }
}

export class PasDeQuestionEnCours extends Error {
  constructor() {
    super("Aucune question n'est en cours dans cette séance.");
    this.name = "PasDeQuestionEnCours";
  }
}

export class SeanceDejaFinie extends Error {
  constructor() {
    super("Cette séance est déjà finie.");
    this.name = "SeanceDejaFinie";
  }
}

export class BonneReponseAbsenteDesChoix extends Error {
  constructor(readonly bonneReponse: string) {
    super(`La bonne réponse « ${bonneReponse} » ne figure pas parmi les choix proposés.`);
    this.name = "BonneReponseAbsenteDesChoix";
  }
}

export class QuestionDejaReussie extends Error {
  constructor() {
    super("Cette question est déjà réussie.");
    this.name = "QuestionDejaReussie";
  }
}

export class ChoixInconnu extends Error {
  constructor(readonly reponse: string) {
    super(`« ${reponse} » ne figure pas parmi les choix proposés.`);
    this.name = "ChoixInconnu";
  }
}

export class JeNeSaisPasDejaDit extends Error {
  constructor() {
    super("« Je ne sais pas » a déjà été dit pour cette question.");
    this.name = "JeNeSaisPasDejaDit";
  }
}

export class SeanceNonFinie extends Error {
  constructor() {
    super("Cette séance a encore des questions à réussir : elle ne peut pas être terminée.");
    this.name = "SeanceNonFinie";
  }
}

export class SeanceDejaTerminee extends Error {
  constructor() {
    super("Cette séance est déjà terminée.");
    this.name = "SeanceDejaTerminee";
  }
}
