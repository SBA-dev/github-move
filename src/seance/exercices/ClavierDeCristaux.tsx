import { useCallback, useEffect, useRef, useState } from "react";
import { CIBLE_DE_LA_ZONE_DE_REPONSE, useRetourDe } from "../../retours/index.ts";

const CHIFFRES_AU_PLUS = 4;
const CHIFFRES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

type Props = {
  /** Reçoit le nombre validé ; la saisie s'efface ensuite, que la réponse soit juste ou fausse. */
  readonly onValider: (nombre: number) => void;
  /** Les touches qui brillent : la réponse montrée par « Je ne sais pas ». */
  readonly chiffresQuiBrillent?: readonly string[];
  readonly desactive?: boolean;
};

function estUnChiffre(touche: string): boolean {
  return touche.length === 1 && touche >= "0" && touche <= "9";
}

function estUnControle(cible: EventTarget | null): boolean {
  return cible instanceof HTMLElement && ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(cible.tagName);
}

/** La saisie du clavier de cristaux : 4 chiffres au plus, « Valider » sans chiffre ne fait rien. */
function useSaisie(onValider: (nombre: number) => void) {
  const [saisie, setSaisie] = useState("");
  const courante = useRef("");
  const changer = useCallback((nouvelle: string) => {
    courante.current = nouvelle;
    setSaisie(nouvelle);
  }, []);

  const taper = useCallback((chiffre: string) => {
    if (courante.current.length < CHIFFRES_AU_PLUS) changer(courante.current + chiffre);
  }, [changer]);
  const effacer = useCallback(() => changer(courante.current.slice(0, -1)), [changer]);
  const valider = useCallback(() => {
    if (courante.current === "") return;
    const nombre = Number(courante.current);
    changer("");
    onValider(nombre);
  }, [changer, onValider]);
  return { saisie, taper, effacer, valider };
}

/** Les touches du clavier physique : chiffres, Retour arrière, Entrée (sauf sur un bouton, qui reçoit déjà Entrée). */
function useClavierPhysique(actif: boolean, taper: (chiffre: string) => void, effacer: () => void, valider: () => void) {
  useEffect(() => {
    if (!actif) return;
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.ctrlKey || evenement.metaKey || evenement.altKey) return;
      const { key } = evenement;
      if (estUnChiffre(key)) taper(key);
      else if (key === "Backspace") effacer();
      else if (key === "Enter" && !estUnControle(evenement.target)) valider();
      else return;
      evenement.preventDefault();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [actif, taper, effacer, valider]);
}

export function ClavierDeCristaux({ onValider, chiffresQuiBrillent = [], desactive = false }: Props) {
  const { saisie, taper, effacer, valider } = useSaisie(onValider);
  useClavierPhysique(!desactive, taper, effacer, valider);
  /** La réponse est validée par « Valider » : c'est lui qui rebondit ou se balance. */
  const retour = useRetourDe<HTMLButtonElement>(CIBLE_DE_LA_ZONE_DE_REPONSE);
  const touche = (chiffre: string) => (
    <button
      key={chiffre}
      type="button"
      className="cristal"
      data-testid="cristal"
      data-brille={chiffresQuiBrillent.includes(chiffre) ? "true" : undefined}
      aria-disabled={desactive ? true : undefined}
      onClick={() => !desactive && taper(chiffre)}
    >
      {chiffre}
    </button>
  );
  return (
    <div className="clavier-de-cristaux" role="group" aria-label="Clavier de cristaux" data-testid="clavier-de-cristaux">
      <output className="nombre-tape" aria-label="Nombre tapé" data-testid="nombre-tape">{saisie}</output>
      <div className="cristaux">
        {CHIFFRES.map(touche)}
        <button
          type="button"
          className="cristal action"
          data-testid="effacer"
          aria-disabled={desactive ? true : undefined}
          onClick={() => !desactive && effacer()}
        >
          Effacer
        </button>
        {touche("0")}
        <button
          ref={retour.ref}
          type="button"
          className="cristal action valider"
          data-testid="valider"
          data-donne-une-reponse="true"
          {...retour.attributs}
          aria-disabled={desactive ? true : undefined}
          onClick={() => !desactive && valider()}
        >
          Valider
        </button>
      </div>
    </div>
  );
}
