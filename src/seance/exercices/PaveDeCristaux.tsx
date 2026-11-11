import { useCallback, useEffect, useRef, useState } from "react";
import { CIBLE_DE_LA_ZONE_DE_REPONSE, useRetourDe } from "../../retours/index.ts";
import { useUnivers } from "../../univers/index.ts";
import { DessinDeLUnivers } from "./claviers/DessinDeLUnivers.tsx";
import { dessinDuCristal } from "./claviers/dessins-des-claviers.ts";
import { EclatDeLaTouche } from "./claviers/EclatDeLaTouche.tsx";

const DUREE_DE_L_ECLAT_MS = 200;
const EFFACER = "effacer";
const CHIFFRES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

type Props = {
  /** Dit si le chiffre a eu un effet : un cinquième chiffre ne change rien. */
  readonly onTaper: (chiffre: string) => boolean;
  /** Dit si l'effacement a eu un effet : effacer sans rien de tapé ne change rien. */
  readonly onEffacer: () => boolean;
  readonly onValider: () => void;
  /** Les touches qui brillent : la réponse montrée par « Je ne sais pas ». */
  readonly chiffresQuiBrillent: readonly string[];
  readonly desactive: boolean;
  /** Une touche du clavier physique que le pavé ne connaît pas ; rend `true` si elle a été prise en charge. */
  readonly onAutreTouche?: (touche: string) => boolean;
};

function estUnChiffre(touche: string): boolean {
  return touche.length === 1 && touche >= "0" && touche <= "9";
}

function estUnControle(cible: EventTarget | null): boolean {
  return cible instanceof HTMLElement && ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(cible.tagName);
}

/** La touche qui a un éclat : il se pose au toucher d'un geste qui a un effet, puis se retire de lui-même. */
function useEclat() {
  const [toucheEclatante, setToucheEclatante] = useState<string | undefined>();
  const minuterie = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(minuterie.current), []);
  const eclater = useCallback((touche: string) => {
    clearTimeout(minuterie.current);
    setToucheEclatante(touche);
    minuterie.current = setTimeout(() => setToucheEclatante(undefined), DUREE_DE_L_ECLAT_MS);
  }, []);
  return { toucheEclatante, eclater };
}

/** Les touches du clavier physique : chiffres, Retour arrière, Entrée (sauf sur un bouton, qui reçoit déjà Entrée). */
function useClavierPhysique(
  actif: boolean,
  taper: (chiffre: string) => void,
  effacer: () => void,
  valider: () => void,
  autreTouche: ((touche: string) => boolean) | undefined,
) {
  useEffect(() => {
    if (!actif) return;
    const prendEnCharge = (key: string, cible: EventTarget | null): boolean => {
      if (estUnChiffre(key)) taper(key);
      else if (key === "Backspace") effacer();
      else if (key === "Enter" && !estUnControle(cible)) valider();
      else return !estUnControle(cible) && autreTouche?.(key) === true;
      return true;
    };
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.ctrlKey || evenement.metaKey || evenement.altKey) return;
      if (prendEnCharge(evenement.key, evenement.target)) evenement.preventDefault();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [actif, taper, effacer, valider, autreTouche]);
}

/** Les cristaux d'un clavier : les chiffres de 0 à 9, « Effacer » et « Valider ». Ce qui est tapé se garde dans le clavier qui l'emploie. */
export function PaveDeCristaux({ onTaper, onEffacer, onValider, chiffresQuiBrillent, desactive, onAutreTouche }: Props) {
  const { toucheEclatante, eclater } = useEclat();
  const univers = useUnivers();
  const taperAvecEclat = useCallback((chiffre: string) => {
    if (onTaper(chiffre)) eclater(chiffre);
  }, [onTaper, eclater]);
  const effacerAvecEclat = useCallback(() => {
    if (onEffacer()) eclater(EFFACER);
  }, [onEffacer, eclater]);
  useClavierPhysique(!desactive, taperAvecEclat, effacerAvecEclat, onValider, onAutreTouche);
  /** La réponse est validée par « Valider » : c'est lui qui rebondit ou se balance. */
  const retour = useRetourDe<HTMLButtonElement>(CIBLE_DE_LA_ZONE_DE_REPONSE);
  const touche = (chiffre: string) => (
    <button
      key={chiffre}
      type="button"
      className="cristal"
      data-testid="cristal"
      data-univers={univers}
      data-brille={chiffresQuiBrillent.includes(chiffre) ? "true" : undefined}
      data-eclat={toucheEclatante === chiffre ? "true" : undefined}
      aria-disabled={desactive ? true : undefined}
      onClick={() => !desactive && taperAvecEclat(chiffre)}
    >
      <DessinDeLUnivers identifiant="dessin-du-cristal" contenu={dessinDuCristal(univers)} />
      <span className="chiffre-du-cristal">{chiffre}</span>
      {toucheEclatante === chiffre && <EclatDeLaTouche />}
    </button>
  );
  return (
    <div className="cristaux">
      {CHIFFRES.map(touche)}
      <button
        type="button"
        className="cristal action"
        data-testid="effacer"
        data-eclat={toucheEclatante === EFFACER ? "true" : undefined}
        aria-disabled={desactive ? true : undefined}
        onClick={() => !desactive && effacerAvecEclat()}
      >
        Effacer
        {toucheEclatante === EFFACER && <EclatDeLaTouche />}
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
        onClick={() => !desactive && onValider()}
      >
        Valider
      </button>
    </div>
  );
}
