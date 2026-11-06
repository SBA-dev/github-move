import { type Courbe, E, fenetre, r3 } from "../../celebrations/commun/courbes.ts";
import { deplacer, elementsDe, poser, type PrefixeDeScene } from "../../celebrations/commun/dom.ts";

export type ReglagesDeLaBulleEcrite = {
  readonly prefixe: PrefixeDeScene;
  /** L'identifiant du groupe de la bulle, sans préfixe (`oh`, `oups`, `hop`) ; son corps est `<identifiant>-corps`. */
  readonly identifiant: string;
  /** L'instant où la bulle apparaît, en secondes de la scène. */
  readonly apparition: number;
  /** Là où se pose la bulle dans le cadre (`translate(x y)`). */
  readonly position: string;
  /** La taille d'arrivée de la bulle. */
  readonly echelle: number;
  readonly dureeDEntree: number;
  readonly courbeDEntree: Courbe;
  /** L'instant où la bulle commence à s'effacer. */
  readonly disparition: number;
};

/** La petite bulle écrite d'une scène de réponse fausse : elle grandit en un instant, puis s'efface. Décor du dessin, jamais lue. Rien quand le dessin n'en porte pas. */
export function creerLaBulleEcrite(racine: SVGSVGElement, reglages: ReglagesDeLaBulleEcrite) {
  const { prefixe, identifiant, apparition, position, echelle, dureeDEntree, courbeDEntree, disparition } = reglages;
  if (!racine.querySelector(`#${prefixe}-${identifiant}`)) return undefined;
  const n = elementsDe(racine, prefixe);

  function dessiner(t: number) {
    const entree = fenetre(t, apparition, dureeDEntree, courbeDEntree), sortie = fenetre(t, disparition, .12, E.entree);
    poser(n(identifiant), "opacity", r3(fenetre(t, apparition, .06) * (1 - sortie)));
    deplacer(n(`${identifiant}-corps`), `${position} scale(${r3((.4 + .6 * entree) * echelle)})`);
  }

  return { dessiner };
}
