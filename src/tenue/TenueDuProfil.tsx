import { createContext, type ReactNode, useContext } from "react";
import { tenueAMontrer } from "@domain/motivation";
import { useTenuePortee } from "./useTenuePortee.ts";

const TenueDuProfilContexte = createContext<string | undefined>(undefined);

/**
 * Donne à tous les personnages guides de l'enfant la tenue qu'il a choisie, sans relire ses étoiles : le total ne baisse
 * jamais, une tenue reçue au moment du choix le reste (hors ligne compris). Sans profil, aucune tenue.
 */
export function TenueDuProfil({ profil, children }: { readonly profil: string | undefined; readonly children: ReactNode }) {
  const [portee] = useTenuePortee(profil);
  return <TenueDuProfilContexte.Provider value={tenueAMontrer(portee)?.cle}>{children}</TenueDuProfilContexte.Provider>;
}

export function useTenueDuProfil(): string | undefined {
  return useContext(TenueDuProfilContexte);
}
