export type Point = { readonly x: number; readonly y: number };

/** Le groupe de la maison qui contient le point de l'écran, s'il y en a une (les maisons portent `data-groupe`). */
export function groupeSousLePoint(maisons: HTMLElement | null, point: Point): string | undefined {
  if (maisons === null) return undefined;
  const sous = [...maisons.querySelectorAll<HTMLElement>("[data-groupe]")].find((maison) => {
    const boite = maison.getBoundingClientRect();
    return point.x >= boite.left && point.x <= boite.right && point.y >= boite.top && point.y <= boite.bottom;
  });
  return sous?.dataset.groupe;
}
