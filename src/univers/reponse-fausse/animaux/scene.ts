import type { CleDeTenue } from "@domain/motivation";
import { creerNoisette } from "../../celebrations/animaux/personnage.ts";
import { assemblerLaScene } from "../commun/jouer-la-scene.ts";
import { creerLaBulleDeNoisette } from "./bulle.ts";
import { creerLaNoisetteDoree } from "./noisette-doree.ts";
import { creerLePaysage } from "./prairie-et-branche.ts";
import { PREFIXE_DE_NOISETTE } from "./reglages.ts";
import { FIN, SCENARIO_DE_NOISETTE, T_PRISE } from "./scenario.ts";

/** La scène de Noisette : une noisette dorée se détache d'une branche, rebondit dans l'herbe ; Noisette rit, la ramasse et lève le pouce, les yeux grands ouverts. */
export function creerLaScene(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const noisette = creerNoisette(racine, tenue, PREFIXE_DE_NOISETTE);
  const dessinerNoisette = (t: number) => noisette.dessiner(SCENARIO_DE_NOISETTE, t, { yeuxOuverts: true });
  const noix = creerLaNoisetteDoree(racine, dessinerNoisette(T_PRISE).mains.d);
  const paysage = creerLePaysage(racine);
  const bulle = creerLaBulleDeNoisette(racine);

  function rendre(t: number) {
    const { mains } = dessinerNoisette(t);
    noix.dessiner(t, mains.d);
    paysage.dessiner(t);
    bulle?.dessiner(t);
  }

  /** L'image fixe : Noisette souriante, le pouce levé, la noisette dans l'autre main ; ni prairie, ni branche, ni bulle écrite. */
  return assemblerLaScene({ fin: FIN, rendre, rendreLEtatFinal: () => rendre(FIN) });
}
