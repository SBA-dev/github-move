import { useEffect, useRef } from "react";

const UNE_LETTRE = /^\p{L}$/u;

/** Au clavier d'un ordinateur : les lettres s'écrivent, « Retour arrière » efface. */
export function useClavierPhysique(actif: boolean, onTaper: (lettre: string) => void, onEffacer: () => void) {
  const actions = useRef({ onTaper, onEffacer });
  actions.current = { onTaper, onEffacer };

  useEffect(() => {
    if (!actif) return;
    const surUneTouche = (evenement: KeyboardEvent) => {
      if (evenement.ctrlKey || evenement.metaKey || evenement.altKey) return;
      if (evenement.key === "Backspace") {
        evenement.preventDefault();
        actions.current.onEffacer();
      } else if (UNE_LETTRE.test(evenement.key)) {
        actions.current.onTaper(evenement.key);
      }
    };
    globalThis.addEventListener("keydown", surUneTouche);
    return () => globalThis.removeEventListener("keydown", surUneTouche);
  }, [actif]);
}
