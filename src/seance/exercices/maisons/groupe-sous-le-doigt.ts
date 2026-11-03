export type Point = { readonly x: number; readonly y: number };

/** La maison (parmi celles que désigne `selecteur`) qui contient le point de l'écran, s'il y en a une. */
export function maisonSousLePoint(maisons: HTMLElement | null, selecteur: string, point: Point): HTMLElement | undefined {
  if (maisons === null) return undefined;
  return [...maisons.querySelectorAll<HTMLElement>(selecteur)].find((maison) => {
    const boite = maison.getBoundingClientRect();
    return point.x >= boite.left && point.x <= boite.right && point.y >= boite.top && point.y <= boite.bottom;
  });
}

/** Le groupe de la maison qui contient le point de l'écran, s'il y en a une (les maisons portent `data-groupe`). */
export function groupeSousLePoint(maisons: HTMLElement | null, point: Point): string | undefined {
  return maisonSousLePoint(maisons, "[data-groupe]", point)?.dataset.groupe;
}
