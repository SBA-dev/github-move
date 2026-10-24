import { enObjet, liste, nombreRequis, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";
import { LeconMalFormee } from "../erreurs.ts";
import { type GenerateurComplet, lireGenerateur } from "./generateur-d-operations.ts";

export type Operation = Readonly<{ q: string; r: number; aide?: string }>;

export type ExerciceCalcul = Readonly<{
  type: "calcul";
  titre?: string;
  consigne?: string;
  operations?: readonly Operation[];
  generateur?: GenerateurComplet;
}>;

export function lireCalcul(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceCalcul {
  const operations = brut.operations === undefined
    ? undefined
    : liste(brut.operations, "les opérations").map(lireOperation);
  const generateur = operations === undefined ? lireGenerateur(brut.generateur) : undefined;
  return Object.freeze({
    type: "calcul",
    ...communs,
    operations: operations && Object.freeze(operations),
    generateur,
  });
}

function lireOperation(brut: unknown): Operation {
  const operation = enObjet(brut, "une opération");
  const r = nombreRequis(operation.r, "le résultat d'une opération");
  if (!Number.isInteger(r) || r < 0) {
    throw new LeconMalFormee("le résultat d'une opération n'est pas un entier positif");
  }
  return Object.freeze({
    q: texteRequis(operation.q, "l'énoncé d'une opération"),
    r,
    aide: texteFacultatif(operation.aide, "l'aide d'une opération"),
  });
}
