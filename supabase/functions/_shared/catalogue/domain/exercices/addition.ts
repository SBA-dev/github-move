import { enObjet, liste, nombreRequis, type Objet } from "../lecture.ts";
import { LeconMalFormee } from "../erreurs.ts";

const ETAPES = ["poser", "calculer"] as const;
const SOMME_MAXIMALE_EXCLUE = 1000;
const UNITES_POUR_UNE_RETENUE = 10;

const GENERATEUR_PAR_DEFAUT: GenerateurDAdditions = Object.freeze({
  nombres: 2,
  min: 10,
  max: 99,
  retenue: false,
  combien: 3,
});
const GENERATEUR_SANS_OPERATIONS: GenerateurDAdditions = Object.freeze({
  nombres: 2,
  min: 12,
  max: 59,
  retenue: true,
  combien: 3,
});

export type EtapeDAddition = typeof ETAPES[number];

export type Addition = readonly number[];

export type GenerateurDAdditions = Readonly<{
  nombres: number;
  min: number;
  max: number;
  retenue: boolean;
  combien: number;
}>;

export type ExerciceAddition = Readonly<{
  type: "addition";
  titre?: string;
  consigne?: string;
  operations?: readonly Addition[];
  generateur?: GenerateurDAdditions;
  etapes: readonly EtapeDAddition[];
}>;

export function lireAddition(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceAddition {
  const operations = brut.operations === undefined ? undefined : Object.freeze(lireOperations(brut.operations));
  const generateur = operations === undefined ? lireGenerateurDAdditions(brut.generateur) : undefined;
  return Object.freeze({
    type: "addition",
    ...communs,
    operations,
    generateur,
    etapes: lireEtapes(brut.etapes),
  });
}

function lireOperations(brut: unknown): readonly Addition[] {
  const operations = liste(brut, "les opérations").map(lireOperation);
  if (operations.length === 0) throw new LeconMalFormee("l'exercice « addition » n'a aucune opération");
  return operations;
}

function lireOperation(brut: unknown): Addition {
  const nombres = liste(brut, "une opération").map(lireEntierPositif);
  if (nombres.length < 2) throw new LeconMalFormee("une opération d'addition a moins de deux nombres");
  if (nombres.reduce((somme, nombre) => somme + nombre, 0) >= SOMME_MAXIMALE_EXCLUE) {
    throw new LeconMalFormee("la somme d'une opération d'addition atteint 1 000");
  }
  return Object.freeze(nombres);
}

function lireEntierPositif(brut: unknown): number {
  const nombre = nombreRequis(brut, "un nombre d'une opération d'addition");
  if (!Number.isInteger(nombre) || nombre < 0) {
    throw new LeconMalFormee("un nombre d'une opération d'addition n'est pas un entier positif");
  }
  return nombre;
}

function lireEtapes(brut: unknown): readonly EtapeDAddition[] {
  if (brut === undefined) return ETAPES;
  const etapes = liste(brut, "les étapes d'une addition").map((etape) => {
    const connue = ETAPES.find((nom) => nom === etape);
    if (connue === undefined) throw new LeconMalFormee("une étape d'addition est inconnue");
    return connue;
  });
  return Object.freeze(etapes);
}

function lireGenerateurDAdditions(brut: unknown): GenerateurDAdditions {
  if (brut === undefined) return GENERATEUR_SANS_OPERATIONS;
  const generateur = enObjet(brut, "le générateur");
  const lu: GenerateurDAdditions = Object.freeze({
    nombres: lireEntier(generateur.nombres, GENERATEUR_PAR_DEFAUT.nombres, 2, "le nombre de termes du générateur"),
    min: lireEntier(generateur.min, GENERATEUR_PAR_DEFAUT.min, 0, "la borne minimale du générateur"),
    max: lireEntier(generateur.max, GENERATEUR_PAR_DEFAUT.max, 0, "la borne maximale du générateur"),
    retenue: lireRetenue(generateur.retenue),
    combien: lireEntier(generateur.combien, GENERATEUR_PAR_DEFAUT.combien, 1, "le nombre d'opérations du générateur"),
  });
  if (lu.min > lu.max) throw new LeconMalFormee("les bornes du générateur d'additions sont inversées");
  if (lu.nombres * lu.max >= SOMME_MAXIMALE_EXCLUE) {
    throw new LeconMalFormee("le générateur d'additions peut tirer une somme d'au moins 1 000");
  }
  if (lu.retenue && lu.nombres * plusGrandeUnite(lu) < UNITES_POUR_UNE_RETENUE) {
    throw new LeconMalFormee("le générateur d'additions ne permet aucune retenue");
  }
  return lu;
}

function plusGrandeUnite({ min, max }: GenerateurDAdditions): number {
  const dernier = Math.min(max, min + UNITES_POUR_UNE_RETENUE - 1);
  return Math.max(...Array.from({ length: dernier - min + 1 }, (_, decalage) => (min + decalage) % 10));
}

function lireEntier(brut: unknown, parDefaut: number, minimum: number, quoi: string): number {
  if (brut === undefined) return parDefaut;
  const nombre = nombreRequis(brut, quoi);
  if (!Number.isInteger(nombre) || nombre < minimum) {
    throw new LeconMalFormee(`${quoi} n'est pas un entier d'au moins ${minimum}`);
  }
  return nombre;
}

function lireRetenue(brut: unknown): boolean {
  if (brut === undefined) return GENERATEUR_PAR_DEFAUT.retenue;
  if (typeof brut !== "boolean") throw new LeconMalFormee("la retenue du générateur n'est pas un booléen");
  return brut;
}
