import {
  descriptionDeLaSectionDesTenues,
  type EtatDesTenues,
  type PersonnageGuide,
  pastillesDesTenues,
  phraseDeLEtatDesTenues,
  titreDeLaSectionDesTenues,
} from "@domain/motivation";

type Props = {
  readonly personnage: PersonnageGuide;
  readonly tenues: EtatDesTenues;
  /** Clé de la tenue que le personnage guide porte, ou rien. */
  readonly portee: string | undefined;
  readonly onEcouter: () => Promise<void>;
  readonly onMettre: (cle: string) => void;
  readonly onRetirer: () => void;
};

/** Les tenues du personnage guide : celles reçues se mettent ou s'enlèvent, les autres montrent le palier à atteindre. */
export function SectionDesTenues({ personnage, tenues, portee, onEcouter, onMettre, onRetirer }: Props) {
  return (
    <section
      className="section-des-medailles section-des-tenues"
      aria-label={descriptionDeLaSectionDesTenues(personnage, tenues)}
      data-testid="section-des-tenues"
    >
      <h2>{titreDeLaSectionDesTenues(personnage)}</h2>
      <button type="button" className="secondaire" onClick={onEcouter}>Écouter</button>
      <p className="phrase-des-tenues" data-testid="phrase-des-tenues">{phraseDeLEtatDesTenues(personnage, tenues)}</p>
      <ul className="pastilles-des-tenues">
        {pastillesDesTenues(tenues).map(({ cle, libelle, libelleLu, recue }) => (
          <li key={cle} className="pastille-des-tenues" data-testid="pastille-de-tenue" data-recue={recue}>
            {recue
              ? (
                <button
                  type="button"
                  className="tenue-a-mettre"
                  data-testid="tenue-a-mettre"
                  data-tenue={cle}
                  aria-pressed={portee === cle}
                  onClick={() => onMettre(cle)}
                >
                  {libelle}
                </button>
              )
              : (
                <>
                  <span className="visuellement-cache">{libelleLu}</span>
                  <span aria-hidden="true">{libelle}</span>
                </>
              )}
          </li>
        ))}
      </ul>
      {portee !== undefined && (
        <button type="button" className="secondaire" data-testid="retirer-la-tenue" onClick={onRetirer}>
          Retirer la tenue
        </button>
      )}
    </section>
  );
}
