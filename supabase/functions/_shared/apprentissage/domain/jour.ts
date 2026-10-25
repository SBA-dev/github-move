import { JourInvalide } from "./erreurs.ts";

const FORMAT = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILLISECONDES_PAR_JOUR = 24 * 60 * 60 * 1000;

export class Jour {
  private constructor(private readonly instant: number) {}

  static de(texte: string): Jour {
    const correspondance = FORMAT.exec(texte);
    if (!correspondance) throw new JourInvalide(texte);
    const [annee, mois, jour] = correspondance.slice(1).map(Number);
    const instant = Date.UTC(annee, mois - 1, jour);
    const jourCree = new Jour(instant);
    if (jourCree.toString() !== texte) throw new JourInvalide(texte);
    return jourCree;
  }

  plus(nombreDeJours: number): Jour {
    return new Jour(this.instant + nombreDeJours * MILLISECONDES_PAR_JOUR);
  }

  estAvantOuEgal(autre: Jour): boolean {
    return this.instant <= autre.instant;
  }

  estEgalA(autre: Jour): boolean {
    return this.instant === autre.instant;
  }

  toString(): string {
    return new Date(this.instant).toISOString().slice(0, 10);
  }
}
