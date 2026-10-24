import type { Exercice } from "../../../catalogue/domain/index.ts";

/** Une dictée commence directement par le texte dicté, une poésie par son écoute : aucune consigne n'est lue au début. */
export function consigneLueAuDebut(type: Exercice["type"]): boolean {
  return type !== "dictee" && type !== "memoriser";
}
