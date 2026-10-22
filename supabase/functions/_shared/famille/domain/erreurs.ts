export class AdresseEmailInvalide extends Error {
  constructor() {
    super("Cette adresse e-mail n'est pas valide.");
    this.name = "AdresseEmailInvalide";
  }
}
