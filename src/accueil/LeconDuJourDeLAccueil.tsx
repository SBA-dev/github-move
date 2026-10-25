import type { LeconDuJour } from "@domain/apprentissage";
import { AUCUNE_LECON_POUR_LA_CLASSE, libelleDeLOnglet } from "../parcours/index.ts";
import {
  COMMENCER,
  PARCOURS_FINI,
  PARCOURS_FINI_ENCOURAGEMENT,
  PARCOURS_FINI_FELICITATION,
  personnageGuideAttend,
} from "./textes-de-l-accueil.ts";

type Props = {
  readonly lecon: LeconDuJour;
  readonly personnageGuide: string;
  readonly onCommencer: (leconId: string) => void;
};

/** La grande tuile : la leçon du jour que choisit le domaine, ou ce qui la remplace. Rien quand la bibliothèque est inconnue. */
export function LeconDuJourDeLAccueil({ lecon, personnageGuide, onCommencer }: Props) {
  switch (lecon.genre) {
    case "aJouer":
      return (
        <section className="grande-tuile" aria-labelledby="titre-de-la-lecon-du-jour" data-testid="lecon-du-jour">
          <p className="matiere-et-niveau" data-testid="matiere-de-la-lecon-du-jour">
            {libelleDeLOnglet(lecon.matiere.code)} · {lecon.niveau.valeur}
          </p>
          <h2 id="titre-de-la-lecon-du-jour" data-testid="titre-de-la-lecon-du-jour">{lecon.titre}</h2>
          <p>{personnageGuideAttend(personnageGuide)}</p>
          <button type="button" className="commencer" onClick={() => onCommencer(lecon.lecon)}>{COMMENCER}</button>
        </section>
      );
    case "parcoursFini":
      return (
        <section className="grande-tuile" aria-labelledby="titre-du-parcours-fini" data-testid="parcours-fini">
          <h2 id="titre-du-parcours-fini">{PARCOURS_FINI_FELICITATION}</h2>
          <p>{PARCOURS_FINI}</p>
          <p>{PARCOURS_FINI_ENCOURAGEMENT}</p>
        </section>
      );
    case "aucuneLeconPourTaClasse":
      return <p className="grande-tuile">{AUCUNE_LECON_POUR_LA_CLASSE}</p>;
    case "inconnue":
      return null;
  }
}
