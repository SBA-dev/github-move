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

function chargerLaLeconDeLaCle(cle: string): Promise<Lecon | undefined> {
  const [profil = "", identifiant = ""] = cle.split("/");
  return chargerLaLecon(identifiant, profil);
}

/** La leçon de la bibliothèque, sinon une leçon personnelle du profil. */
export function useLecon(identifiant: string, profil: string): LeconChargee {
  const resultat = useChargement(`${profil}/${identifiant}`, chargerLaLeconDeLaCle);
  if (!resultat) return { type: "chargement" };
  return resultat.valeur ? { type: "trouvee", lecon: resultat.valeur } : { type: "introuvable" };
}

export function useSectionDuProgramme(identifiant: string): SectionDuProgramme | undefined {
  return useChargement(identifiant, chargerLaSectionDuProgramme)?.valeur;
}
