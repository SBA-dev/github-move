import type { Jour } from "../../apprentissage/domain/index.ts";
import type { JoursDeSeance } from "./jours-de-seance.ts";

export type Serie = {
  readonly nombreDeJours: number;
  readonly aJoueAujourdhui: boolean;
};

export function serieDeJours(jours: JoursDeSeance, aujourdhui: Jour): Serie {
  const aJoueAujourdhui = jours.contient(aujourdhui);
  let jour = aJoueAujourdhui ? aujourdhui : aujourdhui.plus(-1);
  let nombreDeJours = 0;
  while (jours.contient(jour)) {
    nombreDeJours++;
    jour = jour.plus(-1);
  }
  return { nombreDeJours, aJoueAujourdhui };
}
