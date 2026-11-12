import { type KeyboardEvent as EvenementClavier, useEffect, useRef } from "react";
import { useModeDys } from "../reglages/index.ts";
import type { Voix } from "../voix/index.ts";

type Props = {
  readonly voix: Pick<Voix, "suspendre" | "reprendre">;
  readonly onContinuer: () => void;
  readonly onRetourALaLecon: () => void;
};

const ELEMENTS_ATTEIGNABLES = "button:not([disabled])";

/** Le reste de la séance (ses autres éléments et la barre d'action posée à côté) : inerte tant que la pause est ouverte. */
function lesElementsDerriereLaPause(voile: HTMLElement | null): readonly Element[] {
  const seance = voile?.parentElement;
  const autour = [voile, seance].flatMap((element) => Array.from(element?.parentElement?.children ?? []));
  return autour.filter((element) => element !== voile && element !== seance);
}

/**
 * La pause de la séance : une feuille qui laisse le choix entre reprendre et revenir à la leçon, sans reproche ni compte à rebours.
 * Tant qu'elle est ouverte la voix se tait ; à la reprise rien n'est relu (« Réécouter » est là pour ça).
 */
export function PauseDeLaSeance({ voix, onContinuer, onRetourALaLecon }: Props) {
  const modeDys = useModeDys();
  const voile = useRef<HTMLDivElement>(null);
  const fenetre = useRef<HTMLDivElement>(null);
  const jeContinue = useRef<HTMLButtonElement>(null);
  const { suspendre, reprendre } = voix;

  useEffect(() => {
    suspendre();
    return reprendre;
  }, [suspendre, reprendre]);

  useEffect(() => {
    const avant = document.activeElement;
    const reste = lesElementsDerriereLaPause(voile.current);
    reste.forEach((element) => element.setAttribute("inert", ""));
    jeContinue.current?.focus();
    return () => {
      reste.forEach((element) => element.removeAttribute("inert"));
      if (avant instanceof HTMLElement && avant.isConnected) avant.focus();
    };
  }, []);

  /** Le clavier ne sort pas de la pause : ni vers l'exercice derrière, ni vers la page. */
  const surUneTouche = (evenement: EvenementClavier<HTMLDivElement>) => {
    evenement.stopPropagation();
    if (evenement.key === "Escape") {
      evenement.preventDefault();
      onContinuer();
      return;
    }
    if (evenement.key !== "Tab") return;
    const boutons = Array.from(fenetre.current?.querySelectorAll<HTMLElement>(ELEMENTS_ATTEIGNABLES) ?? []);
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
    <div ref={voile} className="voile-de-la-pause" data-mode-dys={modeDys ? "true" : undefined}>
      <div
        ref={fenetre}
        className="pause-de-la-seance"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-de-la-pause"
        data-testid="pause-de-la-seance"
        onKeyDown={surUneTouche}
      >
        <h3 id="titre-de-la-pause">On fait une pause ?</h3>
        <button ref={jeContinue} type="button" className="je-continue-la-lecon" onClick={onContinuer}>Je continue la leçon</button>
        <button type="button" className="retour-a-la-lecon" onClick={onRetourALaLecon}>Retour à la leçon</button>
      </div>
    </div>
  );
}
