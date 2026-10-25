import { useEffect, useState } from "react";
import { planDuTestDeDepart } from "@domain/apprentissage";
import type { ProfilEnCours } from "@domain/famille";
import { niveauDuProfil } from "../parcours/niveau-du-profil.ts";
import { chargerToutesLesLecons } from "../seance/bibliotheque.ts";
import { hasardDuNavigateur } from "../seance/hasard-navigateur.ts";
import { lireLEtatDuTestDeDepart } from "./etat-du-test-de-depart.ts";

/**
 * Vrai quand l'accueil de l'enfant doit proposer « Mon test de départ » : il n'est pas fait, et la bibliothèque donne au moins une question.
 * Faux tant que la lecture n'est pas finie, sans bibliothèque (rien à proposer, sans message d'erreur) et hors de l'accueil (`actif`).
 */
export function useTestDeDepartAFaire(profil: ProfilEnCours | undefined, actif: boolean): boolean {
  const [aFaire, setAFaire] = useState(false);
  const id = profil?.id;
  const classe = profil?.niveau;
  useEffect(() => {
    setAFaire(false);
    const niveau = classe === undefined ? undefined : niveauDuProfil(classe);
    if (!actif || id === undefined || niveau === undefined) return;
    let annule = false;
    void Promise.all([chargerToutesLesLecons(), lireLEtatDuTestDeDepart(id)]).then(([lecons, etat]) => {
      if (!annule) setAFaire(!etat.fait && planDuTestDeDepart(lecons, niveau, hasardDuNavigateur).length > 0);
    });
    return () => {
      annule = true;
    };
  }, [id, classe, actif]);
  return aFaire;
}
