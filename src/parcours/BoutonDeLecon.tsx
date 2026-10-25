import type { EtatDansLeParcours } from "@domain/apprentissage";
import { EtatDeLaLecon } from "./EtatDeLaLecon.tsx";

type Props = {
  readonly titre: string;
  readonly repere: string;
  readonly etat: EtatDansLeParcours;
  readonly annonce: string;
  readonly testid: string;
  readonly onOuvrir: () => void;
};

/** Une leçon qui s'ouvre au toucher et au clavier, hors du parcours : jamais numérotée. */
export function BoutonDeLecon({ titre, repere, etat, annonce, testid, onOuvrir }: Props) {
  return (
    <button type="button" className="lecon-du-parcours" data-testid={testid} data-etat={etat.genre} aria-label={annonce} onClick={onOuvrir}>
      <span className="place-de-la-lecon" aria-hidden="true">{repere}</span>
      <span className="titre-de-la-lecon" aria-hidden="true">{titre}</span>
      <EtatDeLaLecon etat={etat} />
    </button>
  );
}
