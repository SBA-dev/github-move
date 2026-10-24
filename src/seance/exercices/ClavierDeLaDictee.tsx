import type { QuestionDeDictee } from "@domain/apprentissage";

type Props = {
  readonly question: QuestionDeDictee;
  /** La touche à taper, mise en avant par « Je ne sais pas ». */
  readonly toucheQuiBrille: string | undefined;
  readonly onTaper: (lettre: string) => void;
  readonly onEffacer: () => void;
};

/** Pour chaque touche, de gauche à droite : est-elle encore proposée ? Une lettre déjà posée n'est plus proposée. */
function touchesProposees(question: QuestionDeDictee): { lettre: string; proposee: boolean }[][] {
  const restantes = [...question.touchesDisponibles()];
  return question.clavier().rangees.map((rangee) =>
    rangee.map((lettre) => {
      const rang = restantes.indexOf(lettre);
      if (rang !== -1) restantes.splice(rang, 1);
      return { lettre, proposee: rang !== -1 };
    })
  );
}

export function ClavierDeLaDictee({ question, toucheQuiBrille, onTaper, onEffacer }: Props) {
  return (
    <div className="clavier-de-dictee" role="group" aria-label="Clavier" data-testid="clavier-de-dictee" data-genre={question.clavier().genre}>
      {touchesProposees(question).map((rangee, rang) => (
        <div key={rang} className="rangee-de-touches">
          {rangee.map(({ lettre, proposee }, position) => (
            <button
              key={position}
              type="button"
              className="touche"
              data-testid="touche"
              data-lettre={lettre}
              data-brille={proposee && lettre === toucheQuiBrille ? "true" : undefined}
              aria-disabled={proposee ? undefined : true}
              onClick={() => proposee && onTaper(lettre)}
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
