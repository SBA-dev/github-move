import type { QuestionDeDictee } from "@domain/apprentissage";

type Props = {
  readonly question: QuestionDeDictee;
  /** La touche à taper, mise en avant par « Je ne sais pas ». */
  readonly toucheQuiBrille: string | undefined;
  readonly onTaper: (lettre: string) => void;
  readonly onEffacer: () => void;
};

export function ClavierDeLaDictee({ question, toucheQuiBrille, onTaper, onEffacer }: Props) {
  return (
    <div className="clavier-de-dictee" role="group" aria-label="Clavier" data-testid="clavier-de-dictee" data-genre={question.clavier().genre}>
      {question.rangeesDuClavier().map((rangee, rang) => (
        <div key={rang} className="rangee-de-touches">
          {rangee.map(({ lettre, disponible }, position) => (
            <button
              key={position}
              type="button"
              className="touche"
              data-testid="touche"
              data-lettre={lettre}
              data-brille={disponible && lettre === toucheQuiBrille ? "true" : undefined}
              aria-label={disponible && lettre === toucheQuiBrille ? `${lettre}, la bonne lettre` : undefined}
              aria-disabled={disponible ? undefined : true}
              onClick={() => disponible && onTaper(lettre)}
            >
              {lettre}
            </button>
          ))}
        </div>
      ))}
      <button
        type="button"
        className="touche touche-effacer"
        data-testid="effacer"
        aria-disabled={question.peutEffacer() ? undefined : true}
        onClick={onEffacer}
      >
        Effacer
      </button>
    </div>
  );
}
