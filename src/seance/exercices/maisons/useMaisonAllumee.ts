import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { DUREE_DE_L_OUVERTURE_S } from "./DessinDeLaMaison.tsx";

const ATTENTE_DE_L_OUVERTURE_MS = DUREE_DE_L_OUVERTURE_S * 1000;

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
