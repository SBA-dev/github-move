import type { CleDeTenue } from "@domain/motivation";
import { jouerLaScene } from "../../celebrations/commun/jeu-de-la-scene.ts";
import { creerLili } from "../../celebrations/danse/personnage.ts";
import { DUREE_DE_LA_SCENE_DE_REPONSE_FAUSSE_S } from "../duree-de-la-scene.ts";
import { PREFIXE_DE_LILI } from "./reglages.ts";
import { FIN, SCENARIO_DE_LILI, SCENARIO_FIXE_DE_LILI } from "./scenario.ts";
import { creerLaBulleEcrite, creerLeTapis } from "./tapis-et-bulle.ts";

/** La scène de Lili : elle se hisse sur les demi-pointes, vacille à peine, fait un pas de côté et une révérence, puis lève le pouce en souriant. */
export function creerLaScene(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const lili = creerLili(racine, tenue, PREFIXE_DE_LILI);
  const tapis = creerLeTapis(racine);
  const bulle = creerLaBulleEcrite(racine);

  function rendre(t: number, scenario: typeof SCENARIO_DE_LILI | typeof SCENARIO_FIXE_DE_LILI = SCENARIO_DE_LILI) {
    lili.dessiner(scenario, t);
    tapis.dessiner(t);
    bulle?.dessiner(t);
  }

  /** Joue la scène image par image ; rend la fonction qui l'arrête. Ni confettis ni son : la scène n'a que le dessin. */
  const jouer = (quandTerminee: () => void) =>
    jouerLaScene({ fin: FIN, tDesConfettis: FIN, confettis: null, rendre: (t) => rendre(t) }, quandTerminee, DUREE_DE_LA_SCENE_DE_REPONSE_FAUSSE_S);

  /** L'image fixe : Lili au centre, souriante, le pouce levé, d'aplomb ; à la fin de la scène, le tapis et la bulle écrite sont effacés. */
  const montrerLEtatFinal = () => rendre(FIN, SCENARIO_FIXE_DE_LILI);

  return { jouer, montrerLEtatFinal };
}
