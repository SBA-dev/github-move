import { enObjet, liste, nombreRequis, type Objet } from "../lecture.ts";
import { LeconMalFormee } from "../erreurs.ts";

const SIGNES = ["+", "-", "×", ":", "complement"] as const;

const COMBIEN_PAR_DEFAUT = 5;
const CIBLE_PAR_DEFAUT = 10;
const INTERVALLE_PAR_DEFAUT: Intervalle = Object.freeze([1, 10] as const);

export type Intervalle = readonly [number, number];

export type Signe = typeof SIGNES[number];

export type GenerateurDOperations = Readonly<{
  op?: Signe;
  a?: Intervalle;
  b?: Intervalle;
  cible?: number;
  combien?: number;
}>;

export type GenerateurComplet = Required<GenerateurDOperations>;

export function lireGenerateur(brut: unknown): GenerateurComplet {
  const generateur: Objet = brut === undefined ? {} : enObjet(brut, "le générateur");
  const lu: GenerateurComplet = Object.freeze({
    op: lireSigne(generateur.op),
    a: lireIntervalle(generateur.a),
    b: lireIntervalle(generateur.b),
    cible: lireCible(generateur.cible),
    combien: lireCombien(generateur.combien),
  });
  if (lu.op === "complement" && lu.a[1] > lu.cible) {
    throw new LeconMalFormee("le nombre de départ d'un complément peut dépasser la cible");
  }
  if (lu.op === ":" && lu.b[0] === 0) {
    throw new LeconMalFormee("le diviseur d'un générateur de divisions peut valoir 0");
  }
  return lu;
}

function lireCible(brut: unknown): number {
  if (brut === undefined) return CIBLE_PAR_DEFAUT;
  const cible = nombreRequis(brut, "la cible du générateur");
  if (!Number.isInteger(cible) || cible < 0) {
    throw new LeconMalFormee("la cible du générateur n'est pas un entier positif");
  }
  return cible;
}

function lireSigne(brut: unknown): Signe {
  if (brut === undefined) return "+";
  const signe = SIGNES.find((connu) => connu === brut);
  if (signe === undefined) throw new LeconMalFormee("le signe du générateur est inconnu");
  return signe;
}

function lireCombien(brut: unknown): number {
  if (brut === undefined) return COMBIEN_PAR_DEFAUT;
  const combien = nombreRequis(brut, "le nombre d'opérations du générateur");
  if (!Number.isInteger(combien) || combien < 1) {
    throw new LeconMalFormee("le nombre d'opérations du générateur n'est pas un entier positif");
  }
  return combien;
}

function lireIntervalle(brut: unknown): Intervalle {
  if (brut === undefined) return INTERVALLE_PAR_DEFAUT;
  const bornes = liste(brut, "un intervalle du générateur").map((borne) =>
    nombreRequis(borne, "une borne du générateur")
  );
  const [min, max] = bornes;
  if (bornes.length !== 2 || min === undefined || max === undefined) {
    throw new LeconMalFormee("un intervalle du générateur n'a pas deux bornes");
  }
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    throw new LeconMalFormee("un intervalle du générateur n'est pas un intervalle d'entiers");
  }
  if (min < 0) throw new LeconMalFormee("une borne d'un intervalle du générateur est négative");
  return Object.freeze([min, max] as const);
}
