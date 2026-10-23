import { BonneReponseAbsenteDesChoix } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";

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

  reduireADeux(): ChoixProposes {
    const premierAutre = this.possibles().find((texte) => texte !== this.bonneReponse);
    const gardes = [this.bonneReponse, premierAutre];
    const ecartes = this.affiches.filter((texte) => !gardes.includes(texte));
    return new ChoixProposes(this.affiches, this.bonneReponse, ecartes);
  }
}

function melanger(textes: readonly string[], hasard: Hasard): string[] {
  const melanges = [...textes];
  for (let i = melanges.length - 1; i > 0; i--) {
    const j = Math.floor(hasard.entre0et1() * (i + 1));
    echanger(melanges, i, j);
  }
  return melanges;
}

function echanger(textes: string[], a: number, b: number): void {
  const temporaire = textes[a] as string;
  textes[a] = textes[b] as string;
  textes[b] = temporaire;
}
