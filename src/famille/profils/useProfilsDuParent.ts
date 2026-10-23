import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProfilEnfant } from "@domain/famille";
import { enProfilEnfant, type LigneDeProfil } from "./ligne-de-profil.ts";
import { lireLesProfilsDuParent, parentConnecte } from "./lecture-des-profils-supabase.ts";
import { ProfilsGardesSurLAppareil } from "./profils-gardes-sur-l-appareil.ts";

export type EtatDesProfils =
  | { readonly type: "chargement" }
  | { readonly type: "indisponible" }
  | { readonly type: "charges"; readonly profils: readonly ProfilEnfant[] };

function enProfils(lignes: readonly LigneDeProfil[]): ProfilEnfant[] | undefined {
  try {
    return lignes.map(enProfilEnfant);
  } catch {
    return undefined;
  }
}

/**
 * Les profils enfants du parent connecté : lus sous RLS, gardés sur l'appareil, relus sans réseau depuis cette copie.
 * `aLire` dit quand la liste est utile (accueil, espace parent) : elle est alors relue.
 */
export function useProfilsDuParent(connecte: boolean, aLire: boolean) {
  const [etat, setEtat] = useState<EtatDesProfils>({ type: "chargement" });
  const [relecture, setRelecture] = useState(0);
  const appareil = useMemo(() => new ProfilsGardesSurLAppareil(), []);

  useEffect(() => {
    if (!connecte) setEtat({ type: "chargement" });
  }, [connecte]);

  useEffect(() => {
    if (!connecte || !aLire) return;
    let annule = false;
    const afficher = (lignes: readonly LigneDeProfil[]): boolean => {
      const profils = enProfils(lignes);
      if (annule || profils === undefined) return false;
      setEtat({ type: "charges", profils });
      return true;
    };
    void (async () => {
      const parent = await parentConnecte();
      const gardes = parent === undefined ? undefined : await appareil.lire(parent);
      const gardesAffichees = gardes !== undefined && afficher(gardes);
      try {
        const lus = await lireLesProfilsDuParent();
        if (annule) return;
        await appareil.garder(lus.parent, lus.lignes);
        afficher(lus.lignes);
      } catch {
        if (!annule && !gardesAffichees) setEtat({ type: "indisponible" });
      }
    })();
    return () => {
      annule = true;
    };
  }, [connecte, aLire, relecture, appareil]);

  const relire = useCallback(() => setRelecture((rang) => rang + 1), []);
  return { etat, relire };
}
