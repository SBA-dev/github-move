/** Lu à chaque affichage, pas une fois pour toutes : le réglage peut changer pendant que l'application est ouverte. */
export function mouvementsReduits(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
