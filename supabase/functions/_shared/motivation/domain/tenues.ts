export type TenueDuPersonnageGuide = { readonly cle: string; readonly nom: string };
export type PalierDesTenues = { readonly seuil: number; readonly tenue: TenueDuPersonnageGuide };

export const PALIERS_DES_TENUES: readonly PalierDesTenues[] = [
  { seuil: 5, tenue: { cle: "echarpe-rayee", nom: "une écharpe rayée" } },
  { seuil: 12, tenue: { cle: "noeud-papillon", nom: "un nœud papillon" } },
  { seuil: 23, tenue: { cle: "sac-a-dos-d-explorateur", nom: "un sac à dos d'explorateur" } },
  { seuil: 37, tenue: { cle: "bottes-de-pluie", nom: "des bottes de pluie" } },
];
