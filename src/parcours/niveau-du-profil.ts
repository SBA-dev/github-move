import { Niveau, NiveauInconnu } from "@domain/catalogue";

/** Le niveau d'un profil, ou `undefined` si sa classe n'est pas un niveau de l'élémentaire. */
export function niveauDuProfil(brut: string): Niveau | undefined {
  try {
    return Niveau.de(brut);
  } catch (erreur) {
    if (erreur instanceof NiveauInconnu) return undefined;
    throw erreur;
  }
}
