import { useEffect, useRef } from "react";
import type { QuestionJouee } from "@domain/apprentissage";
import { TexteEnSyllabes } from "../../reglages/index.ts";

type Props = {
  readonly question: QuestionJouee;
  /** La question est réussie : on la félicite avant de passer à la suivante. */
  readonly reussie: boolean;
  readonly bulleEclatee: string | undefined;
  readonly onChoisir: (texte: string) => void;
};

export function ChoixDeLaQuestion({ question, reussie, bulleEclatee, onChoisir }: Props) {
  const ecartes = question.choix.ecartes();
  const premierPossible = question.choix.possibles()[0];
  const bulleAFocaliser = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!reussie) bulleAFocaliser.current?.focus();
  }, [premierPossible, ecartes.length, reussie]);

  return (
    <div className="choix-de-la-question" role="group" aria-label="Choix" data-testid="choix-de-la-question">
      {question.choix.textes().map((texte) => {
        const ecarte = ecartes.includes(texte);
        return (
          <button
            key={texte}
            ref={texte === premierPossible ? bulleAFocaliser : undefined}
            type="button"
            className="bulle-de-choix"
            data-testid="choix"
            data-ecarte={ecarte ? "true" : undefined}
            data-eclatee={texte === bulleEclatee ? "true" : undefined}
            aria-disabled={ecarte || reussie ? true : undefined}
            onClick={() => onChoisir(texte)}
          >
            <TexteEnSyllabes texte={texte} />
          </button>
        );
      })}
    </div>
  );
}
