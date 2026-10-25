export class TexteTropCourt extends Error {
  constructor() {
    super("Colle d'abord un texte.");
    this.name = "TexteTropCourt";
  }
}

export class TexteTropLong extends Error {
  constructor() {
    super("Ce texte est trop long : colle-en une partie seulement.");
    this.name = "TexteTropLong";
  }
}
