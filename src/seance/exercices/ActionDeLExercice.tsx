import { createContext, type ReactNode, useContext } from "react";
import { createPortal } from "react-dom";

/** Où la séance de leçon pose les boutons d'action de l'exercice (sa barre d'action). Sans emplacement, ils restent dans l'exercice (révision, défi, test de départ). */
export const EmplacementDeLaBarreDAction = createContext<HTMLElement | null>(null);

export function useDansLaBarreDAction(): boolean {
  return useContext(EmplacementDeLaBarreDAction) !== null;
}

/** Un bouton d'action de l'exercice : dans la barre d'action de la séance quand elle existe, sur place sinon. */
export function ActionDeLExercice({ children }: { readonly children: ReactNode }) {
  const emplacement = useContext(EmplacementDeLaBarreDAction);
  return emplacement === null ? children : createPortal(children, emplacement);
}
