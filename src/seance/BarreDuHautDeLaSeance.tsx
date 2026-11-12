import type { Avancement } from "@domain/apprentissage";
import type { EtatDuSon } from "@domain/voix";
import { RecipientDeProgression } from "./RecipientDeProgression.tsx";

type Props = {
  readonly titre: string;
  readonly son: EtatDuSon;
  /** Sans avancement (séance finie), la barre ne montre que Retour, le titre et le choix Son/Muet. */
  readonly avancement: Avancement | undefined;
  readonly onRetour: () => void;
  readonly onBasculerLeSon: () => void;
};

/** Le haut de la séance : Retour, le titre de la leçon seul, le choix Son/Muet, puis la fine barre d'avancement et son compteur. */
export function BarreDuHautDeLaSeance({ titre, son, avancement, onRetour, onBasculerLeSon }: Props) {
  return (
    <div className="barre-du-haut" data-testid="barre-du-haut">
      <div className="rangee-du-haut">
        <button type="button" className="retour-de-la-seance" aria-label="Retour" onClick={onRetour}>
          <span aria-hidden="true">←</span>
        </button>
        <h2 id="titre-de-la-seance">{titre}</h2>
        <button type="button" aria-label="Son" aria-pressed={son === "son"} data-son={son} data-bascule-du-son="true" onClick={onBasculerLeSon}>
          <span aria-hidden="true">{son === "son" ? "🔊" : "🔇"}</span>
        </button>
      </div>
      {avancement && <RecipientDeProgression avancement={avancement} forme="barre" />}
    </div>
  );
}
