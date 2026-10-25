import { useCallback, useEffect, useMemo, useState } from "react";
import { ChoisirQuiJoue, type ProfilEnCours, Reglages } from "@domain/famille";
import { universDe } from "@domain/motivation";

// Porte réservée aux tests (décision 0021) : l'import dynamique reste sous la garde du développement,
// le bundle de production ne contient pas le module.
const chargerProfilPrepare = import.meta.env.DEV
  ? () => import("./profil-prepare.ts").then((m) => m.lireProfilPrepare())
  : undefined;

/**
 * Le profil en cours : un état de l'application, jamais mémorisé d'une ouverture à l'autre (décision n°7 du lot 2).
 * Adaptateur du port `ProfilEnCoursSurLAppareil` en état React.
 *
 * Le profil préparé (porte réservée aux tests, en développement seulement, décision 0021) sert de profil
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
