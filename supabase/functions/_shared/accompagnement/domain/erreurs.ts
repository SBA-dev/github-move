export class TexteTropCourt extends Error {
  constructor() {
    super("Colle d'abord un texte.");
    this.name = "TexteTropCourt";
  }
}

export class TexteTropLong extends Error {
  constructor() {
    super("Ton texte est trop long : 3000 caractères au plus.");
    this.name = "TexteTropLong";
  }
}
