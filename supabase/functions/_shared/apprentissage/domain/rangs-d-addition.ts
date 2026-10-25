export type Rang = "unites" | "dizaines" | "centaines";
export type Couleur = "bleue" | "rose" | "verte";

export const RANGS: readonly { rang: Rang; couleur: Couleur }[] = [
  { rang: "unites", couleur: "bleue" },
  { rang: "dizaines", couleur: "rose" },
  { rang: "centaines", couleur: "verte" },
];

/** Le nom de chaque colonne tel que l'enfant le lit à l'écran. */
export const NOMS_DES_COLONNES_A_L_ECRAN: Record<Rang, string> = {
  unites: "Unités",
  dizaines: "Dizaines",
  centaines: "Centaines",
};
