import { useEffect, useState } from "react";
import { type QueteDuJour, queteAccomplieParLaSeance } from "@domain/motivation";
import { lireLaQueteDuJour } from "./lire-la-quete-du-jour.ts";

export type QueteAccomplie = { readonly prete: boolean; readonly accomplie: boolean };

/**
 * Vrai si la séance accomplit la quête du jour, une fois lue la quête d'avant la séance puis celle d'après.
 * Sans l'une des deux (lecture impossible), aucune fête.
 */
export function useQueteAccomplieParLaSeance(
  queteAvant: Promise<QueteDuJour | undefined>,
  profil: string,
  niveau: string,
  terminee: boolean,
): QueteAccomplie {
  const [resultat, setResultat] = useState<QueteAccomplie>({ prete: false, accomplie: false });
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void Promise.all([queteAvant, lireLaQueteDuJour(profil, niveau)])
      .then(([avant, apres]) => avant !== undefined && apres !== undefined && queteAccomplieParLaSeance(avant, apres))
      .catch(() => false)
      .then((accomplie) => {
        if (!annule) setResultat({ prete: true, accomplie });
      });
    return () => {
      annule = true;
    };
  }, [queteAvant, profil, niveau, terminee]);
  return resultat;
}
