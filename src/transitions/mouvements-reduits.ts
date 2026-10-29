import { useSyncExternalStore } from "react";

/** Lu à chaque affichage, pas une fois pour toutes : le réglage peut changer pendant que l'application est ouverte. */
export function mouvementsReduits(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const REQUETE = "(prefers-reduced-motion: reduce)";

function abonnerAuxMouvementsReduits(rappel: () => void): () => void {
  const requete = matchMedia(REQUETE);
  requete.addEventListener("change", rappel);
  return () => requete.removeEventListener("change", rappel);
}

/** Version réactive : l'affichage suit le réglage de l'appareil quand il change pendant que l'écran est monté. */
export function useMouvementsReduits(): boolean {
  return useSyncExternalStore(abonnerAuxMouvementsReduits, mouvementsReduits, () => false);
}
