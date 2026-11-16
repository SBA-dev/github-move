import type { Exercice } from "@domain/catalogue";
import type { NatureDeParole } from "./usePersonnageQuiParle.ts";

type ParoleDeLaBulle = { readonly texte: string; readonly nature: NatureDeParole } | undefined;

/**
 * Le texte d'une question qui n'est écrit nulle part dans l'exercice : il est affiché dans la bulle, sous la consigne.
 * La boîte à jetons ne montre que ses jetons ; le problème en barres écrit son énoncé, mais pas l'explication du schéma.
 * Les autres exercices écrivent leur question (énoncé, carte du calcul, invite de l'addition, mot de la dictée).
 */
export function questionAfficheeDansLaBulle(parole: ParoleDeLaBulle, exercice: Exercice | undefined, enonceDuProbleme: string | undefined): string | undefined {
  if (parole?.nature !== "question") return undefined;
  if (exercice?.type === "boite") return parole.texte;
  if (exercice?.type === "barres" && parole.texte !== enonceDuProbleme) return parole.texte;
  return undefined;
}
