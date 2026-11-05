import type { CleDeTenue, VarianteDe } from "@domain/motivation";
import { jouerLaScene } from "../commun/jeu-de-la-scene.ts";
import { creerLesEffets } from "./effets.ts";
import { creerLeJet } from "./jet.ts";
import { creerCapitaineSam } from "./personnage.ts";
import { creerLesPetalesDeLaCaserne } from "./petales.ts";
import { INSTANTS_OU_LES_FLEURS_S_OUVRENT, scenarioDesPompiers } from "./poses.ts";
import { creerLeRepere } from "./repere.ts";

/**
 * La scène de Capitaine Sam : il arrose le jardin de la caserne avec sa lance, les fleurs s'ouvrent une à une, puis la variante tirée
 * (la cloche de la caserne, l'arc-en-ciel ou la pluie joyeuse) ; les pétales de la caserne partent au cri de victoire.
 * Le temps de la maquette (environ 5 s) est accéléré pour que la scène entière tienne dans `DUREE_DE_LA_CELEBRATION_S`.
 * Sans toile (mouvements réduits), il n'y a pas de pétales.
 */
export function creerLaScene(racine: SVGSVGElement, toile: HTMLCanvasElement | null, variante: VarianteDe<"pompier">, tenue?: CleDeTenue) {
  const scenario = scenarioDesPompiers(variante);
  const monde = creerLeRepere(racine);
  const sam = creerCapitaineSam(racine, tenue);
  const jet = creerLeJet(racine, monde, sam);
  const effets = creerLesEffets(racine, monde, sam, scenario, INSTANTS_OU_LES_FLEURS_S_OUVRENT);
  const petales = toile ? creerLesPetalesDeLaCaserne(toile) : null;

  function rendre(t: number) {
    const { pose } = sam.dessiner(scenario, t);
    jet.dessiner(pose, t);
    effets.dessiner(t, pose);
    if (t >= scenario.tCri) petales?.dessiner();
  }

  /** Joue la scène image par image ; rend la fonction qui l'arrête. */
  const jouer = (quandTerminee: () => void) => jouerLaScene({ fin: scenario.fin, tDesConfettis: scenario.tCri, confettis: petales, rendre }, quandTerminee);

  /** L'image fixe : Sam dans l'état final de la variante, les fleurs ouvertes, le cri affiché, rien ne bouge ni ne tombe. */
  function montrerLEtatFinal() {
    rendre(scenario.fin);
  }

  return { jouer, montrerLEtatFinal };
}
