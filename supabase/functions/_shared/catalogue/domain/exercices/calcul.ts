import { enObjet, liste, nombreRequis, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";
import { LeconMalFormee } from "../erreurs.ts";

const COMBIEN_PAR_DEFAUT = 5;
const INTERVALLE_PAR_DEFAUT: Intervalle = [1, 10];

export type Intervalle = readonly [number, number];

export type Operation = Readonly<{ q: string; r: number; aide?: string }>;

export type GenerateurDOperations = Readonly<{
  op?: string;
  a?: Intervalle;
  b?: Intervalle;
  cible?: number;
  combien?: number;
}>;

export type ExerciceCalcul = Readonly<{
  type: "calcul";
  titre?: string;
  consigne?: string;
  operations?: readonly Operation[];
  generateur?: GenerateurDOperations;
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

function lireGenerateur(brut: unknown): GenerateurDOperations {
  if (brut === undefined) {
    return Object.freeze({ op: "+", a: INTERVALLE_PAR_DEFAUT, b: INTERVALLE_PAR_DEFAUT, combien: COMBIEN_PAR_DEFAUT });
  }
  const generateur = enObjet(brut, "le générateur");
  return Object.freeze({
    ...(generateur.op === undefined ? {} : { op: texteRequis(generateur.op, "le signe du générateur") }),
    ...(generateur.a === undefined ? {} : { a: lireIntervalle(generateur.a) }),
    ...(generateur.b === undefined ? {} : { b: lireIntervalle(generateur.b) }),
    ...(generateur.cible === undefined ? {} : { cible: nombreRequis(generateur.cible, "la cible du générateur") }),
    ...(generateur.combien === undefined
      ? {}
      : { combien: nombreRequis(generateur.combien, "le nombre d'opérations du générateur") }),
  });
}

function lireIntervalle(brut: unknown): Intervalle {
  const bornes = liste(brut, "un intervalle du générateur").map((borne) =>
    nombreRequis(borne, "une borne du générateur")
  );
  const [min, max] = bornes;
  if (bornes.length !== 2 || min === undefined || max === undefined) {
    throw new LeconMalFormee("un intervalle du générateur n'a pas deux bornes");
  }
  return Object.freeze([min, max] as const);
}
