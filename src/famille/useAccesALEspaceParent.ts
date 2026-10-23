import { useCallback, useRef, useState } from "react";
import { AccesALEspaceParent, type EtatDeLEspaceParent, type ResultatDeLaReponse } from "@domain/famille";
import { hasardDuNavigateur } from "./hasard-navigateur.ts";

export function useAccesALEspaceParent() {
  const acces = useRef(new AccesALEspaceParent(hasardDuNavigateur));
  const [etat, setEtat] = useState<EtatDeLEspaceParent>(() => acces.current.etat());

  const demanderLEntree = useCallback(() => {
    acces.current.demanderLEntree();
    setEtat(acces.current.etat());
  }, []);

  const repondre = useCallback((saisie: string): ResultatDeLaReponse => {
    const resultat = acces.current.repondre(saisie);
    setEtat(acces.current.etat());
    return resultat;
  }, []);

  const quitter = useCallback(() => {
    acces.current.quitter();
    setEtat(acces.current.etat());
  }, []);

  return { etat, demanderLEntree, repondre, quitter };
}
