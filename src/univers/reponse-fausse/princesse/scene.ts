import type { CleDeTenue } from "@domain/motivation";
import { creerLumi } from "../../celebrations/princesses/personnage.ts";
import { assemblerLaScene } from "../commun/assembler-la-scene.ts";
import { creerLaBulleDeLumi } from "./bulle.ts";
import { creerLesBullesDeSavon } from "./bulles-de-savon.ts";
import { creerLaPrairie } from "./prairie.ts";
import { PREFIXE_DE_LUMI } from "./reglages.ts";
import { FIN, SCENARIO_DE_LUMI, SOL } from "./scenario.ts";
import { creerLeSouffle } from "./souffle.ts";

/** Les ressorts des cheveux suivent l'horloge : pour l'image fixe, on rejoue les images depuis le début, à cette cadence. */
const PAS_DE_REJEU = 1 / 60;

/** La scène de Lumi : « pschitt ! », des bulles de savon sortent de la fleur de sa baguette ; Lumi rit, souffle dessus, baisse la baguette et lève le pouce. */
export function creerLaScene(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const lumi = creerLumi(racine, tenue, PREFIXE_DE_LUMI, SOL.y);
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

  /** L'image fixe : Lumi souriante, le pouce levé, la baguette baissée ; à la fin de la scène, la prairie, la bulle écrite, les bulles de savon et le souffle sont effacés. */
  function rendreLEtatFinal() {
    for (let t = 0; t < FIN; t += PAS_DE_REJEU) rendre(t);
    rendre(FIN);
  }

  return assemblerLaScene({ fin: FIN, rendre, rendreLEtatFinal });
}
