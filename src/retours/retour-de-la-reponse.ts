import type { Reponse } from "@domain/apprentissage";

export type GenreDeRetour = "juste" | "fausse";

/** Ce que l'écran montre d'une réponse : l'élément touché (sa cible) rebondit ou se balance, et un texte complet fait pleuvoir des étincelles. */
export type RetourDeLaReponse = Readonly<{
  genre: GenreDeRetour;
  cible: string;
  numero: number;
  complet: boolean;
}>;

/** Le retour est effacé quand les animations sont finies : un élément qui apparaît plus tard ne le rejoue pas. */
export const DUREE_DU_RETOUR_EN_MS = 800;

/** La cible des réponses qui ne se choisissent pas : le clavier de cristaux, les colonnes, le mot écrit. */
export const CIBLE_DE_LA_ZONE_DE_REPONSE = "reponse";

/** Un chiffre posé dans une colonne de l'addition : les colonnes réagissent, pas le clavier. */
export const CIBLE_DES_COLONNES = "colonnes";

/** L'élément qui réagit à une réponse : le choix touché, ou la zone de réponse quand rien ne se choisit. */
export function cibleDeLaReponse(reponse: Reponse): string {
  return reponse.genre === "choix" ? reponse.texte : CIBLE_DE_LA_ZONE_DE_REPONSE;
}
