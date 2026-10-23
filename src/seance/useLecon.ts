import { useEffect, useState } from "react";
import type { Lecon, SectionDuProgramme } from "@domain/catalogue";
import { chargerLaLecon, chargerLaSectionDuProgramme } from "./bibliotheque.ts";

export type LeconChargee =
  | { readonly type: "chargement" }
  | { readonly type: "trouvee"; readonly lecon: Lecon }
  | { readonly type: "introuvable" };

type Resultat<T> = { readonly pour: string; readonly valeur: T };

function useChargement<T>(cle: string | undefined, charger: (cle: string) => Promise<T>): Resultat<T> | undefined {
  const [resultat, setResultat] = useState<Resultat<T> | undefined>();
  useEffect(() => {
    if (cle === undefined) return;
    let annule = false;
    void charger(cle).then((valeur) => {
      if (!annule) setResultat({ pour: cle, valeur });
    });
    return () => {
      annule = true;
    };
  }, [cle, charger]);
  return resultat?.pour === cle ? resultat : undefined;
}

export function useLecon(identifiant: string): LeconChargee {
  const resultat = useChargement(identifiant, chargerLaLecon);
  if (!resultat) return { type: "chargement" };
  return resultat.valeur ? { type: "trouvee", lecon: resultat.valeur } : { type: "introuvable" };
}

export function useSectionDuProgramme(identifiant: string): SectionDuProgramme | undefined {
  return useChargement(identifiant, chargerLaSectionDuProgramme)?.valeur;
}
