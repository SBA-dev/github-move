import { useEffect, useState } from "react";
import { queteAccomplieParLaSeance } from "@domain/motivation";
import { lireLaQueteApresLaSeance, type QueteLueAvantLaSeance } from "./lire-la-quete-du-jour.ts";

export type QueteAccomplie = { readonly prete: boolean; readonly accomplie: boolean };

/**
 * Vrai si la séance accomplit la quête du jour, une fois lue la quête d'avant la séance puis celle d'après.
 * Sans l'une des deux (lecture impossible), aucune fête.
 */
export function useQueteAccomplieParLaSeance(
  queteAvant: Promise<QueteLueAvantLaSeance | undefined>,
  profil: string,
  terminee: boolean,
): QueteAccomplie {
  const [resultat, setResultat] = useState<QueteAccomplie>({ prete: false, accomplie: false });
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void queteAvant
      .then(async (avant) => {
        const apres = avant && await lireLaQueteApresLaSeance(profil, avant.propositions);
        return avant !== undefined && apres !== undefined && queteAccomplieParLaSeance(avant.quete, apres);
      })
      .catch(() => false)
      .then((accomplie) => {
        if (!annule) setResultat({ prete: true, accomplie });
      });
    return () => {
      annule = true;
    };
  }, [queteAvant, profil, terminee]);
  return resultat;
}
