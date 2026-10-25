import { useEffect, useState } from "react";
import { type MeilleuresEtoilesDuProfil, type ObjetDeLaCabane, objetRecuParLaSeance } from "@domain/motivation";

export type ObjetRecu = { readonly pret: boolean; readonly objet: ObjetDeLaCabane | undefined };

/**
 * L'objet que la cabane a reçu grâce à la séance, une fois lues les meilleures étoiles d'avant la séance.
 * Sans elles (lecture impossible), aucun objet n'est annoncé.
 */
export function useObjetRecuParLaSeance(
  meilleuresAvant: Promise<MeilleuresEtoilesDuProfil | undefined>,
  lecon: string,
  terminee: boolean,
  etoiles: number | undefined,
): ObjetRecu {
  const [recu, setRecu] = useState<ObjetRecu>({ pret: false, objet: undefined });
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void meilleuresAvant.then((avant) => {
      const objet = avant === undefined ? undefined : objetRecuParLaSeance(avant, lecon, etoiles);
      if (!annule) setRecu({ pret: true, objet });
    }).catch(() => {
      if (!annule) setRecu({ pret: true, objet: undefined });
    });
    return () => {
      annule = true;
    };
  }, [meilleuresAvant, lecon, terminee, etoiles]);
  return recu;
}
