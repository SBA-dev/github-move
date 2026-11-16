import { type KeyboardEvent, useEffect, useRef } from "react";

type Props = {
  readonly onContinuer: () => void;
  readonly onRetourALaLecon: () => void;
};

/** La pause attend l'enfant, sans compte à rebours ni reproche : il continue là où il en était, ou retourne à la page de la leçon. */
export function FeuilleDePause({ onContinuer, onRetourALaLecon }: Props) {
  const feuille = useRef<HTMLDivElement>(null);
  const continuer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const avant = document.activeElement;
    continuer.current?.focus();
    return () => {
      if (avant instanceof HTMLElement && avant.isConnected) avant.focus();
    };
  }, []);

  useEffect(() => {
    const surEchap = (evenement: globalThis.KeyboardEvent) => {
      if (evenement.key === "Escape") onContinuer();
    };
    document.addEventListener("keydown", surEchap);
    return () => document.removeEventListener("keydown", surEchap);
  }, [onContinuer]);

  const gardeLeFocusDansLaFeuille = (evenement: KeyboardEvent<HTMLDivElement>) => {
    if (evenement.key !== "Tab") return;
    const boutons = feuille.current?.querySelectorAll<HTMLButtonElement>("button") ?? [];
    const premier = boutons[0];
    const dernier = boutons[boutons.length - 1];
    if (evenement.shiftKey && document.activeElement === premier) {
      evenement.preventDefault();
      dernier?.focus();
    } else if (!evenement.shiftKey && document.activeElement === dernier) {
      evenement.preventDefault();
      premier?.focus();
    }
  };

  return (
    <div className="voile-de-la-pause">
      <div
        ref={feuille}
        className="feuille-de-pause"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-de-la-pause"
        onKeyDown={gardeLeFocusDansLaFeuille}
      >
        <h3 id="titre-de-la-pause">On fait une pause ?</h3>
        <button ref={continuer} type="button" className="continuer-la-lecon" onClick={onContinuer}>Je continue la leçon</button>
        <button type="button" className="retour-a-la-lecon" onClick={onRetourALaLecon}>Retour à la leçon</button>
      </div>
    </div>
  );
}
