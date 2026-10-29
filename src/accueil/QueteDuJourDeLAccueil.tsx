import { AUTRE_CHOSE, OUI_ON_Y_VA } from "./textes-de-l-accueil.ts";

type Props = {
  /** La parole du personnage guide pour la quête du jour. */
  readonly parole: string;
  /** Vrai quand la quête est accomplie : la parole se dit calmement, sans boutons. */
  readonly accomplie: boolean;
  readonly onAccepter: () => void;
  readonly onAutreChose: () => void;
};

/** La proposition du personnage guide, collée à sa bulle : deux boutons tant que la quête reste à faire, une phrase calme quand elle est accomplie. */
export function QueteDuJourDeLAccueil({ parole, accomplie, onAccepter, onAutreChose }: Props) {
  return (
    <section className="quete-du-jour" data-testid="quete-du-jour" data-etat={accomplie ? "accomplie" : "proposee"} aria-label="Quête du jour">
      <p data-testid="proposition-de-la-quete">{parole}</p>
      {!accomplie && (
        <div className="actions-de-la-quete">
          <button type="button" className="action-principale" onClick={onAccepter}>{OUI_ON_Y_VA}</button>
          <button type="button" className="secondaire" onClick={onAutreChose}>{AUTRE_CHOSE}</button>
        </div>
      )}
    </section>
  );
}
