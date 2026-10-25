import type { ReglagesBruts } from "@domain/famille";
import { estUnReglagesBruts } from "../../reglages/index.ts";

export const CLE_PROFIL_PREPARE = "savanturier:profil-prepare";

export type ProfilPrepare = {
  readonly prenom: string;
  readonly niveau: string;
  readonly univers?: string;
  /** Facultatifs : les valeurs par défaut s'appliquent aux réglages absents. */
  readonly reglages?: ReglagesBruts;
};

function estProfilPrepare(valeur: unknown): valeur is ProfilPrepare {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { prenom, niveau, univers, reglages } = valeur as Record<string, unknown>;
  return typeof prenom === "string" && typeof niveau === "string" &&
    (univers === undefined || typeof univers === "string") &&
    (reglages === undefined || estUnReglagesBruts(reglages));
}

export function lireProfilPrepare(): ProfilPrepare | undefined {
  const contenu = localStorage.getItem(CLE_PROFIL_PREPARE);
  if (contenu === null) return undefined;
  try {
    const profil: unknown = JSON.parse(contenu);
    return estProfilPrepare(profil) ? profil : undefined;
  } catch {
    return undefined;
  }
}
