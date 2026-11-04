import { useEffect, useState } from "react";

export type EtatDeLaJauge = "vide" | "se-remplit" | "pleine";

/** Court (400 ms au plus) : l'enfant n'attend pas, et la voix de Noisette continue pendant ce temps. */
export const DUREE_DU_REMPLISSAGE_MS = 200;

/**
 * L'état de la jauge d'une barre : vide, puis elle se remplit, puis elle est pleine. Elle suit `rempli` : c'est à l'appelant de garder pleines les barres déjà remplies.
 * Une barre déjà remplie quand elle apparaît est pleine d'un coup ; avec les mouvements réduits, elle l'est toujours.
 */
export function useEtatDeLaJauge(rempli: boolean, mouvementsReduits: boolean): EtatDeLaJauge {
  const [etat, setEtat] = useState<EtatDeLaJauge>(rempli ? "pleine" : "vide");
  useEffect(() => {
    if (!rempli) {
      setEtat("vide");
      return;
    }
    setEtat((avant) => (avant === "pleine" ? avant : "se-remplit"));
    const minuteur = setTimeout(() => setEtat("pleine"), DUREE_DU_REMPLISSAGE_MS);
    return () => clearTimeout(minuteur);
  }, [rempli]);
  if (!rempli) return "vide";
  return mouvementsReduits ? "pleine" : etat;
}
