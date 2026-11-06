import { jouerLaScene } from "../../celebrations/commun/jeu-de-la-scene.ts";
import { DUREE_DE_LA_SCENE_DE_REPONSE_FAUSSE_S } from "../duree-de-la-scene.ts";

type Image = {
  /** Fin de la scène, en secondes : elle est jouée à cette vitesse, sans accélération. */
  readonly fin: number;
  /** Dessine la scène à l'instant `t`. */
  rendre(t: number): void;
  /** Dessine l'image fixe (mouvements réduits). */
  rendreLEtatFinal(): void;
};

/** Ce que partagent les scènes de réponse fausse : jouée en 1,5 s au plus, sans confettis ni son (la scène n'a que le dessin), et son image fixe. */
export function assemblerLaScene({ fin, rendre, rendreLEtatFinal }: Image) {
  /** Joue la scène image par image ; rend la fonction qui l'arrête. */
  const jouer = (quandTerminee: () => void) =>
    jouerLaScene({ fin, tDesConfettis: fin, confettis: null, rendre }, quandTerminee, DUREE_DE_LA_SCENE_DE_REPONSE_FAUSSE_S);

  return { jouer, montrerLEtatFinal: rendreLEtatFinal };
}
