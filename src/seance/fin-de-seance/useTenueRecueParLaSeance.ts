import { useEffect, useState } from "react";
import {
  type MeilleuresEtoilesDuProfil,
  type TenueDuPersonnageGuide,
  tenueRecueParLaSeance,
} from "@domain/motivation";

export type TenueRecue = { readonly prete: boolean; readonly tenue: TenueDuPersonnageGuide | undefined };

/**
 * La tenue que le personnage guide a reçue grâce à la séance, une fois lues les meilleures étoiles d'avant la séance.
 * Sans elles (lecture impossible), aucune tenue n'est annoncée.
 */
export function useTenueRecueParLaSeance(
  meilleuresAvant: Promise<MeilleuresEtoilesDuProfil | undefined>,
  lecon: string,
  terminee: boolean,
  etoiles: number | undefined,
): TenueRecue {
  const [recue, setRecue] = useState<TenueRecue>({ prete: false, tenue: undefined });
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void meilleuresAvant.then((avant) => {
      const tenue = avant === undefined ? undefined : tenueRecueParLaSeance(avant, lecon, etoiles);
      if (!annule) setRecue({ prete: true, tenue });
    }).catch(() => {
      if (!annule) setRecue({ prete: true, tenue: undefined });
    });
    return () => {
      annule = true;
    };
  }, [meilleuresAvant, lecon, terminee, etoiles]);
  return recue;
}
