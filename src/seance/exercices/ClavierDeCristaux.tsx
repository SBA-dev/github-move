import { useCallback, useRef, useState } from "react";
import { PaveDeCristaux } from "./PaveDeCristaux.tsx";

const CHIFFRES_AU_PLUS = 4;

type Props = {
  /** Reçoit le nombre validé ; la saisie s'efface ensuite, que la réponse soit juste ou fausse. */
  readonly onValider: (nombre: number) => void;
  /** Les touches qui brillent : la réponse montrée par « Je ne sais pas ». */
  readonly chiffresQuiBrillent?: readonly string[];
  readonly desactive?: boolean;
};

/** La saisie du clavier de cristaux : 4 chiffres au plus, « Valider » sans chiffre ne fait rien. */
function useSaisie(onValider: (nombre: number) => void) {
  const [saisie, setSaisie] = useState("");
  const courante = useRef("");
  const changer = useCallback((nouvelle: string) => {
    courante.current = nouvelle;
    setSaisie(nouvelle);
  }, []);

  /** Dit si le geste a eu un effet : un cinquième chiffre ou un effacement sans rien de tapé ne change rien. */
  const taper = useCallback((chiffre: string): boolean => {
    if (courante.current.length >= CHIFFRES_AU_PLUS) return false;
    changer(courante.current + chiffre);
    return true;
  }, [changer]);
  const effacer = useCallback((): boolean => {
    if (courante.current === "") return false;
    changer(courante.current.slice(0, -1));
    return true;
  }, [changer]);
  const valider = useCallback(() => {
    if (courante.current === "") return;
    const nombre = Number(courante.current);
    changer("");
    onValider(nombre);
  }, [changer, onValider]);
  return { saisie, taper, effacer, valider };
}

export function ClavierDeCristaux({ onValider, chiffresQuiBrillent = [], desactive = false }: Props) {
  const { saisie, taper, effacer, valider } = useSaisie(onValider);
  return (
    <div className="clavier-de-cristaux" role="group" aria-label="Clavier de cristaux" data-testid="clavier-de-cristaux">
      <output className="nombre-tape" aria-label="Nombre tapé" data-testid="nombre-tape">{saisie}</output>
      <PaveDeCristaux
        onTaper={taper}
        onEffacer={effacer}
        onValider={valider}
        chiffresQuiBrillent={chiffresQuiBrillent}
        desactive={desactive}
      />
    </div>
  );
}
