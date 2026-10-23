import type { Consigne } from "../voix/index.ts";

export const CLE_CONSIGNE_PREPAREE = "savanturier:consigne-preparee";

export const CONSIGNE_D_EXEMPLE: Consigne = { texte: "Combien font 3 + 4 ?" };

function estConsigne(valeur: unknown): valeur is Consigne {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { texte, langue, motEnGras } = valeur as Record<string, unknown>;
  return typeof texte === "string" &&
    (langue === undefined || typeof langue === "string") &&
    (motEnGras === undefined || typeof motEnGras === "string");
}

export function lireConsigne(): Consigne {
  try {
    const contenu = localStorage.getItem(CLE_CONSIGNE_PREPAREE);
    const consigne: unknown = contenu === null ? undefined : JSON.parse(contenu);
    return estConsigne(consigne) ? consigne : CONSIGNE_D_EXEMPLE;
  } catch {
    return CONSIGNE_D_EXEMPLE;
  }
}
