export const CLE_PROFIL_PREPARE = "savanturier:profil-prepare";

export type ProfilPrepare = {
  readonly prenom: string;
  readonly niveau: string;
  readonly univers?: string;
  readonly modeDys?: boolean;
};

function estProfilPrepare(valeur: unknown): valeur is ProfilPrepare {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { prenom, niveau, univers, modeDys } = valeur as Record<string, unknown>;
  return typeof prenom === "string" && typeof niveau === "string" &&
    (univers === undefined || typeof univers === "string") &&
    (modeDys === undefined || typeof modeDys === "boolean");
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
