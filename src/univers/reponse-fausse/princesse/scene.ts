import type { CleDeTenue } from "@domain/motivation";
import { creerLumi } from "../../celebrations/princesses/personnage.ts";
import { assemblerLaScene } from "../commun/assembler-la-scene.ts";
import { creerLaBulleDeLumi } from "./bulle.ts";
import { creerLesBullesDeSavon } from "./bulles-de-savon.ts";
import { creerLaPrairie } from "./prairie.ts";
import { PREFIXE_DE_LUMI } from "./reglages.ts";
import { FIN, SCENARIO_DE_LUMI, SOL_Y } from "./scenario.ts";
import { creerLeSouffle } from "./souffle.ts";

/** La scène de Lumi : « pschitt ! », des bulles de savon sortent de la fleur de sa baguette ; Lumi rit, souffle dessus, baisse la baguette et lève le pouce. */
export function creerLaScene(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const lumi = creerLumi(racine, tenue, PREFIXE_DE_LUMI, SOL_Y);
  const bulles = creerLesBullesDeSavon(racine);
  const souffle = creerLeSouffle(racine);
  const prairie = creerLaPrairie(racine);
  const bulle = creerLaBulleDeLumi(racine);

  function rendre(t: number) {
    const { pose, boutDeLaBaguette } = lumi.dessiner(SCENARIO_DE_LUMI, t);
    bulles.dessiner(t, boutDeLaBaguette);
    souffle.dessiner(t, pose);
    prairie.dessiner(t);
    bulle?.dessiner(t);
  }

  return assemblerLaScene({ fin: FIN, rendre, rendreLEtatFinal: () => rendre(FIN) });
}
