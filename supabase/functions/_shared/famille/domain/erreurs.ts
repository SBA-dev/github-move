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

export class LienDeConnexionMalForme extends Error {
  constructor() {
    super("Le lien de connexion doit être une adresse web absolue.");
    this.name = "LienDeConnexionMalForme";
  }
}

export class EnvoiDeLEmailImpossible extends Error {
  constructor() {
    super("L'e-mail de connexion n'a pas pu être envoyé.");
    this.name = "EnvoiDeLEmailImpossible";
  }
}

export class PrenomObligatoire extends Error {
  constructor() {
    super("Écris le prénom de l'enfant.");
    this.name = "PrenomObligatoire";
  }
}

export class UniversInconnu extends Error {
  constructor(readonly cle: string) {
    super(`Cet univers est inconnu : « ${cle} ».`);
    this.name = "UniversInconnu";
  }
}

export class ProfilEnfantIdVide extends Error {
  constructor() {
    super("L'identifiant du profil enfant ne peut pas être vide.");
    this.name = "ProfilEnfantIdVide";
  }
}
