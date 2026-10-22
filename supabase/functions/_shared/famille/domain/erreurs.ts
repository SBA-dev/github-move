export class AdresseEmailInvalide extends Error {
  constructor() {
    super("Cette adresse e-mail n'est pas valide.");
    this.name = "AdresseEmailInvalide";
  }
}

export class CodeDeConnexionMalForme extends Error {
  constructor() {
    super("Le code de connexion doit avoir 6 chiffres.");
    this.name = "CodeDeConnexionMalForme";
  }
}
