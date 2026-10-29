import { propositionDeLaQueteDuJour, type QueteDuJour } from "@domain/motivation";
import { AUTRE_CHOSE, OUI_ON_Y_VA } from "./textes-de-l-accueil.ts";

type Props = {
  readonly quete: QueteDuJour;
  readonly onAccepter: () => void;
  readonly onAutreChose: () => void;
};

/** La proposition du personnage guide, sous sa bulle : deux boutons tant que la quête reste à faire, une phrase calme quand elle est accomplie. Rien sans quête. */
export function QueteDuJourDeLAccueil({ quete, onAccepter, onAutreChose }: Props) {
  const proposition = propositionDeLaQueteDuJour(quete);
  if (proposition === undefined) return null;
  const accomplie = quete.genre === "accomplie";
  return (
    <section className="quete-du-jour" data-testid="quete-du-jour" data-etat={accomplie ? "accomplie" : "proposee"} aria-label="Quête du jour">
      <p data-testid="proposition-de-la-quete">{proposition}</p>
      {!accomplie && (
        <div className="actions-de-la-quete">
          <button type="button" className="action-principale" onClick={onAccepter}>{OUI_ON_Y_VA}</button>
          <button type="button" className="secondaire" onClick={onAutreChose}>{AUTRE_CHOSE}</button>
        </div>
      )}
    </section>
  );
}
