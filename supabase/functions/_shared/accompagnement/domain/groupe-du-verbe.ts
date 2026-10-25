import { normaliser } from "./texte-normalise.ts";

export type GroupeDuVerbe = "1" | "2" | "3";

const VERBES_EN_IR_DU_TROISIEME_GROUPE = new Set([
  "venir",
  "tenir",
  "partir",
  "sortir",
  "dormir",
  "courir",
  "mourir",
  "ouvrir",
  "offrir",
  "souffrir",
  "cueillir",
  "sentir",
  "servir",
  "mentir",
  "fuir",
  "acquerir",
  "devenir",
  "revenir",
  "couvrir",
  "bouillir",
]);

export function groupeDuVerbe(infinitif: string): GroupeDuVerbe {
  const verbe = normaliser(infinitif);
  if (verbe === "aller") return "3";
  if (verbe.endsWith("er")) return "1";
  if (verbe.endsWith("oir")) return "3";
  if (verbe.endsWith("ir") && !VERBES_EN_IR_DU_TROISIEME_GROUPE.has(verbe)) {
    return "2";
  }
  return "3";
}
