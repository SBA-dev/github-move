import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ProfilEnfant } from "@domain/famille";
import { enProfilEnfant, type LigneDeProfil } from "./ligne-de-profil.ts";
import { lireLesProfilsDuParent, parentConnecte } from "./lecture-des-profils-supabase.ts";
import { ProfilsGardesSurLAppareil } from "./profils-gardes-sur-l-appareil.ts";

export type EtatDesProfils =
  | { readonly type: "chargement" }
  | { readonly type: "indisponible" }
  | { readonly type: "charges"; readonly profils: readonly ProfilEnfant[] };

/** Une ligne illisible est ignorée : elle ne fait pas perdre les autres profils. */
function enProfils(lignes: readonly LigneDeProfil[]): ProfilEnfant[] {
  return lignes.flatMap((ligne) => {
    try {
      return [enProfilEnfant(ligne)];
    } catch {
      return [];
    }
  });
}

/**
 * Les profils enfants du parent connecté : lus sous RLS, gardés sur l'appareil, relus sans réseau depuis cette copie.
 * `aLire` dit quand la liste est utile (accueil, espace parent) : elle est alors relue,
 * ainsi qu'au retour de l'application au premier plan (visibilité, focus), une lecture à la fois.
 */
export function useProfilsDuParent(connecte: boolean, aLire: boolean) {
  const [etat, setEtat] = useState<EtatDesProfils>({ type: "chargement" });
  const [relecture, setRelecture] = useState(0);
  const appareil = useMemo(() => new ProfilsGardesSurLAppareil(), []);
  const lectureEnCours = useRef(false);
  const dejaAffiche = useRef(false);

  useEffect(() => {
    if (!connecte) setEtat({ type: "chargement" });
  }, [connecte]);

  useEffect(() => {
    if (!connecte || !aLire) return;
    let annule = false;
    const afficher = (lignes: readonly LigneDeProfil[]): boolean => {
      if (annule) return false;
      setEtat({ type: "charges", profils: enProfils(lignes) });
      dejaAffiche.current = true;
      return true;
    };
    lectureEnCours.current = true;
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
        if (!annule && !gardesAffichees && !dejaAffiche.current) setEtat({ type: "indisponible" });
      } finally {
        if (!annule) lectureEnCours.current = false;
      }
    })();
    return () => {
      annule = true;
      lectureEnCours.current = false;
    };
  }, [connecte, aLire, relecture, appareil]);

  useEffect(() => {
    if (!connecte || !aLire) return;
    const relireSiLibre = () => {
      if (!lectureEnCours.current) setRelecture((rang) => rang + 1);
    };
    const auRetourDeLApplication = () => {
      if (document.visibilityState === "visible") relireSiLibre();
    };
    document.addEventListener("visibilitychange", auRetourDeLApplication);
    globalThis.addEventListener("focus", relireSiLibre);
    return () => {
      document.removeEventListener("visibilitychange", auRetourDeLApplication);
      globalThis.removeEventListener("focus", relireSiLibre);
    };
  }, [connecte, aLire]);

  const relire = useCallback(() => setRelecture((rang) => rang + 1), []);
  return { etat, relire };
}
