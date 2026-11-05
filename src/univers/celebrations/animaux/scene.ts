import type { VarianteDe } from "@domain/motivation";
import { jouerLaScene } from "../commun/jeu-de-la-scene.ts";
import { creerLesEffets } from "./effets.ts";
import { creerLesFeuilles } from "./feuilles.ts";
import { creerNoisette } from "./personnage.ts";
import { scenarioDesAnimaux } from "./poses.ts";

/**
 * La scène de Noisette : la noisette dorée tombe de l'arbre, elle l'attrape, puis la variante tirée (jonglage, noisette croquée
 * ou joues pleines) ; les feuilles de la forêt tombent du ciel.
 * Le temps de la maquette est accéléré pour que la scène entière tienne dans `DUREE_DE_LA_CELEBRATION_S`.
 * Sans toile (mouvements réduits), il n'y a pas de feuilles.
 */
export function creerLaScene(racine: SVGSVGElement, toile: HTMLCanvasElement | null, variante: VarianteDe<"animaux">) {
  const scenario = scenarioDesAnimaux(variante);
  const noisette = creerNoisette(racine);
  const effets = creerLesEffets(racine);
  const feuilles = toile ? creerLesFeuilles(toile) : null;

  function rendre(t: number) {
    const dessin = noisette.dessiner(scenario, t, { yeuxOuverts: t >= scenario.fin });
    effets.dessiner(scenario, t, dessin);
    feuilles?.dessiner();
  }

  /** Joue la scène image par image ; rend la fonction qui l'arrête. */
  const jouer = (quandTerminee: () => void) => jouerLaScene({ fin: scenario.fin, tDesConfettis: scenario.tFeuilles, confettis: feuilles, rendre }, quandTerminee);

  /** L'image fixe : Noisette dans l'état final de la variante, le cri affiché, rien ne bouge. */
  function montrerLEtatFinal() {
    rendre(scenario.fin);
  }

  return { jouer, montrerLEtatFinal };
}
