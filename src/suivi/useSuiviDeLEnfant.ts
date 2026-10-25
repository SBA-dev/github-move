import { useEffect, useState } from "react";
import { suiviDeLEnfant, type SuiviDeLEnfant } from "@domain/accompagnement";
import { Niveau } from "@domain/catalogue";
import { ProfilEnfantId } from "@domain/famille";
import { chargerLesSectionsDuProgramme, chargerToutesLesLecons } from "../seance/bibliotheque.ts";
import { lireLesDonneesDuSuivi } from "./lecture-du-suivi-supabase.ts";

export type EtatDuSuivi =
  | { readonly type: "chargement" }
  | { readonly type: "indisponible" }
  | { readonly type: "pret"; readonly suivi: SuiviDeLEnfant };

/** Le suivi de l'enfant : lu à chaque ouverture et à chaque changement d'enfant ou de classe, jamais gardé. */
export function useSuiviDeLEnfant(id: string, prenom: string, niveau: string): EtatDuSuivi {
  const [etat, setEtat] = useState<EtatDuSuivi>({ type: "chargement" });
  useEffect(() => {
    let annule = false;
    setEtat({ type: "chargement" });
    void (async () => {
      const [lecons, sections, donnees] = await Promise.all([
        chargerToutesLesLecons(),
        chargerLesSectionsDuProgramme(),
        lireLesDonneesDuSuivi(id),
      ]);
      if (annule) return;
      setEtat(
        donnees === undefined
          ? { type: "indisponible" }
          : {
            type: "pret",
            suivi: suiviDeLEnfant({
              enfant: { id: ProfilEnfantId.de(id), prenom, niveau: Niveau.de(niveau) },
              lecons,
              sections,
              ...donnees,
            }),
          },
      );
    })();
    return () => {
      annule = true;
    };
  }, [id, prenom, niveau]);
  return etat;
}
