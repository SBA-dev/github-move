import type { ReussitesEtErreurs } from "./seance.ts";

const TYPES_DE_CALCUL = ["calcul", "fluence"] as const;

export function historiqueDeCalcul(
  parTypeDesSeances: readonly Partial<Record<string, ReussitesEtErreurs>>[],
): ReussitesEtErreurs[] {
  return parTypeDesSeances.flatMap((parType) => {
    const parties = TYPES_DE_CALCUL.flatMap((type) => parType[type] ?? []);
    if (parties.length === 0) return [];
    return [{
      reussites: parties.reduce((total, partie) => total + partie.reussites, 0),
      erreurs: parties.reduce((total, partie) => total + partie.erreurs, 0),
    }];
  });
}
