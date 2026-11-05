import type { CleDeTenue, VarianteDe } from "@domain/motivation";
import { creerLesConfettis } from "../commun/confettis.ts";
import { jouerLaScene } from "../commun/jeu-de-la-scene.ts";
import { creerLeChiot } from "./chiot.ts";
import { creerLesEffets } from "./effets.ts";
import { creerAgentMax } from "./personnage.ts";
import { scenarioDeLaPolice } from "./poses.ts";

/** Les confettis du commissariat : bleus, jaunes, blancs, bleu clair et rouges, lancés des deux côtés de la place. */
const CONFETTIS_DU_COMMISSARIAT = {
  couleurs: ["#3450C8", "#FFC93C", "#FFFFFF", "#86A5F2", "#E8604C"],
  origines: [{ x: 320, y: 300, poussee: -60 }, { x: 40, y: 300, poussee: 60 }],
} as const;

/**
 * La scène d'Agent Max : il suit les traces de pattes à la loupe, le buisson bouge, le chiot en sort d'un bond et lui saute dans les bras,
 * puis Max le pose au sol, où il reste assis pendant la variante tirée (chef d'orchestre, tour en trottinette ou danse de la victoire) ;
 * les confettis du commissariat partent au cri de victoire.
 * Le temps de la maquette est raccourci (environ 5 s, 106.38) puis accéléré pour que la scène entière tienne dans `DUREE_DE_LA_CELEBRATION_S`.
 * Sans toile (mouvements réduits), il n'y a pas de confettis.
 */
export function creerLaScene(racine: SVGSVGElement, toile: HTMLCanvasElement | null, variante: VarianteDe<"police">, tenue?: CleDeTenue) {
  const scenario = scenarioDeLaPolice(variante);
  const max = creerAgentMax(racine, tenue);
  const chiot = creerLeChiot(racine);
  const effets = creerLesEffets(racine, scenario);
  const confettis = toile ? creerLesConfettis(toile, CONFETTIS_DU_COMMISSARIAT) : null;

  function rendre(t: number) {
    const dessin = max.dessiner(scenario, t);
    chiot.dessiner(scenario, t, dessin);
    effets.dessiner(t, dessin);
    confettis?.dessiner();
  }

  /** Joue la scène image par image ; rend la fonction qui l'arrête. */
  const jouer = (quandTerminee: () => void) => jouerLaScene({ fin: scenario.fin, tDesConfettis: scenario.tCri, confettis, rendre }, quandTerminee);

  /** L'image fixe : Max dans l'état final de la variante, le chiot assis à côté de lui, le cri affiché, rien ne bouge. */
  function montrerLEtatFinal() {
    rendre(scenario.fin);
  }

  return { jouer, montrerLEtatFinal };
}
