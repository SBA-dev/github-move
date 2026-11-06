import type { CleDeTenue } from "@domain/motivation";
import { creerLeChiot } from "../../celebrations/police/chiot.ts";
import { creerAgentMax } from "../../celebrations/police/personnage.ts";
import { assemblerLaScene } from "../commun/assembler-la-scene.ts";
import { creerUnSolDeScene } from "../commun/sol-de-scene.ts";
import { creerLaBulleDeMax } from "./bulle.ts";
import { creerLaCasquette } from "./casquette.ts";
import { PREFIXE_DE_MAX } from "./reglages.ts";
import { FIN, SCENARIO_DE_MAX } from "./scenario.ts";

/** Le petit coin d'herbe sous leurs pieds. */
const creerLHerbe = creerUnSolDeScene({ prefixe: PREFIXE_DE_MAX, apparition: .1, disparition: 1.25 });

/**
 * La scène de Max : en se penchant vers le chiot, il laisse glisser sa casquette ; le chiot la prend, fait un petit tour et la rapporte, restant au sol ;
 * Max la reprend, la remet en riant et lève le pouce.
 */
export function creerLaScene(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const max = creerAgentMax(racine, tenue, PREFIXE_DE_MAX);
  const chiot = creerLeChiot(racine, PREFIXE_DE_MAX);
  const casquette = creerLaCasquette(racine);
  const herbe = creerLHerbe(racine);
  const bulle = creerLaBulleDeMax(racine);

  function rendre(t: number) {
    const dessin = max.dessiner(SCENARIO_DE_MAX, t);
    chiot.dessiner(SCENARIO_DE_MAX, t, dessin);
    casquette.dessiner(t, dessin);
    herbe.dessiner(t);
    bulle?.dessiner(t);
  }

  /** L'image fixe : Max souriant, la casquette sur la tête, le pouce levé, le chiot assis à ses pieds ; ni herbe ni bulle écrite. */
  return assemblerLaScene({ fin: FIN, rendre, rendreLEtatFinal: () => rendre(FIN) });
}
