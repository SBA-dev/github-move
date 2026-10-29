import type { Defi, EtatDuDefi } from "@domain/apprentissage";
import {
  annonceDuRepereDuDefi,
  BOUTON_RELEVER_LE_DEFI,
  DEFI_RELEVE,
  leconsAvantLeDefi,
  nomDuDefi,
} from "./textes-du-parcours.ts";

type Props = {
  readonly defi: Defi;
  readonly etat: EtatDuDefi;
  readonly onRelever: (defi: Defi) => void;
};

/**
 * Le repère d'un défi sur le dessin du parcours, juste après la dernière leçon de sa partie. À venir, il est visible et ne se touche pas
 * (ni bouton ni cadenas) ; ouvert, il propose de relever le défi ; relevé, il le garde. Le lecteur d'écran lit l'état du défi.
 */
export function RepereDuDefi({ defi, etat, onRelever }: Props) {
  return (
    <div
      className="repere-du-defi"
      role="group"
      aria-label={annonceDuRepereDuDefi(defi.numero, etat)}
      data-testid="repere-du-defi"
      data-etat={etat.genre}
      data-numero={defi.numero}
    >
      <span className="nom-du-defi" aria-hidden="true">{nomDuDefi(defi.numero)}</span>
      {etat.genre === "aVenir" && <span className="etat-du-defi" aria-hidden="true">{leconsAvantLeDefi(etat.leconsRestantes)}</span>}
      {etat.genre === "ouvert" && (
        <button type="button" className="relever-le-defi" onClick={() => onRelever(defi)}>{BOUTON_RELEVER_LE_DEFI}</button>
      )}
      {etat.genre === "releve" && <span className="etat-du-defi" aria-hidden="true">✓ {DEFI_RELEVE}</span>}
    </div>
  );
}
