/** Faux quand le navigateur sait qu'il est hors ligne : inutile alors d'attendre le serveur. */
export function reseauDisponible(): boolean {
  return navigator.onLine;
}
