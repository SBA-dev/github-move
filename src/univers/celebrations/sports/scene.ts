import type { VarianteDe } from "@domain/motivation";
import { creerLesConfettis } from "../commun/confettis.ts";
import { jouerLaScene } from "../commun/jeu-de-la-scene.ts";
import { creerLeBallon, creerLeFilet } from "./ballon-et-filet.ts";
import { creerLesEffets } from "./effets.ts";
import { creerCoachLeo } from "./personnage.ts";
import { scenarioDuBut } from "./poses.ts";

const CONFETTIS_DU_STADE = {
  couleurs: ["#1F63D8", "#FFC93C", "#FFFFFF", "#4C8FF5", "#E8604C"],
  origines: [{ x: 255, y: 236, poussee: 50 }, { x: 105, y: 236, poussee: -50 }],
} as const;

/**
 * La scène de Coach Léo : il tire, le ballon entre dans le but, les confettis jaillissent, puis la variante tirée.
 * Le temps de la maquette est accéléré pour que la scène entière tienne dans `DUREE_DE_LA_CELEBRATION_S`.
 * Sans toile (mouvements réduits), il n'y a pas de confettis.
 */
export function creerLaScene(racine: SVGSVGElement, toile: HTMLCanvasElement | null, variante: VarianteDe<"sports">) {
  const scenario = scenarioDuBut(variante);
  const personnage = creerCoachLeo(racine);
  const ballon = creerLeBallon(racine);
  const filet = creerLeFilet(racine);
  const effets = creerLesEffets(racine);
  const confettis = toile ? creerLesConfettis(toile, CONFETTIS_DU_STADE) : null;

  function rendre(t: number) {
    const pose = personnage.dessiner(scenario, t);
    ballon.dessiner(t);
    filet.dessiner(t);
    effets.dessiner(scenario, t, pose);
    confettis?.dessiner();
  }

  /** Joue la scène image par image ; rend la fonction qui l'arrête. */
  const jouer = (quandTerminee: () => void) => jouerLaScene({ fin: scenario.fin, tDesConfettis: scenario.tCri, confettis, rendre }, quandTerminee);

  /** L'image fixe : le personnage dans l'état final de la variante, le cri affiché, rien ne bouge. */
  function montrerLEtatFinal() {
    rendre(scenario.fin);
  }

  return { jouer, montrerLEtatFinal };
}
