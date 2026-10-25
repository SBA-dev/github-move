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

export class LeconImpossibleAPreparer extends Error {
  constructor() {
    super("Ce texte ne permet pas de préparer une leçon.");
    this.name = "LeconImpossibleAPreparer";
  }
}

export class AucuneSectionDuProgramme extends Error {
  constructor() {
    super("Aucune section du programme pour cette classe et cette matière.");
    this.name = "AucuneSectionDuProgramme";
  }
}
