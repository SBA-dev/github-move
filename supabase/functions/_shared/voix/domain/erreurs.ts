export class VoixBloquee extends Error {
  constructor() {
    super("Le navigateur refuse de lire à voix haute.");
    this.name = "VoixBloquee";
  }
}

export class LectureImpossible extends Error {
  constructor() {
    super("Le navigateur ne sait pas lire à voix haute.");
    this.name = "LectureImpossible";
  }
}

export class VoixIndisponible extends Error {
  constructor() {
    super("Cet appareil n'a pas de voix française et la phrase n'est pas enregistrée.");
    this.name = "VoixIndisponible";
  }
}
