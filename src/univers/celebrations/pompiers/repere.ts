import { elementsDe } from "../commun/dom.ts";
import type { Point } from "../commun/membres.ts";

function graphique(element: SVGElement): SVGGraphicsElement {
  if (!(element instanceof SVGGraphicsElement)) throw new Error("Cet élément de la scène des pompiers ne se dessine pas");
  return element;
}

/**
 * Où se trouve un point d'un élément de la scène, dans le repère de la scène (360 sur 450) : la lance et la main de Sam se déplacent dans des groupes
 * tournés et agrandis, et le jet, le tuyau, la corde et les étincelles doivent les suivre.
 */
export function creerLeRepere(racine: SVGSVGElement): (element: SVGElement, x?: number, y?: number) => Point {
  const repere = graphique(elementsDe(racine, "pompier")("repere"));
  return (element, x = 0, y = 0) => {
    const m = (repere.getCTM() ?? new DOMMatrix()).inverse().multiply(graphique(element).getCTM() ?? new DOMMatrix());
    return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f };
  };
}

export type Repere = ReturnType<typeof creerLeRepere>;
