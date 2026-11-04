import type { Defi, EtatDuDefi, GrandDefi } from "@domain/apprentissage";
import { nomDuDefi, nomDuGrandDefi } from "@domain/motivation";
import {
  annonceDuRepereDuDefi,
  BOUTON_REJOUER_LE_DEFI,
  BOUTON_RELEVER_LE_DEFI,
  DEFI_RELEVE,
  leconsAvantLeDefi,
} from "./textes-du-parcours.ts";

type Props = {
  readonly defi: Defi | GrandDefi;
  readonly etat: EtatDuDefi;
  readonly onRelever: (defi: Defi | GrandDefi) => void;
};

/**
 * Le repère d'un défi sur le dessin du parcours, juste après la dernière leçon de sa partie (le grand défi : après la dernière leçon de la matière, près du fanion). À venir, il est visible et ne se touche pas
 * (ni bouton ni cadenas) ; ouvert, il propose de relever le défi ; relevé, il garde sa marque et propose de le rejouer (bouton « Rejouer le défi », même action que « Relever le défi »). Le lecteur d'écran lit l'état du défi.
 */
export function RepereDuDefi({ defi, etat, onRelever }: Props) {
  const nom = defi.grandDefi === true ? nomDuGrandDefi() : nomDuDefi(defi.numero);
  return (
    <div
      className="repere-du-defi"
      role="group"
      aria-label={annonceDuRepereDuDefi(nom, etat)}
      data-testid="repere-du-defi"
      data-etat={etat.genre}
      data-numero={defi.numero}
      data-grand-defi={defi.grandDefi}
    >
      <span className="nom-du-defi" aria-hidden="true">{nom}</span>
      {etat.genre === "aVenir" && <span className="etat-du-defi" aria-hidden="true">{leconsAvantLeDefi(etat.leconsRestantes)}</span>}
      {etat.genre === "releve" && <span className="etat-du-defi" aria-hidden="true">✓ {DEFI_RELEVE}</span>}
      {(etat.genre === "ouvert" || etat.genre === "releve") && (
        <button type="button" className="relever-le-defi" onClick={() => onRelever(defi)}>{etat.genre === "releve" ? BOUTON_REJOUER_LE_DEFI : BOUTON_RELEVER_LE_DEFI}</button>
      )}
    </div>
  );
}
