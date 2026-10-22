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

export class CodeDeConnexionInvalide extends Error {
  constructor() {
    super("Ce code de connexion ne marche pas ou plus.");
    this.name = "CodeDeConnexionInvalide";
  }
}
