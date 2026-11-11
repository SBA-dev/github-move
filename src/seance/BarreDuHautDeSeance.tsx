import type { Avancement } from "@domain/apprentissage";
import type { EtatDuSon } from "@domain/voix";
import { BoutonSon } from "../en-tete/BoutonSon.tsx";
import { BarreDeProgressionDeLaSeance } from "./BarreDeProgressionDeLaSeance.tsx";

type Props = {
  readonly titre: string;
  readonly avancement: Avancement;
  readonly son: EtatDuSon;
  readonly onRetour: () => void;
  readonly onBasculerLeSon: () => void;
};

/** Pendant une séance de leçon, cette barre remplace l'en-tête de l'application : Retour, nom de la leçon, son, avancement. */
export function BarreDuHautDeSeance({ titre, avancement, son, onRetour, onBasculerLeSon }: Props) {
  return (
    <header role="banner" className="barre-du-haut-de-seance">
      <button type="button" className="retour-de-la-seance" aria-label="Retour" onClick={onRetour}>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
          <path d="M20 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h2 id="titre-de-la-seance">{titre}</h2>
      <BoutonSon son={son} onBasculer={onBasculerLeSon} />
      <BarreDeProgressionDeLaSeance avancement={avancement} />
    </header>
  );
}
