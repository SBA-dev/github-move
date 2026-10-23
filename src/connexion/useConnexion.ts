import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DemanderLienDeConnexion, OuvrirLaConnexionAvecLeCode, SeDeconnecter } from "@domain/famille";
import { clientSupabase, connexionConfiguree } from "./client-supabase.ts";
import { DonneesDeLAppareilNavigateur } from "./donnees-de-l-appareil-navigateur.ts";
import { lienDeConnexionRefuse, lienDeConnexionSuivi } from "./lien-refuse.ts";
import { ServiceDeConnexionSupabase } from "./service-de-connexion-supabase.ts";

export type EtatDeLaConnexion = "verification" | "deconnecte" | "connecte";

function nettoyerLAdresse(): void {
  history.replaceState(history.state, "", location.pathname);
}

export function useConnexion() {
  const [etat, setEtat] = useState<EtatDeLaConnexion>(connexionConfiguree() ? "verification" : "deconnecte");
  const arrivee = useRef({
    parLeLien: lienDeConnexionSuivi(new URL(location.href)),
    lienRefuse: lienDeConnexionRefuse(new URL(location.href)),
  });
  const [lienRefuse, setLienRefuse] = useState(arrivee.current.lienRefuse);

  useEffect(() => {
    if (!connexionConfiguree()) return;
    const { data } = clientSupabase().auth.onAuthStateChange((_evenement, session) => {
      setEtat(session ? "connecte" : "deconnecte");
    });
    if (arrivee.current.lienRefuse) nettoyerLAdresse();
    return () => data.subscription.unsubscribe();
  }, []);

  const cas = useMemo(() => {
    const service = new ServiceDeConnexionSupabase();
    return {
      demanderLeLien: new DemanderLienDeConnexion(service),
      ouvrirAvecLeCode: new OuvrirLaConnexionAvecLeCode(service),
      seDeconnecter: new SeDeconnecter(service, new DonneesDeLAppareilNavigateur()),
    };
  }, []);

  const oublierLeLienRefuse = useCallback(() => setLienRefuse(false), []);
  const arriveParLeLien = arrivee.current.parLeLien;
  const consommerLArrivee = useCallback(() => {
    arrivee.current.parLeLien = false;
    nettoyerLAdresse();
  }, []);

  return { etat, lienRefuse, oublierLeLienRefuse, arriveParLeLien, consommerLArrivee, ...cas };
}

export type Connexion = ReturnType<typeof useConnexion>;
