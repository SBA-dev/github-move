import { useEffect, useRef } from "react";
import { TexteEnSyllabes } from "../../reglages/index.ts";

type Props = {
  /** Tous les choix, dans l'ordre d'affichage. */
  readonly textes: readonly string[];
  /** Les choix déjà écartés : grisés, ils ne répondent plus. */
  readonly ecartes: readonly string[];
  /** Les choix encore possibles. */
  readonly possibles: readonly string[];
  /** Le choix qui brille : la bonne réponse montrée par « Je ne sais pas ». */
  readonly reponseQuiBrille: string | undefined;
  /** La question est réussie : on la félicite avant de passer à la suivante. */
  readonly reussie: boolean;
  readonly bulleEclatee: string | undefined;
  readonly onChoisir: (texte: string) => void;
};

export function ChoixDeLaQuestion(
  { textes, ecartes, possibles, reponseQuiBrille, reussie, bulleEclatee, onChoisir }: Props,
) {
  const premierPossible = possibles[0];
  const bulleAFocaliser = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!reussie) bulleAFocaliser.current?.focus();
  }, [premierPossible, ecartes.length, reussie]);

  return (
    <div className="choix-de-la-question" role="group" aria-label="Choix" data-testid="choix-de-la-question">
      {textes.map((texte) => {
        const ecarte = ecartes.includes(texte);
        return (
          <button
            key={texte}
            ref={texte === premierPossible ? bulleAFocaliser : undefined}
            type="button"
            className="bulle-de-choix"
            data-testid="choix"
            data-ecarte={ecarte ? "true" : undefined}
            data-brille={texte === reponseQuiBrille && !reussie ? "true" : undefined}
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
