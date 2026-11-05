import type { CleDeTenue, VarianteDe } from "@domain/motivation";
import { jouerLaScene } from "../commun/jeu-de-la-scene.ts";
import { creerLesEffets } from "./effets.ts";
import { creerLumi } from "./personnage.ts";
import { creerLaPluie } from "./pluie.ts";
import { scenarioDesPrincesses } from "./poses.ts";

/**
 * La scène de Lumi : un sort fait éclore une grande fleur magique, puis la variante tirée (arc-en-ciel, envol ou chiffres lumineux) ; des étincelles et des pétales tombent du ciel.
 * Le temps de la maquette est accéléré pour que la scène entière tienne dans `DUREE_DE_LA_CELEBRATION_S`.
 * Sans toile (mouvements réduits), il n'y a ni pluie, ni traînée, ni étincelles d'envol : l'image fixe de l'état final.
 */
export function creerLaScene(racine: SVGSVGElement, toile: HTMLCanvasElement | null, variante: VarianteDe<"princesse">, tenue?: CleDeTenue) {
  const scenario = scenarioDesPrincesses(variante);
  const lumi = creerLumi(racine, tenue);
  const effets = creerLesEffets(racine, toile !== null);
  const pluie = toile ? creerLaPluie(toile) : null;

  function rendre(t: number) {
    const dessinee = lumi.dessiner(scenario, t);
    effets.dessiner(scenario, t, dessinee);
    pluie?.dessiner();
  }

  /** Joue la scène image par image ; rend la fonction qui l'arrête. */
  const jouer = (quandTerminee: () => void) => jouerLaScene({ fin: scenario.fin, tDesConfettis: scenario.tPluie, confettis: pluie, rendre }, quandTerminee);

  /** L'image fixe : Lumi dans l'état final de la variante, le cri affiché, rien ne bouge. */
  function montrerLEtatFinal() {
    rendre(scenario.fin);
  }

  return { jouer, montrerLEtatFinal };
}
