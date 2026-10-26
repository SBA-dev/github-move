import {
  type EtatDeLHistoire,
  sousTitreDeLaSectionDeLHistoire,
  titreDeLaSectionDeLHistoire,
  tuilesDeLHistoire,
} from "@domain/motivation";

type Props = {
  readonly histoire: EtatDeLHistoire;
  readonly onEcouter: () => Promise<void>;
  readonly onOuvrirLEpisode: (numero: number) => void;
};

/** L'histoire des Savanturiers : une tuile par épisode, ouverte quand l'épisode l'est, « À découvrir » et inactive sinon. */
export function SectionDeLHistoire({ histoire, onEcouter, onOuvrirLEpisode }: Props) {
  return (
    <section
      className="section-des-medailles section-de-l-histoire"
      aria-labelledby="titre-de-l-histoire"
      data-testid="section-de-l-histoire"
    >
      <h2 id="titre-de-l-histoire">{titreDeLaSectionDeLHistoire()}</h2>
      <p className="sous-titre-de-l-histoire">{sousTitreDeLaSectionDeLHistoire()}</p>
      <button type="button" className="secondaire" onClick={onEcouter}>Écouter</button>
      <ul className="tuiles-de-l-histoire">
        {tuilesDeLHistoire(histoire).map(({ numero, ouvert, libelle, libelleLu }) => (
          <li key={numero}>
            <button
              type="button"
              className="tuile-d-episode"
              data-testid={`tuile-d-episode-${numero}`}
              data-ouvert={ouvert}
              aria-label={libelleLu}
              disabled={!ouvert}
              onClick={() => onOuvrirLEpisode(numero)}
            >
              {libelle}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
