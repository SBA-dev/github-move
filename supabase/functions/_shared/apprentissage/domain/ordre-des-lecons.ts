import type { Lecon } from "../../catalogue/domain/index.ts";

export function ordreDesNiveaux(a: Lecon, b: Lecon): number {
  if (a.niveau.estAuDessusDe(b.niveau)) return 1;
  return b.niveau.estAuDessusDe(a.niveau) ? -1 : 0;
}

export function parOrdrePuisIdentifiant(a: Lecon, b: Lecon): number {
  return a.ordre - b.ordre || a.id.localeCompare(b.id);
}
