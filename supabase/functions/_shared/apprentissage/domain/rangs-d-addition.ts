export type Rang = "unites" | "dizaines" | "centaines";
export type Couleur = "bleue" | "rose" | "verte";

export const RANGS: readonly { rang: Rang; couleur: Couleur }[] = [
  { rang: "unites", couleur: "bleue" },
  { rang: "dizaines", couleur: "rose" },
  { rang: "centaines", couleur: "verte" },
];
