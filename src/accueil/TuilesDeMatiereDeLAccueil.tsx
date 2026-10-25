import { useId } from "react";
import type { CodeDeMatiere } from "@domain/catalogue";
import type { TuileDeMatiere } from "@domain/apprentissage";
import { compteurDuParcours, libelleDeLOnglet } from "../parcours/index.ts";
import { MES_MATIERES } from "./textes-de-l-accueil.ts";

type Props = {
  readonly tuiles: readonly TuileDeMatiere[];
  readonly onOuvrir: (matiere: CodeDeMatiere) => void;
};

function TuileDeMatiereDeLAccueil({ tuile, onOuvrir }: { readonly tuile: TuileDeMatiere; readonly onOuvrir: (matiere: CodeDeMatiere) => void }) {
  const { matiere, nombreDeLeconsReussies, nombreDeLecons } = tuile;
  const idDuNom = useId();
  const idDuCompteur = useId();
  return (
    <button
      type="button"
      className="tuile"
      data-testid="tuile-de-matiere"
      data-matiere={matiere.code}
      aria-labelledby={idDuNom}
      aria-describedby={idDuCompteur}
      onClick={() => onOuvrir(matiere.code)}
    >
      <span id={idDuNom} className="nom-de-la-matiere">{libelleDeLOnglet(matiere.code)}</span>
      <span id={idDuCompteur} className="compteur-de-la-matiere" data-testid="compteur-de-la-matiere">
        {compteurDuParcours(nombreDeLeconsReussies, nombreDeLecons)}
      </span>
    </button>
  );
}

/** Une tuile par matière du parcours : son compteur est celui de « Mon parcours », et le toucher ouvre cette matière. */
export function TuilesDeMatiereDeLAccueil({ tuiles, onOuvrir }: Props) {
  if (tuiles.length === 0) return null;
  return (
    <ul className="tuiles-de-matiere" aria-label={MES_MATIERES}>
      {tuiles.map((tuile) => (
        <li key={tuile.matiere.code}>
          <TuileDeMatiereDeLAccueil tuile={tuile} onOuvrir={onOuvrir} />
        </li>
      ))}
    </ul>
  );
}
