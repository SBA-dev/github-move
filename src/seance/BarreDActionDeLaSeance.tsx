import { createContext, type ReactNode, useContext, useState } from "react";
import { createPortal } from "react-dom";

/** `undefined` : pas de barre d'action sur cet écran ; `null` : la barre n'est pas encore posée. */
const EmplacementDeLaBarre = createContext<HTMLElement | null | undefined>(undefined);

/**
 * La barre d'action, collée en bas de la séance : elle accueille les boutons que les exercices lui confient et reste cachée quand il n'y en a aucun.
 * Les boutons gardent leur place dans l'arbre de leur exercice (état, gestes, retours) : seul leur emplacement à l'écran change.
 */
export function BarreDActionDeLaSeance({ children }: { readonly children: ReactNode }) {
  const [emplacement, setEmplacement] = useState<HTMLElement | null>(null);
  return (
    <EmplacementDeLaBarre.Provider value={emplacement}>
      {children}
      <div ref={setEmplacement} className="barre-d-action" data-testid="barre-d-action" />
    </EmplacementDeLaBarre.Provider>
  );
}

/** Vrai sur l'écran d'une séance de leçon : les exercices y confient leurs boutons à la barre d'action. */
export function useUneBarreDActionExiste(): boolean {
  return useContext(EmplacementDeLaBarre) !== undefined;
}

/**
 * Ce que l'exercice met dans la barre d'action : le bouton principal (`.action-principale`) et « Je ne sais pas » à côté.
 * Hors de la séance d'une leçon (test de départ, révision, défis), il n'y a pas de barre : les boutons restent dans l'exercice.
 */
export function DansLaBarreDAction({ children }: { readonly children: ReactNode }) {
  const emplacement = useContext(EmplacementDeLaBarre);
  if (emplacement === undefined) return <>{children}</>;
  return emplacement ? createPortal(children, emplacement) : null;
}
