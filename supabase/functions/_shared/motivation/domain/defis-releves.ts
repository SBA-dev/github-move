import { libelleCourtDe, Niveau, toutesLesMatieres } from "../../catalogue/domain/index.ts";
import type { DefiReleve } from "../../apprentissage/domain/index.ts";
import type { EffetSonore } from "../../voix/domain/index.ts";
import { nomDuDefi, titreDuDefiReleve } from "./paroles-du-defi.ts";

export interface IssueDuDefi {
  readonly annonce: string | undefined;
  readonly effetSonore: EffetSonore;
}

function memeDefi(a: DefiReleve, b: DefiReleve): boolean {
  return a.matiere.code === b.matiere.code && a.niveau.valeur === b.niveau.valeur && a.numero === b.numero;
}

export function defiReleveParLaSeance(relevesAvant: readonly DefiReleve[], defi: DefiReleve): IssueDuDefi {
  const dejaReleve = relevesAvant.some((releve) => memeDefi(releve, defi));
  return dejaReleve
    ? { annonce: undefined, effetSonore: "seanceTerminee" }
    : { annonce: titreDuDefiReleve(), effetSonore: "grandeVictoire" };
}

function rangDeLaMatiere(defi: DefiReleve): number {
  return toutesLesMatieres().findIndex((matiere) => matiere.code === defi.matiere.code);
}

function rangDuNiveau(defi: DefiReleve): number {
  return Niveau.tous().findIndex((niveau) => niveau.valeur === defi.niveau.valeur);
}

export function lignesDesDefisReleves(defis: readonly DefiReleve[]): string[] {
  const sansDoublon = defis.filter((defi, i) => defis.findIndex((autre) => memeDefi(autre, defi)) === i);
  return sansDoublon
    .sort((a, b) => rangDeLaMatiere(a) - rangDeLaMatiere(b) || rangDuNiveau(a) - rangDuNiveau(b) || a.numero - b.numero)
    .map((defi) => `${nomDuDefi(defi.numero)} · ${libelleCourtDe(defi.matiere.code)} · ${defi.niveau.valeur}`);
}
