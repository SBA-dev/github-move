import type { GenerateurComplet, GenerateurDAdditions, Operation } from "../../catalogue/domain/index.ts";
import { ChoixProposes } from "./choix-proposes.ts";
import { TirageInvalide, TirageManquant } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { melanger } from "./melange.ts";
import { relireLesAdditions, tirerLesAdditions } from "./tirage-d-additions.ts";
import { relireLesOperations, tirerLesOperations } from "./tirage-d-operations.ts";

const NOMBRE_DE_MOTS_EN_PLUS = 2;

export interface Tireur {
  choix(choix: readonly string[], bonneReponse: string): ChoixProposes;
  trou(motAttendu: string, candidats: readonly string[]): ChoixProposes;
  etiquettesMelangees(etiquettes: readonly string[]): string[];
  operations(generateur: GenerateurComplet): readonly Operation[];
  /** Les calculs d'une fluence : la facilité de l'adaptation de la difficulté ne s'y applique pas. */
  operationsDeFluence(generateur: GenerateurComplet): readonly Operation[];
  additions(generateur: GenerateurDAdditions): readonly (readonly number[])[];
}

export function tireurAuHasard(hasard: Hasard, facilite = 1): Tireur {
  return {
    choix: (choix, bonneReponse) => ChoixProposes.proposer(choix, bonneReponse, hasard),
    trou: (motAttendu, candidats) =>
      ChoixProposes.proposer([motAttendu, ...motsEnPlus(candidats, hasard)], motAttendu, hasard),
    etiquettesMelangees: (etiquettes) => melanger(etiquettes, hasard),
    operations: (generateur) => tirerLesOperations(generateur, hasard, facilite),
    operationsDeFluence: (generateur) => tirerLesOperations(generateur, hasard),
    additions: (generateur) => tirerLesAdditions(generateur, hasard),
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
    etiquettesMelangees: (etiquettes) => {
      const tirage = prochainTirage();
      if (!memesEtiquettes(etiquettes, tirage)) throw new TirageInvalide();
      return [...tirage];
    },
    operations: (generateur) => relireLesOperations(generateur, prochainTirage()),
    operationsDeFluence: (generateur) => relireLesOperations(generateur, prochainTirage()),
    additions: (generateur) => relireLesAdditions(generateur, prochainTirage()),
  };
}

function memesEtiquettes(attendues: readonly string[], tirage: readonly string[]): boolean {
  const attenduesTriees = [...attendues].sort();
  const tirageTrie = [...tirage].sort();
  return attenduesTriees.length === tirageTrie.length &&
    attenduesTriees.every((etiquette, rang) => etiquette === tirageTrie[rang]);
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
