import { useState } from "react";
import type { FluenceEnCours, RecordDeFluence } from "@domain/apprentissage";
import { ClavierDeCristaux } from "../ClavierDeCristaux.tsx";
import { CompteurDuRecord } from "./CompteurDuRecord.tsx";
import { MarqueDuRecord } from "./MarqueDuRecord.tsx";
import { annonceDeLaFluence, scoreDeLaFluence, tempsQuiReste } from "./accueil-de-la-fluence.ts";

type Props = {
  readonly fluence: FluenceEnCours;
  /** Le record que la fluence finie vient de battre, s'il y en a un. */
  readonly recordBattu?: number | undefined;
  /** Le record connu au départ, s'il y en a un et s'il a pu être lu. */
  readonly recordDeDepart?: RecordDeFluence | undefined;
  readonly onDemarrer: () => void;
  readonly onValider: (nombre: number) => void;
};

/** La fluence : « C'est parti ! » (l'accueil est dit par le personnage guide), puis le temps qui reste, les calculs réussis et le clavier de cristaux. */
export function ExerciceDeFluence({ fluence, recordBattu, recordDeDepart, onDemarrer, onValider }: Props) {
  const [duree] = useState(fluence.tempsRestant);
  if (!fluence.demarree && !fluence.finie) {
    return (
      <div className="fluence" data-testid="fluence" data-etat="accueil">
        <button type="button" className="action-principale" data-testid="c-est-parti" onClick={onDemarrer}>
          C'est parti !
        </button>
      </div>
    );
  }
  return (
    <div className="fluence" data-testid="fluence" data-etat={fluence.finie ? "finie" : "en-cours"}>
      <div className="tableau-de-fluence" aria-hidden="true">
        <span className="temps-restant" data-testid="temps-restant">{tempsQuiReste(fluence)}</span>
        <span className="calculs-reussis" data-testid="calculs-reussis" data-score={fluence.score}>
          {scoreDeLaFluence(fluence)}
        </span>
        {!fluence.finie && recordDeDepart?.meilleurScore !== undefined && <MarqueDuRecord record={recordDeDepart} score={fluence.score} />}
        <div className="barre-de-temps" data-testid="barre-de-temps">
          <i style={{ width: `${Math.max(0, Math.min(100, (fluence.tempsRestant / duree) * 100))}%` }} />
        </div>
      </div>
      <p className="visuellement-cache" role="status" aria-live="polite" data-testid="annonce-de-fluence">
        {annonceDeLaFluence(fluence)}
      </p>
      {fluence.finie && recordBattu !== undefined && <CompteurDuRecord record={recordBattu} />}
      <p className="question carte-du-calcul" data-testid="carte-du-calcul">{fluence.carte}</p>
      <ClavierDeCristaux onValider={onValider} desactive={fluence.finie} />
    </div>
  );
}
