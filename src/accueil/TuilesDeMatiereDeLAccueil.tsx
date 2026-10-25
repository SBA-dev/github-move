import type { CodeDeMatiere } from "@domain/catalogue";
import type { TuileDeMatiere } from "@domain/apprentissage";
import { compteurDuParcours, libelleDeLOnglet } from "../parcours/index.ts";

type Props = {
  readonly tuiles: readonly TuileDeMatiere[];
  readonly onOuvrir: (matiere: CodeDeMatiere) => void;
};

/** Une tuile par matière du parcours : son compteur est celui de « Mon parcours », et le toucher ouvre cette matière. */
export function TuilesDeMatiereDeLAccueil({ tuiles, onOuvrir }: Props) {
  if (tuiles.length === 0) return null;
  return (
    <ul className="tuiles-de-matiere" aria-label="Mes matières">
      {tuiles.map(({ matiere, nombreDeLeconsReussies, nombreDeLecons }) => (
        <li key={matiere.code}>
          <button type="button" className="tuile" data-testid="tuile-de-matiere" data-matiere={matiere.code} onClick={() => onOuvrir(matiere.code)}>
            <span className="nom-de-la-matiere">{libelleDeLOnglet(matiere.code)}</span>
            <span className="compteur-de-la-matiere" data-testid="compteur-de-la-matiere">
              {compteurDuParcours(nombreDeLeconsReussies, nombreDeLecons)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
