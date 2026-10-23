import type { Hasard } from "./hasard.ts";

const FACTEUR_MIN = 6;
const FACTEUR_MAX = 9;

export class QuestionDuControleParental {
  private constructor(
    private readonly premierFacteur: number,
    private readonly secondFacteur: number,
  ) {}

  static tirer(hasard: Hasard): QuestionDuControleParental {
    const premierFacteur = hasard.entierEntre(FACTEUR_MIN, FACTEUR_MAX);
    const secondFacteur = hasard.entierEntre(FACTEUR_MIN, FACTEUR_MAX);
    return new QuestionDuControleParental(premierFacteur, secondFacteur);
  }

  enonce(): string {
    return `combien font ${this.premierFacteur} × ${this.secondFacteur} ?`;
  }

  estBienRepondue(saisie: string): boolean {
    return saisie.trim() === String(this.premierFacteur * this.secondFacteur);
  }
}
