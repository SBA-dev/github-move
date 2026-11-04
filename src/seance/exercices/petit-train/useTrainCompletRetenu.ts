import { useEffect, useState } from "react";

/** Une célébration ne retient jamais l'enfant (97.23) : le train complet ne reste pas plus longtemps. */
export const DUREE_MAX_DU_TRAIN_COMPLET_MS = 1500;

/**
 * Le dernier vers remis en place, le train complet reste à l'écran pendant la félicitation de Noisette avant les mots cachés (#130.5) :
 * jusqu'à la fin de la félicitation, ou après 1,5 s au plus. Sans félicitation à dire, le passage est immédiat.
 */
export function useTrainCompletRetenu(motsCachesCommences: boolean, felicitationFinie: boolean): boolean {
  const [retenu, setRetenu] = useState(false);
  const [dejaCommences, setDejaCommences] = useState(motsCachesCommences);
  if (dejaCommences !== motsCachesCommences) {
    setDejaCommences(motsCachesCommences);
    setRetenu(motsCachesCommences);
  }
  useEffect(() => {
    if (!retenu) return;
    const minuteur = setTimeout(() => setRetenu(false), DUREE_MAX_DU_TRAIN_COMPLET_MS);
    return () => clearTimeout(minuteur);
  }, [retenu]);
  return retenu && !felicitationFinie;
}
