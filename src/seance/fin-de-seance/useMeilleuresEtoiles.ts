import { useEffect, useState } from "react";
import type { Etoiles } from "@domain/apprentissage";
import { lireLesMeilleuresEtoiles } from "./lecture-des-meilleures-etoiles-supabase.ts";

/** Les meilleures étoiles du profil à cette leçon ; `undefined` tant qu'aucune séance n'est terminée (ou sans réseau). */
export function useMeilleuresEtoiles(profil: string, lecon: string): Etoiles | undefined {
  const [lues, setLues] = useState<{ readonly pour: string; readonly etoiles: Etoiles | undefined } | undefined>();
  const cle = `${profil}/${lecon}`;
  useEffect(() => {
    let annule = false;
    void lireLesMeilleuresEtoiles(profil, lecon).then((etoiles) => {
      if (!annule) setLues({ pour: cle, etoiles });
    });
    return () => {
      annule = true;
    };
  }, [profil, lecon, cle]);
  return lues?.pour === cle ? lues.etoiles : undefined;
}
