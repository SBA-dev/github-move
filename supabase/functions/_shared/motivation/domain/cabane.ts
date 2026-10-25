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
