import type { CleDeTenue } from "@domain/motivation";
import { fenetre, r1, r3 } from "../../celebrations/commun/courbes.ts";
import { elementsDe, poser } from "../../celebrations/commun/dom.ts";
import { creerCapitaineSam } from "../../celebrations/pompiers/personnage.ts";
import { creerLeRepere } from "../../celebrations/pompiers/repere.ts";
import { ECHELLE_DE_BASE as BASE } from "../../celebrations/pompiers/poses.ts";
import { assemblerLaScene } from "../commun/assembler-la-scene.ts";
import { creerUnSolDeScene } from "../commun/sol-de-scene.ts";
import { creerLaBulleDeSam } from "./bulle.ts";
import { poserLaFleur } from "./fleur.ts";
import { creerLeJet } from "./jet-d-eau.ts";
import { PREFIXE_DE_SAM, SOL_DU_CADRE } from "./reglages.ts";
import { FIN, SCENARIO_DE_SAM, SCENARIO_FIXE_DE_SAM } from "./scenario.ts";

/** Le petit coin d'herbe sous ses pieds et autour de la fleur : il reste jusqu'à la fin de la scène. */
const creerLHerbe = creerUnSolDeScene({ prefixe: PREFIXE_DE_SAM, apparition: .1, disparition: FIN });
/** La lance apparaît dans la première dixième de seconde (le dessin fixe de Sam n'en a pas). */
const DUREE_D_APPARITION_DE_LA_LANCE = .1;

/**
 * La scène de Sam : il lève sa lance à eau, le petit jet retombe en gouttes loin devant lui, du côté de la fleur ; il rit en les regardant,
 * ajuste sa lance (tenue relevée), puis lève le pouce.
 */
export function creerLaScene(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const n = elementsDe(racine, PREFIXE_DE_SAM);
  const sam = creerCapitaineSam(racine, tenue, PREFIXE_DE_SAM);
  const jet = creerLeJet(racine, sam, creerLeRepere(racine, PREFIXE_DE_SAM), SCENARIO_DE_SAM);
  const herbe = creerLHerbe(racine);
  const bulle = creerLaBulleDeSam(racine);
  poserLaFleur(racine);

  /** L'ombre du moteur est ramenée au sol du cadre : plus petite, sur l'herbe elle ne déborde pas des bottes. */
  function poserLOmbreAuSol() {
    const ombre = n("ombre-sol");
    poser(ombre, "cy", r1((SOL_DU_CADRE + 1) * BASE));
    poser(ombre, "rx", 26);
    poser(ombre, "ry", 4);
    poser(ombre, "opacity", .14);
  }

  function rendre(t: number) {
    sam.dessiner(SCENARIO_DE_SAM, t);
    poser(n("lance-tenue"), "opacity", r3(fenetre(t, 0, DUREE_D_APPARITION_DE_LA_LANCE)));
    herbe.dessiner(t);
    poserLOmbreAuSol();
    jet.dessiner(t);
    bulle?.dessiner(t);
  }

  /** L'image fixe : Sam au centre, souriant, le pouce levé, la lance tenue relevée, la fleur à côté ; ni goutte ni bulle écrite. */
  function rendreLEtatFinal() {
    sam.dessiner(SCENARIO_FIXE_DE_SAM, FIN);
    poser(n("lance-tenue"), "opacity", 1);
    herbe.dessiner(FIN);
    poserLOmbreAuSol();
  }

  return assemblerLaScene({ fin: FIN, rendre, rendreLEtatFinal });
}
