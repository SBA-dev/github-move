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

export class AucuneCitationDansLaSection extends Error {
  constructor() {
    super("Aucune phrase lisible dans cette section du programme.");
    this.name = "AucuneCitationDansLaSection";
  }
}

export class LeconPersonnelleInvalide extends Error {
  constructor(readonly raison: string) {
    super(`La leçon personnelle est invalide : ${raison}.`);
    this.name = "LeconPersonnelleInvalide";
  }
}

export class ParentNonRattache extends Error {
  constructor() {
    super("Ce parent n'est pas rattaché à ce profil.");
    this.name = "ParentNonRattache";
  }
}
