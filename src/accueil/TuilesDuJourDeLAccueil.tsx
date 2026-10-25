import { useId } from "react";
import type { TuileDuJour } from "@domain/apprentissage";
import { A_FAIRE_AUJOURD_HUI, MON_TEST_DE_DEPART, PROPOSITION_DU_TEST_DE_DEPART } from "./textes-de-l-accueil.ts";

type Props = {
  readonly tuiles: readonly TuileDuJour[];
  readonly onMonTestDeDepart: () => void;
};

function TuileDuTestDeDepart({ onOuvrir }: { readonly onOuvrir: () => void }) {
  const idDeLaProposition = useId();
  return (
    <button
      type="button"
      className="tuile"
      data-testid="tuile-du-jour"
      data-genre="testDeDepart"
      aria-describedby={idDeLaProposition}
      onClick={onOuvrir}
    >
      <span className="nom-de-la-tuile">{MON_TEST_DE_DEPART}</span>
      <span id={idDeLaProposition}>{PROPOSITION_DU_TEST_DE_DEPART}</span>
    </button>
  );
}

/** Ce qui est dû aujourd'hui, dans l'ordre que fixe le domaine. */
export function TuilesDuJourDeLAccueil({ tuiles, onMonTestDeDepart }: Props) {
  if (tuiles.length === 0) return null;
  return (
    <ul className="tuiles-du-jour" aria-label={A_FAIRE_AUJOURD_HUI}>
      {tuiles.map((tuile) => (
        <li key={tuile.genre}>
          {tuile.genre === "testDeDepart" && <TuileDuTestDeDepart onOuvrir={onMonTestDeDepart} />}
        </li>
      ))}
    </ul>
  );
}
