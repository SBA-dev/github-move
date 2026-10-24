import type { Lecon } from "./lecon.ts";

export function leconSuivante(lecons: readonly Lecon[], lecon: Lecon): Lecon | undefined {
  return lecons
    .filter((autre) =>
      autre.matiere.code === lecon.matiere.code &&
      autre.niveau.valeur === lecon.niveau.valeur &&
      autre.ordre > lecon.ordre
    )
    .sort((a, b) => a.ordre - b.ordre)[0];
}
