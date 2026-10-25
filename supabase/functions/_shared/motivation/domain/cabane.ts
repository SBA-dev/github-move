export type ObjetDeLaCabane = { readonly cle: string; readonly nom: string };
export type PalierDeLaCabane = { readonly seuil: number; readonly objet: ObjetDeLaCabane };

export const PALIERS_DE_LA_CABANE: readonly PalierDeLaCabane[] = [
  { seuil: 3, objet: { cle: "lanterne", nom: "une lanterne" } },
  { seuil: 6, objet: { cle: "tapis", nom: "un tapis tout doux" } },
  { seuil: 10, objet: { cle: "pot-de-fleurs", nom: "un pot de fleurs" } },
  { seuil: 15, objet: { cle: "etagere", nom: "une étagère de livres" } },
  { seuil: 20, objet: { cle: "tableau", nom: "un tableau" } },
  { seuil: 26, objet: { cle: "coussin", nom: "un gros coussin" } },
  { seuil: 33, objet: { cle: "guirlande", nom: "une guirlande" } },
  { seuil: 40, objet: { cle: "telescope", nom: "un télescope" } },
  { seuil: 48, objet: { cle: "globe", nom: "un globe" } },
  { seuil: 56, objet: { cle: "boite-a-tresor", nom: "une boîte à trésor" } },
  { seuil: 65, objet: { cle: "coupe", nom: "une coupe dorée" } },
  { seuil: 75, objet: { cle: "etoile-magique", nom: "l'étoile magique" } },
];

export type MeilleuresEtoilesDuProfil = ReadonlyMap<string, number>;

export class NombreDEtoilesInvalide extends Error {
  constructor(readonly etoiles: number) {
    super(`${etoiles} n'est pas un nombre d'étoiles valide : une leçon rapporte de 1 à 3 étoiles.`);
    this.name = "NombreDEtoilesInvalide";
  }
}

function verifierNombreDEtoiles(etoiles: number): number {
  if (!Number.isInteger(etoiles) || etoiles < 1 || etoiles > 3) throw new NombreDEtoilesInvalide(etoiles);
  return etoiles;
}

export function totalDesEtoiles(meilleures: MeilleuresEtoilesDuProfil): number {
  let total = 0;
  for (const etoiles of meilleures.values()) total += verifierNombreDEtoiles(etoiles);
  return total;
}

export type EtatDeLaCabane = {
  readonly total: number;
  readonly objetsRecus: readonly ObjetDeLaCabane[];
  readonly prochainPalier?: {
    readonly objet: ObjetDeLaCabane;
    readonly seuil: number;
    readonly etoilesManquantes: number;
  };
  readonly complete: boolean;
};

export class TotalDEtoilesInvalide extends Error {
  constructor(readonly total: number) {
    super(`${total} n'est pas un total d'étoiles valide : il faut un nombre entier positif ou nul.`);
    this.name = "TotalDEtoilesInvalide";
  }
}

export function cabaneDe(total: number): EtatDeLaCabane {
  if (!Number.isInteger(total) || total < 0) throw new TotalDEtoilesInvalide(total);
  const objetsRecus = PALIERS_DE_LA_CABANE.filter((palier) => palier.seuil <= total).map((palier) => palier.objet);
  const prochain = PALIERS_DE_LA_CABANE.find((palier) => palier.seuil > total);
  return {
    total,
    objetsRecus,
    ...(prochain && {
      prochainPalier: { objet: prochain.objet, seuil: prochain.seuil, etoilesManquantes: prochain.seuil - total },
    }),
    complete: prochain === undefined,
  };
}

export function objetRecuParLaSeance(
  meilleuresAvant: MeilleuresEtoilesDuProfil,
  lecon: string,
  etoilesDeLaSeance: number | undefined,
): ObjetDeLaCabane | undefined {
  if (etoilesDeLaSeance === undefined) return undefined;
  verifierNombreDEtoiles(etoilesDeLaSeance);
  const meilleurAvant = meilleuresAvant.get(lecon) ?? 0;
  const totalAvant = totalDesEtoiles(meilleuresAvant);
  const totalApres = totalAvant - meilleurAvant + Math.max(meilleurAvant, etoilesDeLaSeance);
  const objetsAvant = cabaneDe(totalAvant).objetsRecus;
  const objetsApres = cabaneDe(totalApres).objetsRecus;
  return objetsApres.length > objetsAvant.length ? objetsApres.at(-1) : undefined;
}
