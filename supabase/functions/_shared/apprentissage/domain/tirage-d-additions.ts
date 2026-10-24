import { type GenerateurDAdditions, LeconMalFormee } from "../../catalogue/domain/index.ts";
import { TirageHorsDuGenerateur } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { tirerUnEntier } from "./tirage-d-un-entier.ts";

const SEPARATEUR = " + ";
const UNITES_POUR_UNE_RETENUE = 10;

type Addition = readonly number[];

export function tirerLesAdditions(generateur: GenerateurDAdditions, hasard: Hasard): readonly Addition[] {
  const nombresPossibles = lesNombresPossibles(generateur);
  const plusGrandeUnite = Math.max(...nombresPossibles.map(unites));
  if (generateur.retenue && generateur.nombres * plusGrandeUnite < UNITES_POUR_UNE_RETENUE) {
    throw new LeconMalFormee("le générateur d'additions ne permet aucune retenue");
  }
  return Array.from(
    { length: generateur.combien },
    () => tirerUneAddition(generateur, nombresPossibles, plusGrandeUnite, hasard),
  );
}

function tirerUneAddition(
  { nombres, retenue }: GenerateurDAdditions,
  nombresPossibles: readonly number[],
  plusGrandeUnite: number,
  hasard: Hasard,
): Addition {
  const addition: number[] = [];
  let unitesAtteintes = 0;
  for (let reste = nombres - 1; reste >= 0; reste--) {
    const unitesRequises = retenue ? UNITES_POUR_UNE_RETENUE - unitesAtteintes - reste * plusGrandeUnite : 0;
    const candidats = nombresPossibles.filter((nombre) => unites(nombre) >= unitesRequises);
    const nombre = candidats[tirerUnEntier([0, candidats.length - 1], hasard)] as number;
    addition.push(nombre);
    unitesAtteintes += unites(nombre);
  }
  return addition;
}

function lesNombresPossibles({ min, max }: GenerateurDAdditions): readonly number[] {
  return Array.from({ length: max - min + 1 }, (_, decalage) => min + decalage);
}

function unites(nombre: number): number {
  return nombre % 10;
}

export function relireLesAdditions(generateur: GenerateurDAdditions, tirage: readonly string[]): readonly Addition[] {
  if (tirage.length !== generateur.combien) throw new TirageHorsDuGenerateur(tirage.join(", "));
  return tirage.map((ligne) => {
    const addition = lireUneAddition(ligne);
    if (!estConforme(generateur, addition)) throw new TirageHorsDuGenerateur(ligne);
    return addition;
  });
}

function lireUneAddition(ligne: string): Addition {
  return /^\d+( \+ \d+)*$/.test(ligne) ? ligne.split(SEPARATEUR).map(Number) : [];
}

function estConforme({ nombres, min, max, retenue }: GenerateurDAdditions, addition: Addition): boolean {
  const somme = addition.reduce((total, nombre) => total + unites(nombre), 0);
  return addition.length === nombres &&
    addition.every((nombre) => nombre >= min && nombre <= max) &&
    (!retenue || somme >= UNITES_POUR_UNE_RETENUE);
}
