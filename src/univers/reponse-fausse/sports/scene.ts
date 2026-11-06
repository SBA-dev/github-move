import type { CleDeTenue } from "@domain/motivation";
import { creerCoachLeo } from "../../celebrations/sports/personnage.ts";
import { assemblerLaScene } from "../commun/assembler-la-scene.ts";
import { creerLeBallon, creerLePoteau } from "./ballon-et-poteau.ts";
import { creerLaBulleDeLeo } from "./bulle.ts";
import { REGLAGES_DE_LEO_EN_REPONSE_FAUSSE } from "./reglages.ts";
import { FIN, SCENARIO_DE_LEO } from "./scenario.ts";

/** La scène de Léo : il tape son ballon, qui rebondit sur un petit poteau et revient rouler à ses pieds ; il rit, le pouce levé. */
export function creerLaScene(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const personnage = creerCoachLeo(racine, tenue, REGLAGES_DE_LEO_EN_REPONSE_FAUSSE);
  const ballon = creerLeBallon(racine);
  const poteau = creerLePoteau(racine);
  const bulle = creerLaBulleDeLeo(racine);

  function rendre(t: number) {
    personnage.dessiner(SCENARIO_DE_LEO, t);
    ballon.dessiner(t);
    poteau.dessiner(t);
    bulle?.dessiner(t);
  }

  /** L'image fixe : Léo souriant, le pouce levé, le ballon à ses pieds ; rien ne bouge, aucune bulle écrite. */
  return assemblerLaScene({ fin: FIN, rendre, rendreLEtatFinal: () => rendre(FIN) });
}
