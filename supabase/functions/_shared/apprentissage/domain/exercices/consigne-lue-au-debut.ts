import type { Exercice } from "../../../catalogue/domain/index.ts";

/** Une dictée commence directement par le texte dicté : sa consigne se relit à la demande. */
export function consigneLueAuDebut(type: Exercice["type"]): boolean {
  return type !== "dictee";
}
