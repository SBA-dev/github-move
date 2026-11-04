import type { VarianteDe } from "@domain/motivation";
import { creerLeBallon, creerLeFilet } from "./ballon-et-filet.ts";
import { creerLesConfettis } from "./confettis.ts";
import { creerLesEffets } from "./effets.ts";
import { creerCoachLeo } from "./personnage.ts";
import { scenarioDuBut } from "./poses.ts";

/** La célébration de l'univers dure 3 s au plus, quelle que soit la variante (décision 0039). */
export const DUREE_DE_LA_CELEBRATION_S = 3;

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
  const confettis = toile ? creerLesConfettis(toile) : null;
  const vitesse = scenario.fin / DUREE_DE_LA_CELEBRATION_S;

  function rendre(t: number) {
    const pose = personnage.dessiner(scenario, t);
    ballon.dessiner(t);
    filet.dessiner(t);
    effets.dessiner(scenario, t, pose);
    confettis?.dessiner();
  }

  /** Joue la scène image par image ; rend la fonction qui l'arrête. */
  function jouer(quandTerminee: () => void): () => void {
    const depart = performance.now();
    let precedent = 0, image = 0;
    const boucle = (maintenant: number) => {
      const t = Math.min(scenario.fin, Math.max(0, (maintenant - depart) / 1000 * vitesse));
      if (t >= scenario.tCri) confettis?.avancer(Math.min(.05, t - Math.max(precedent, scenario.tCri)));
      precedent = t;
      rendre(t);
      if (t >= scenario.fin) quandTerminee();
      else image = requestAnimationFrame(boucle);
    };
    rendre(0);
    image = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(image);
  }

  /** L'image fixe : le personnage dans l'état final de la variante, le cri affiché, rien ne bouge. */
  function montrerLEtatFinal() {
    rendre(scenario.fin);
  }

  return { jouer, montrerLEtatFinal };
}
