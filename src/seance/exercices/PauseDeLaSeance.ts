import { createContext, useContext } from "react";

/** Vrai quand la feuille de pause est ouverte : le clavier physique ne tape plus dans l'exercice. */
export const PauseDeLaSeance = createContext(false);

export function usePauseOuverte(): boolean {
  return useContext(PauseDeLaSeance);
}
