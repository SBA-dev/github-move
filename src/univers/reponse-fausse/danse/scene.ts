import type { CleDeTenue } from "@domain/motivation";
import { creerLili, type PosesEtExpressions } from "../../celebrations/danse/personnage.ts";
import { assemblerLaScene } from "../commun/assembler-la-scene.ts";
import { creerLaBulleDeLili } from "./bulle.ts";
import { PREFIXE_DE_LILI } from "./reglages.ts";
import { FIN, SCENARIO_DE_LILI, SCENARIO_FIXE_DE_LILI } from "./scenario.ts";
import { creerLeTapis } from "./tapis.ts";

/** La scène de Lili : elle se hisse sur les demi-pointes, vacille à peine, fait un pas de côté et une révérence, puis lève le pouce en souriant. */
export function creerLaScene(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const lili = creerLili(racine, tenue, PREFIXE_DE_LILI);
  const tapis = creerLeTapis(racine);
  const bulle = creerLaBulleDeLili(racine);

  function rendre(t: number, scenario: PosesEtExpressions = SCENARIO_DE_LILI) {
    lili.dessiner(scenario, t);
    tapis.dessiner(t);
    bulle?.dessiner(t);
  }

  /** L'image fixe : Lili au centre, souriante, le pouce levé, d'aplomb ; à la fin de la scène, le tapis et la bulle écrite sont effacés. */
  return assemblerLaScene({ fin: FIN, rendre: (t) => rendre(t), rendreLEtatFinal: () => rendre(FIN, SCENARIO_FIXE_DE_LILI) });
}
