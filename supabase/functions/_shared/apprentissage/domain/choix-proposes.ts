import { BonneReponseAbsenteDesChoix, TirageInvalide } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { melanger } from "./melange.ts";

export class ChoixProposes {
  private constructor(
    private readonly affiches: readonly string[],
    private readonly bonneReponse: string,
    private readonly ecartesDuJeu: readonly string[],
  ) {}

  static proposer(choix: readonly string[], bonneReponse: string, hasard: Hasard): ChoixProposes {
    const distincts = [...new Set(choix)];
    if (!distincts.includes(bonneReponse)) throw new BonneReponseAbsenteDesChoix(bonneReponse);
    return new ChoixProposes(melanger(distincts, hasard), bonneReponse, []);
  }

  static depuisTirage(choix: readonly string[], bonneReponse: string, tirage: readonly string[]): ChoixProposes {
    const distincts = [...new Set(choix)];
    if (!distincts.includes(bonneReponse)) throw new BonneReponseAbsenteDesChoix(bonneReponse);
    const estUnePermutation = tirage.length === distincts.length && distincts.every((texte) => tirage.includes(texte));
    if (!estUnePermutation) throw new TirageInvalide();
    return new ChoixProposes([...tirage], bonneReponse, []);
  }

  textes(): string[] {
    return [...this.affiches];
  }

  ecartes(): string[] {
    return [...this.ecartesDuJeu];
  }

  possibles(): string[] {
    return this.affiches.filter((texte) => !this.ecartesDuJeu.includes(texte));
  }

  ecarter(texte: string): ChoixProposes {
    return new ChoixProposes(this.affiches, this.bonneReponse, [...this.ecartesDuJeu, texte]);
  }

  reduireALaBonneReponse(): ChoixProposes {
    const ecartes = this.affiches.filter((texte) => texte !== this.bonneReponse);
    return new ChoixProposes(this.affiches, this.bonneReponse, ecartes);
  }

  reduireADeux(): ChoixProposes {
    const premierAutre = this.possibles().find((texte) => texte !== this.bonneReponse);
    const gardes = [this.bonneReponse, premierAutre];
    const ecartes = this.affiches.filter((texte) => !gardes.includes(texte));
    return new ChoixProposes(this.affiches, this.bonneReponse, ecartes);
  }
}
