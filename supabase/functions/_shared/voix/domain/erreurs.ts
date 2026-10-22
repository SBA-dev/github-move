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
