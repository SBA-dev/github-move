import { useCallback, useRef, useState } from "react";

/**
 * La pause de la séance : ouverte, elle coupe la voix et retient ce que la séance enchaînerait d'elle-même
 * (la question suivante, sa consigne lue) jusqu'à ce que l'enfant continue.
 */
export function usePauseDeLaSeance(couperLaVoix: () => void) {
  const [ouverte, setOuverte] = useState(false);
  const ouverteMaintenant = useRef(false);
  const enAttente = useRef<(() => void)[]>([]);

  const ouvrir = useCallback(() => {
    couperLaVoix();
    ouverteMaintenant.current = true;
    setOuverte(true);
  }, [couperLaVoix]);

  const continuer = useCallback(() => {
    ouverteMaintenant.current = false;
    setOuverte(false);
    enAttente.current.splice(0).forEach((reprendre) => reprendre());
  }, []);

  const attendreLaFin = useCallback(
    (): Promise<void> => ouverteMaintenant.current ? new Promise((reprendre) => enAttente.current.push(reprendre)) : Promise.resolve(),
    [],
  );

  return { ouverte, ouvrir, continuer, attendreLaFin };
}
