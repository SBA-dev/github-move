import { useEffect, useRef } from "react";
import type { Univers } from "@domain/motivation";
import { ParoleDuGuide } from "./ParoleDuGuide.tsx";
import { proposerLeTestDeDepart } from "./paroles-du-test-de-depart.ts";
import type { Personnage } from "./useDeroulementDuTestDeDepart.ts";

type Props = {
  readonly prenom: string;
  readonly personnage: Personnage;
  readonly univers: Univers;
  readonly onAccepter: () => void;
  readonly onPlusTard: () => void;
};

/** Le personnage guide propose le test de départ ; l'enfant l'accepte ou le remet à plus tard. */
export function PropositionDuTestDeDepart({ prenom, personnage, univers, onAccepter, onPlusTard }: Props) {
  const { dire, faireSilence, reecouter } = personnage;
  const accepter = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    accepter.current?.focus();
    void dire({ texte: proposerLeTestDeDepart(prenom), nature: "accueil" });
    return faireSilence;
  }, [prenom, dire, faireSilence]);

  return (
    <div className="proposition-du-test-de-depart" data-testid="proposition-du-test-de-depart">
      <ParoleDuGuide personnage={personnage} univers={univers} onReecouter={reecouter} />
      <div className="actions-de-fin">
        <button type="button" className="action-principale" ref={accepter} onClick={onAccepter}>Oui, on y va !</button>
        <button type="button" className="secondaire" onClick={onPlusTard}>Plus tard</button>
      </div>
    </div>
  );
}
