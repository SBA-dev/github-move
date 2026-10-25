import { useCallback, useEffect, useMemo, useState } from "react";
import { ChoisirQuiJoue, type ProfilEnCours, Reglages } from "@domain/famille";
import { universDe } from "@domain/motivation";
import { chargerProfilPrepare } from "../../demonstration/disponibilite.ts";

/**
 * Le profil en cours : un état de l'application, jamais mémorisé d'une ouverture à l'autre (décision n°7 du lot 2).
 * Adaptateur du port `ProfilEnCoursSurLAppareil` en état React.
 *
 * Le profil préparé (porte réservée aux tests, en développement ou avec VITE_PAGE_DEMONSTRATION=1) sert de profil
 * en cours initial : `chargerProfilPrepare` est absent d'un build de production.
 */
export function useProfilEnCours() {
  const [profil, setProfil] = useState<ProfilEnCours | undefined>();
  const [charge, setCharge] = useState(chargerProfilPrepare === undefined);
  const choisirQuiJoue = useMemo(() => new ChoisirQuiJoue({ definir: setProfil }), []);

  useEffect(() => {
    if (!chargerProfilPrepare) return;
    let annule = false;
    chargerProfilPrepare().then((prepare) => {
      if (annule) return;
      if (prepare) {
        const initial: ProfilEnCours = {
          id: "profil-prepare",
          prenom: prepare.prenom,
          niveau: prepare.niveau,
          univers: universDe(prepare.univers).cle,
          reglages: Reglages.depuis(prepare.reglages ?? {}),
        };
        setProfil((choisi) => choisi ?? initial);
      }
      setCharge(true);
    });
    return () => {
      annule = true;
    };
  }, []);

  const oublier = useCallback(() => setProfil(undefined), []);
  return { profil, charge, choisirQuiJoue, definir: setProfil, oublier };
}
