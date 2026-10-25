import { type ReactNode, useId } from "react";
import { annonceDuBlocDesClassesDAvant, TITRE_DES_LECONS_DES_CLASSES_D_AVANT, titreDuBlocDesClassesDAvant } from "./textes-du-parcours.ts";

type Props = {
  readonly nombre: number;
  readonly deplie: boolean;
  readonly onBasculer: () => void;
  readonly children: ReactNode;
};

/** Les leçons des classes d'avant : repliées tant que l'enfant ne les ouvre pas. */
export function SectionDesClassesDAvant({ nombre, deplie, onBasculer, children }: Props) {
  const idDuContenu = useId();
  return (
    <section className="lecons-des-classes-d-avant" aria-label={TITRE_DES_LECONS_DES_CLASSES_D_AVANT}>
      <button
        type="button"
        className="secondaire bascule-des-classes-d-avant"
        aria-expanded={deplie}
        aria-controls={idDuContenu}
        aria-label={annonceDuBlocDesClassesDAvant(nombre)}
        onClick={onBasculer}
      >
        {titreDuBlocDesClassesDAvant(nombre)}
      </button>
      <div id={idDuContenu} hidden={!deplie}>{deplie && children}</div>
    </section>
  );
}
