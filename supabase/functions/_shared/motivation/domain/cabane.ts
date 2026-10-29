import {
  type MeilleuresEtoilesDuProfil,
  totauxAvantEtApresLaSeance,
  verifierTotalDEtoiles,
} from "./total-des-etoiles.ts";

export {
  type MeilleuresEtoilesDuProfil,
  NombreDEtoilesInvalide,
  totalDesEtoiles,
  TotalDEtoilesInvalide,
} from "./total-des-etoiles.ts";

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

function prochainPalierDe(total: number): EtatDeLaCabane["prochainPalier"] {
  const prochain = PALIERS_DE_LA_CABANE.find((palier) => palier.seuil > total);
  if (prochain === undefined) return undefined;
  return { objet: prochain.objet, seuil: prochain.seuil, etoilesManquantes: prochain.seuil - total };
}

export function cabaneDe(total: number): EtatDeLaCabane {
  verifierTotalDEtoiles(total);
  const objetsRecus = PALIERS_DE_LA_CABANE.filter((palier) => palier.seuil <= total).map((palier) => palier.objet);
  const prochainPalier = prochainPalierDe(total);
  return {
    total,
    objetsRecus,
    ...(prochainPalier && { prochainPalier }),
    complete: prochainPalier === undefined,
  };
}

export function objetRecuParLaSeance(
  meilleuresAvant: MeilleuresEtoilesDuProfil,
  lecon: string,
  etoilesDeLaSeance: number | undefined,
): ObjetDeLaCabane | undefined {
  if (etoilesDeLaSeance === undefined) return undefined;
  const { avant, apres } = totauxAvantEtApresLaSeance(meilleuresAvant, lecon, etoilesDeLaSeance);
  const objetsAvant = cabaneDe(avant).objetsRecus;
  const objetsApres = cabaneDe(apres).objetsRecus;
  return objetsApres.length > objetsAvant.length ? objetsApres.at(-1) : undefined;
}
