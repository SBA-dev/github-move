import type { CleUnivers } from "@domain/motivation";

export type Chapeau = "tiare" | "casquette" | "police" | "casque" | "chignon";
export type Accessoire = "baguette" | "ballon" | "insigne" | "lance" | "ruban";

export type ApparenceHumaine = {
  readonly peau: string;
  readonly cheveux: string;
  readonly tenue: string;
  readonly ailes?: true;
  readonly chapeau: Chapeau;
  readonly accessoire: Accessoire;
};

export type Apparence = { readonly animal: "ecureuil" } | ApparenceHumaine;

export const APPARENCES: Readonly<Record<CleUnivers, Apparence>> = {
  princesse: { peau: "#ffd9b8", cheveux: "#f7cc4f", tenue: "#ff9cbc", ailes: true, chapeau: "tiare", accessoire: "baguette" },
  animaux: { animal: "ecureuil" },
  sports: { peau: "#f1c39a", cheveux: "#5a3a22", tenue: "#2a63d4", chapeau: "casquette", accessoire: "ballon" },
  police: { peau: "#c98d5e", cheveux: "#2b1d14", tenue: "#1f3a8a", chapeau: "police", accessoire: "insigne" },
  pompier: { peau: "#f3c9a5", cheveux: "#a8461c", tenue: "#d23a2a", chapeau: "casque", accessoire: "lance" },
  danse: { peau: "#e8b58c", cheveux: "#3b2416", tenue: "#b55bd6", chapeau: "chignon", accessoire: "ruban" },
};
