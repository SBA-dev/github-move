import type { RefObject } from "react";
import { TexteEnSyllabes } from "../../../reglages/index.ts";
import { useRetourDe } from "../../../retours/index.ts";
import type { Point } from "../maisons/groupe-sous-le-doigt.ts";
import { useGlisserUneEtiquette } from "./useGlisserUneEtiquette.ts";

type Props = {
  readonly texte: string;
  readonly aFocaliser: RefObject<HTMLButtonElement | null> | undefined;
  readonly brille: boolean;
  readonly appuyee: boolean | undefined;
  /** Toucher l'étiquette la pose tout de suite : c'est une réponse (sinon elle est seulement choisie, ou glissée). */
  readonly poseALeToucher: boolean;
  readonly glissable: boolean;
  readonly onToucher: () => void;
  readonly onSurvol: (point: Point | undefined) => void;
  readonly onLacher: (point: Point) => void;
};

/** Une étiquette à poser : elle se balance quand elle est mal posée, et suit le doigt quand on la glisse. */
export function Etiquette({ texte, aFocaliser, brille, appuyee, poseALeToucher, glissable, onToucher, onSurvol, onLacher }: Props) {
  const retour = useRetourDe<HTMLButtonElement>(texte);
  const glisser = useGlisserUneEtiquette<HTMLButtonElement>({ glissable, onSurvol, onLacher });
  return (
    <button
      ref={(bouton) => {
        retour.ref.current = bouton;
        glisser.ref.current = bouton;
        if (aFocaliser) aFocaliser.current = bouton;
      }}
      type="button"
      className="etiquette"
      data-testid="etiquette"
      data-etat={glisser.etat}
      data-donne-une-reponse={poseALeToucher ? "true" : undefined}
      data-brille={brille ? "true" : undefined}
      {...retour.attributs}
      {...glisser.attributsDuGeste}
      aria-pressed={appuyee}
      onClick={() => glisser.estUnToucher() && onToucher()}
    >
      <TexteEnSyllabes texte={texte} />
    </button>
  );
}
