import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/** Le trajet d'un mot, du centre de sa bulle au centre de sa place. */
export type Trajet = {
  readonly mot: string;
  readonly de: { readonly x: number; readonly y: number };
  readonly vers: { readonly x: number; readonly y: number };
};

export const DUREE_DU_VOYAGE_MS = 300;

type Props = {
  readonly trajet: Trajet;
  readonly onArrivee: () => void;
};

/** Le mot juste en chemin vers sa place : décor pour les yeux, jamais annoncé. */
export function MotQuiVoyage({ trajet, onArrivee }: Props) {
  const element = useRef<HTMLSpanElement>(null);
  const arrivee = useRef(onArrivee);
  useEffect(() => {
    arrivee.current = onArrivee;
  });
  const { de, vers } = trajet;
  useEffect(() => {
    const animation = element.current?.animate(
      [{ left: `${de.x}px`, top: `${de.y}px` }, { left: `${vers.x}px`, top: `${vers.y}px` }],
      { duration: DUREE_DU_VOYAGE_MS, easing: "ease-in-out", fill: "forwards" },
    );
    void animation?.finished.then(() => arrivee.current(), () => undefined);
    return () => animation?.cancel();
  }, [de.x, de.y, vers.x, vers.y]);
  return createPortal(
    <span ref={element} className="mot-qui-voyage" data-testid="mot-qui-voyage" aria-hidden="true" style={{ left: de.x, top: de.y }}>
      {trajet.mot}
    </span>,
    document.body,
  );
}
