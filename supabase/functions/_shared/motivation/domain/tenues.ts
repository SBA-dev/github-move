import {
  type MeilleuresEtoilesDuProfil,
  totauxAvantEtApresLaSeance,
  verifierTotalDEtoiles,
} from "./total-des-etoiles.ts";

export type TenueDuPersonnageGuide = { readonly cle: string; readonly nom: string };
export type PalierDesTenues = { readonly seuil: number; readonly tenue: TenueDuPersonnageGuide };

export const PALIERS_DES_TENUES: readonly PalierDesTenues[] = [
  { seuil: 5, tenue: { cle: "echarpe-rayee", nom: "une écharpe rayée" } },
  { seuil: 12, tenue: { cle: "noeud-papillon", nom: "un nœud papillon" } },
  { seuil: 23, tenue: { cle: "sac-a-dos-d-explorateur", nom: "un sac à dos d'explorateur" } },
  { seuil: 37, tenue: { cle: "bottes-de-pluie", nom: "des bottes de pluie" } },
];

export type EtatDesTenues = {
  readonly total: number;
  readonly tenuesRecues: readonly TenueDuPersonnageGuide[];
  readonly prochainPalier?: {
    readonly tenue: TenueDuPersonnageGuide;
    readonly seuil: number;
    readonly etoilesManquantes: number;
  };
  readonly toutesRecues: boolean;
};

function prochainPalierDesTenuesDe(total: number): EtatDesTenues["prochainPalier"] {
  const prochain = PALIERS_DES_TENUES.find((palier) => palier.seuil > total);
  if (prochain === undefined) return undefined;
  return { tenue: prochain.tenue, seuil: prochain.seuil, etoilesManquantes: prochain.seuil - total };
}

export function tenuesDe(total: number): EtatDesTenues {
  verifierTotalDEtoiles(total);
  const tenuesRecues = PALIERS_DES_TENUES.filter((palier) => palier.seuil <= total).map((palier) => palier.tenue);
  const prochainPalier = prochainPalierDesTenuesDe(total);
  return {
    total,
    tenuesRecues,
    ...(prochainPalier && { prochainPalier }),
    toutesRecues: prochainPalier === undefined,
  };
}

export function tenueRecueParLaSeance(
  meilleuresAvant: MeilleuresEtoilesDuProfil,
  lecon: string,
  etoilesDeLaSeance: number | undefined,
): TenueDuPersonnageGuide | undefined {
  if (etoilesDeLaSeance === undefined) return undefined;
  const { avant, apres } = totauxAvantEtApresLaSeance(meilleuresAvant, lecon, etoilesDeLaSeance);
  const tenuesAvant = tenuesDe(avant).tenuesRecues;
  const tenuesApres = tenuesDe(apres).tenuesRecues;
  return tenuesApres.length > tenuesAvant.length ? tenuesApres.at(-1) : undefined;
}
