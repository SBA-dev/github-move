import { LeconMalFormee } from "../erreurs.ts";
import { enObjet, liste, nombreRequis, type Objet } from "../lecture.ts";

export type SensDeLaBoite = "ajout" | "retrait";

export type ItemDeBoite = Readonly<{
  a: number;
  sens: SensDeLaBoite;
  b: number;
  reponse: number;
  ecriture: string;
}>;

export type ExerciceBoite = Readonly<{
  type: "boite";
  titre?: string;
  consigne?: string;
  items: readonly ItemDeBoite[];
}>;

export function lireBoite(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceBoite {
  const items = liste(brut.items, "les items").map(lireItem);
  if (items.length === 0) throw new LeconMalFormee("l'exercice « boite » n'a aucune question à poser");
  return Object.freeze({ type: "boite", ...communs, items: Object.freeze(items) });
}

function lireItem(brut: unknown): ItemDeBoite {
  const item = enObjet(brut, "un item de la boîte");
  const a = entierPositif(item.a, "le nombre de départ d'un item de la boîte");
  const b = entierPositif(item.b, "le nombre de jetons d'un item de la boîte");
  const sens = lireSens(item.op);
  if (sens === "retrait" && b > a) {
    throw new LeconMalFormee("un item de la boîte retire plus de jetons qu'elle n'en contient");
  }
  const reponse = sens === "retrait" ? a - b : a + b;
  const signe = sens === "retrait" ? "−" : "+";
  return Object.freeze({ a, sens, b, reponse, ecriture: `${a} ${signe} ${b} = ${reponse}` });
}

function lireSens(operation: unknown): SensDeLaBoite {
  switch (operation) {
    case undefined:
    case "+":
      return "ajout";
    case "-":
      return "retrait";
    default:
      throw new LeconMalFormee("l'opération d'un item de la boîte n'est ni « + » ni « - »");
  }
}

function entierPositif(valeur: unknown, quoi: string): number {
  const nombre = nombreRequis(valeur, quoi);
  if (!Number.isInteger(nombre) || nombre < 0) throw new LeconMalFormee(`${quoi} n'est pas un entier positif`);
  return nombre;
}
