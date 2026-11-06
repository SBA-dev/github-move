import type { CleDeTenue } from "@domain/motivation";
import { jouerLaScene } from "../../celebrations/commun/jeu-de-la-scene.ts";
import { creerCoachLeo } from "../../celebrations/sports/personnage.ts";
import { DUREE_DE_LA_SCENE_DE_REPONSE_FAUSSE_S } from "../duree-de-la-scene.ts";
import { creerLaBulleEcrite, creerLeBallon, creerLePoteau } from "./ballon-et-poteau.ts";
import { REGLAGES_DE_LEO_EN_REPONSE_FAUSSE } from "./reglages.ts";
import { FIN, SCENARIO_DE_LEO } from "./scenario.ts";

/** La scène de Léo : il tape son ballon, qui rebondit sur un petit poteau et revient rouler à ses pieds ; il rit, le pouce levé. */
export function creerLaScene(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const personnage = creerCoachLeo(racine, tenue, REGLAGES_DE_LEO_EN_REPONSE_FAUSSE);
  const ballon = creerLeBallon(racine);
  const poteau = creerLePoteau(racine);
  const bulle = creerLaBulleEcrite(racine);

  function rendre(t: number) {
    personnage.dessiner(SCENARIO_DE_LEO, t);
    ballon.dessiner(t);
    poteau.dessiner(t);
    bulle?.dessiner(t);
  }

  /** Joue la scène image par image ; rend la fonction qui l'arrête. Ni confettis ni son : la scène n'a que le dessin. */
  const jouer = (quandTerminee: () => void) =>
    jouerLaScene({ fin: FIN, tDesConfettis: FIN, confettis: null, rendre }, quandTerminee, DUREE_DE_LA_SCENE_DE_REPONSE_FAUSSE_S);

  /** L'image fixe : Léo souriant, le pouce levé, le ballon à ses pieds ; rien ne bouge, aucune bulle écrite. */
  const montrerLEtatFinal = () => rendre(FIN);

  return { jouer, montrerLEtatFinal };
}
