import type { ObjectifDuJour } from "@domain/motivation";
import { avancementDeLObjectif, OBJECTIF_ATTEINT, OBJECTIF_DU_JOUR } from "./textes-de-l-accueil.ts";

/** L'encouragement du jour : du texte, sans fête. La barre est décorative, le texte porte l'information. */
export function ObjectifDuJourDeLAccueil({ objectif }: { readonly objectif: ObjectifDuJour }) {
  const { nombreJoue, nombreVise, estAtteint } = objectif;
  return (
    <div className="objectif-du-jour" data-testid="objectif-du-jour">
      {estAtteint ? <p className="objectif-atteint">{OBJECTIF_ATTEINT}</p> : (
        <>
          <p>{OBJECTIF_DU_JOUR}</p>
          <p className="avancement-de-l-objectif">{avancementDeLObjectif(nombreJoue, nombreVise)}</p>
        </>
      )}
      <div className="barre-de-l-objectif" aria-hidden="true">
        <div className="remplissage-de-l-objectif" style={{ width: `${(nombreJoue / nombreVise) * 100}%` }} />
      </div>
    </div>
  );
}
