import { ChoixProposes } from "./choix-proposes.ts";
import { TirageInvalide, TirageManquant } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { melanger } from "./melange.ts";

export interface Tireur {
  choix(choix: readonly string[], bonneReponse: string): ChoixProposes;
  plateau(etiquettes: readonly string[]): string[];
}

export function tireurAuHasard(hasard: Hasard): Tireur {
  return {
    choix: (choix, bonneReponse) => ChoixProposes.proposer(choix, bonneReponse, hasard),
    plateau: (etiquettes) => melanger(etiquettes, hasard),
  };
}

export function tireurSelonLesTirages(tirages: Iterator<readonly string[]>): Tireur {
  const prochainTirage = (): readonly string[] => {
    const suivant = tirages.next();
    if (suivant.done) throw new TirageManquant();
    return suivant.value;
  };
  return {
    choix: (choix, bonneReponse) => ChoixProposes.depuisTirage(choix, bonneReponse, prochainTirage()),
    plateau: (etiquettes) => {
      const tirage = prochainTirage();
      if (!memesEtiquettes(etiquettes, tirage)) throw new TirageInvalide();
      return [...tirage];
    },
  };
}

function memesEtiquettes(attendues: readonly string[], tirage: readonly string[]): boolean {
  return [...attendues].sort().join("\n") === [...tirage].sort().join("\n");
}
