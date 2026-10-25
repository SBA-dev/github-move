import { useCallback, useEffect, useState } from "react";
import type { Lecon, SectionDuProgramme } from "@domain/catalogue";
import { chargerLaLecon, chargerLaSectionDuProgramme } from "./bibliotheque.ts";

export type LeconChargee =
  | { readonly type: "chargement" }
  | { readonly type: "trouvee"; readonly lecon: Lecon }
  | { readonly type: "introuvable" };

type Resultat<T> = { readonly pour: string; readonly valeur: T };

/** `charger` doit être stable tant que `cle` ne change pas ; la valeur d'une clé périmée n'est jamais rendue. */
function useChargement<T>(cle: string, charger: () => Promise<T>): Resultat<T> | undefined {
  const [resultat, setResultat] = useState<Resultat<T> | undefined>();
  useEffect(() => {
    let annule = false;
    void charger().then((valeur) => {
      if (!annule) setResultat({ pour: cle, valeur });
    });
    return () => {
      annule = true;
    };
  }, [cle, charger]);
  return resultat?.pour === cle ? resultat : undefined;
}

/** La leçon de la bibliothèque, sinon une leçon personnelle du profil. */
export function useLecon(identifiant: string, profil: string): LeconChargee {
  const charger = useCallback(() => chargerLaLecon(identifiant, profil), [identifiant, profil]);
  const resultat = useChargement(JSON.stringify([profil, identifiant]), charger);
  if (!resultat) return { type: "chargement" };
  return resultat.valeur ? { type: "trouvee", lecon: resultat.valeur } : { type: "introuvable" };
}

export function useSectionDuProgramme(identifiant: string): SectionDuProgramme | undefined {
  const charger = useCallback(() => chargerLaSectionDuProgramme(identifiant), [identifiant]);
  return useChargement(identifiant, charger)?.valeur;
}
