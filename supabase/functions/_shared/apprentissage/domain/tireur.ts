import { ChoixProposes } from "./choix-proposes.ts";
import { TirageInvalide, TirageManquant } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { melanger } from "./melange.ts";

const NOMBRE_DE_MOTS_EN_PLUS = 2;

export interface Tireur {
  choix(choix: readonly string[], bonneReponse: string): ChoixProposes;
  trou(motAttendu: string, candidats: readonly string[]): ChoixProposes;
  plateau(etiquettes: readonly string[]): string[];
}

export function tireurAuHasard(hasard: Hasard): Tireur {
  return {
    choix: (choix, bonneReponse) => ChoixProposes.proposer(choix, bonneReponse, hasard),
    trou: (motAttendu, candidats) =>
      ChoixProposes.proposer([motAttendu, ...motsEnPlus(candidats, hasard)], motAttendu, hasard),
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
    trou: (motAttendu, candidats) => {
      const tirage = prochainTirage();
      if (!estUnTirageDeTrou(tirage, motAttendu, candidats)) throw new TirageInvalide();
      return ChoixProposes.depuisTirage(tirage, motAttendu, tirage);
    },
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

function estUnTirageDeTrou(tirage: readonly string[], motAttendu: string, candidats: readonly string[]): boolean {
  const autres = tirage.filter((mot) => mot !== motAttendu);
  return tirage.length - autres.length === 1 &&
    autres.length === Math.min(NOMBRE_DE_MOTS_EN_PLUS, candidats.length) &&
    new Set(autres).size === autres.length &&
    autres.every((mot) => candidats.includes(mot));
}

function motsEnPlus(candidats: readonly string[], hasard: Hasard): string[] {
  if (candidats.length <= NOMBRE_DE_MOTS_EN_PLUS) return [...candidats];
  return melanger(candidats, hasard).slice(0, NOMBRE_DE_MOTS_EN_PLUS);
}
