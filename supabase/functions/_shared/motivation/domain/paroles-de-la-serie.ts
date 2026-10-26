import { saluer } from "./paroles.ts";
import type { Serie } from "./serie.ts";

export function texteDeLaPastille({ nombreDeJours, aJoueAujourdhui }: Serie): string {
  if (nombreDeJours === 0) return "Une petite leçon pour bien commencer ?";
  if (nombreDeJours === 1) {
    return aJoueAujourdhui ? "Tu as joué aujourd'hui !" : "Tu as joué hier. Une petite leçon aujourd'hui ?";
  }
  return `${nombreDeJours} jours d'affilée, bravo !`;
}

export function saluerAvecLaSerie(prenom: string, serie: Serie): string {
  return `${saluer(prenom)} ${texteDeLaPastille(serie)}`;
}
