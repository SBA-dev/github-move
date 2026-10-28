import { type RefObject, useEffect, useRef } from "react";
import { useRetourDe } from "../../retours/index.ts";
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
      {textes.map((texte) => (
        <BulleDeChoix
          key={texte}
          texte={texte}
          ecarte={ecartes.includes(texte)}
          brille={texte === reponseQuiBrille && !reussie}
          eclatee={texte === bulleEclatee}
          reussie={reussie}
          aFocaliser={texte === premierPossible ? bulleAFocaliser : undefined}
          onChoisir={onChoisir}
        />
      ))}
    </div>
  );
}

type PropsDeLaBulle = {
  readonly texte: string;
  readonly ecarte: boolean;
  readonly brille: boolean;
  readonly eclatee: boolean;
  readonly reussie: boolean;
  /** Reçoit le focus quand le choix change : la première bulle encore possible. */
  readonly aFocaliser: RefObject<HTMLButtonElement | null> | undefined;
  readonly onChoisir: (texte: string) => void;
};

function BulleDeChoix({ texte, ecarte, brille, eclatee, reussie, aFocaliser, onChoisir }: PropsDeLaBulle) {
  const retour = useRetourDe<HTMLButtonElement>(texte);
  return (
    <button
      ref={(bouton) => {
        retour.ref.current = bouton;
        if (aFocaliser) aFocaliser.current = bouton;
      }}
      type="button"
      className="bulle-de-choix"
      data-testid="choix"
      data-ecarte={ecarte ? "true" : undefined}
      data-brille={brille ? "true" : undefined}
      data-eclatee={eclatee ? "true" : undefined}
      {...retour.attributs}
      aria-disabled={ecarte || reussie ? true : undefined}
      onClick={() => onChoisir(texte)}
    >
      <TexteEnSyllabes texte={texte} />
    </button>
  );
}
