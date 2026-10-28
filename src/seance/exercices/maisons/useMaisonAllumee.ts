import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const ATTENTE_DE_L_OUVERTURE_MS = 350;

/** Une maison s'allume une fois sa porte ouverte (jamais avant) ; avec les mouvements réduits, aussitôt. */
export function useMaisonAllumee(ouverte: boolean): boolean {
  const mouvementsReduits = useReducedMotion();
  const [apresLOuverture, setApresLOuverture] = useState(false);
  useEffect(() => {
    if (!ouverte) {
      setApresLOuverture(false);
      return;
    }
    const minuteur = setTimeout(() => setApresLOuverture(true), ATTENTE_DE_L_OUVERTURE_MS);
    return () => clearTimeout(minuteur);
  }, [ouverte]);
  return ouverte && (mouvementsReduits === true || apresLOuverture);
}
