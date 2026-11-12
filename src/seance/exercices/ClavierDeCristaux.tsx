import { useCallback, useEffect, useRef, useState } from "react";
import { CIBLE_DE_LA_ZONE_DE_REPONSE, useRetourDe } from "../../retours/index.ts";
import { useUnivers } from "../../univers/index.ts";
import { usePauseOuverte } from "./PauseDeLaSeance.ts";
import { ActionDeLExercice, useDansLaBarreDAction } from "./ActionDeLExercice.tsx";
import { DessinDeLUnivers } from "./claviers/DessinDeLUnivers.tsx";
import { dessinDuCristal } from "./claviers/dessins-des-claviers.ts";
import { EclatDeLaTouche } from "./claviers/EclatDeLaTouche.tsx";

const CHIFFRES_AU_PLUS = 4;
const DUREE_DE_L_ECLAT_MS = 200;
const DUREE_DU_RETOUR_MS = 500;
const EFFACER = "effacer";
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

/** « Valider » reste monté, désactivé, le temps que son rebond se joue (350 ms au plus), puis il se retire de la barre d'action. */
function useValiderMonte(desactive: boolean): boolean {
  const [monte, setMonte] = useState(!desactive);
  useEffect(() => {
    if (!desactive) {
      setMonte(true);
      return;
    }
    const minuterie = setTimeout(() => setMonte(false), DUREE_DU_RETOUR_MS);
    return () => clearTimeout(minuterie);
  }, [desactive]);
  return monte;
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
  const { toucheEclatante, eclater } = useEclat();
  const univers = useUnivers();
  const dansLaBarre = useDansLaBarreDAction();
  const validerMonte = useValiderMonte(desactive);
  const taperAvecEclat = useCallback((chiffre: string) => {
    if (taper(chiffre)) eclater(chiffre);
  }, [taper, eclater]);
  const effacerAvecEclat = useCallback(() => {
    if (effacer()) eclater(EFFACER);
  }, [effacer, eclater]);
  const enPause = usePauseOuverte();
  useClavierPhysique(!desactive && !enPause, taperAvecEclat, effacerAvecEclat, valider);
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
  const boutonValider = (
    <button
      ref={retour.ref}
      type="button"
      className={dansLaBarre ? undefined : "cristal action valider"}
      data-testid="valider"
      data-donne-une-reponse="true"
      {...retour.attributs}
      aria-disabled={desactive ? true : undefined}
      onClick={() => !desactive && valider()}
    >
      Valider
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
          data-eclat={toucheEclatante === EFFACER ? "true" : undefined}
          aria-disabled={desactive ? true : undefined}
          onClick={() => !desactive && effacerAvecEclat()}
        >
          Effacer
          {toucheEclatante === EFFACER && <EclatDeLaTouche />}
        </button>
        {touche("0")}
        {!dansLaBarre && boutonValider}
      </div>
      {dansLaBarre && validerMonte && <ActionDeLExercice>{boutonValider}</ActionDeLExercice>}
    </div>
  );
}
