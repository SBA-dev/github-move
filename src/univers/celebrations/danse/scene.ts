import type { VarianteDe } from "@domain/motivation";
import { jouerLaScene } from "../commun/jeu-de-la-scene.ts";
import { creerLesEffets } from "./effets.ts";
import { creerLili } from "./personnage.ts";
import { creerLesPetales } from "./petales.ts";
import { scenarioDeLaDanse } from "./poses.ts";

/**
 * La scène de Lili : elle s'élance, fait sa pirouette, puis la variante tirée (grand jeté, ruban ou petits sauts) ; la salle lui lance des pétales.
 * Le temps de la maquette est accéléré pour que la scène entière tienne dans `DUREE_DE_LA_CELEBRATION_S`.
 * Sans toile (mouvements réduits), il n'y a pas de pétales.
 */
export function creerLaScene(racine: SVGSVGElement, toile: HTMLCanvasElement | null, variante: VarianteDe<"danse">) {
  const scenario = scenarioDeLaDanse(variante);
  const lili = creerLili(racine);
  const effets = creerLesEffets(racine);
  const petales = toile ? creerLesPetales(toile) : null;

  function rendre(t: number) {
    const pose = lili.dessiner(scenario, t);
    effets.dessiner(scenario, t, pose);
    petales?.dessiner();
  }

  /** Joue la scène image par image ; rend la fonction qui l'arrête. */
  const jouer = (quandTerminee: () => void) => jouerLaScene({ fin: scenario.fin, tDesConfettis: scenario.tPetales, confettis: petales, rendre }, quandTerminee);

  /** L'image fixe : Lili dans l'état final de la variante, le cri affiché, rien ne bouge. */
  function montrerLEtatFinal() {
    rendre(scenario.fin);
  }

  return { jouer, montrerLEtatFinal };
}
