import { useId } from "react";
import type { TuileDuJour } from "@domain/apprentissage";
import { annonceDeLaSeanceDeRevision } from "@domain/motivation";
import { A_FAIRE_AUJOURD_HUI, A_REVOIR, MON_TEST_DE_DEPART, PROPOSITION_DU_TEST_DE_DEPART } from "./textes-de-l-accueil.ts";

type Props = {
  readonly tuiles: readonly TuileDuJour[];
  readonly onMonTestDeDepart: () => void;
  readonly onJeRevise: () => void;
};

function TuileARevoir({ nombreDeQuestionsDues, onOuvrir }: { readonly nombreDeQuestionsDues: number; readonly onOuvrir: () => void }) {
  const idDuTitre = useId();
  const idDeLAnnonce = useId();
  return (
    <button
      type="button"
      className="tuile"
      data-testid="tuile-du-jour"
      data-genre="revision"
      aria-labelledby={idDuTitre}
      aria-describedby={idDeLAnnonce}
      onClick={onOuvrir}
    >
      <span id={idDuTitre} className="nom-de-la-tuile">{A_REVOIR}</span>
      <span id={idDeLAnnonce} data-testid="annonce-de-la-revision">{annonceDeLaSeanceDeRevision(nombreDeQuestionsDues)}</span>
    </button>
  );
}

function TuileDuTestDeDepart({ onOuvrir }: { readonly onOuvrir: () => void }) {
  const idDuTitre = useId();
  const idDeLaProposition = useId();
  return (
    <button
      type="button"
      className="tuile"
      data-testid="tuile-du-jour"
      data-genre="testDeDepart"
      aria-labelledby={idDuTitre}
      aria-describedby={idDeLaProposition}
      onClick={onOuvrir}
    >
      <span id={idDuTitre} className="nom-de-la-tuile">{MON_TEST_DE_DEPART}</span>
      <span id={idDeLaProposition}>{PROPOSITION_DU_TEST_DE_DEPART}</span>
    </button>
  );
}

/** Ce qui est dû aujourd'hui, dans l'ordre que fixe le domaine. */
export function TuilesDuJourDeLAccueil({ tuiles, onMonTestDeDepart, onJeRevise }: Props) {
  if (tuiles.length === 0) return null;
  return (
    <ul className="tuiles-du-jour" aria-label={A_FAIRE_AUJOURD_HUI}>
      {tuiles.map((tuile) => (
        <li key={tuile.genre}>
          {tuile.genre === "revision" && <TuileARevoir nombreDeQuestionsDues={tuile.nombreDeQuestionsDues} onOuvrir={onJeRevise} />}
          {tuile.genre === "testDeDepart" && <TuileDuTestDeDepart onOuvrir={onMonTestDeDepart} />}
        </li>
      ))}
    </ul>
  );
}
