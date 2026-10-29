import { type PointerEvent, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Point } from "../maisons/groupe-sous-le-doigt.ts";

export type EtatDeLEtiquette = "a-poser" | "suit-le-doigt" | "revient";

const SEUIL_DU_GESTE_EN_PX = 6;
const DUREE_DU_RETOUR_MS = 250;

type Geste = { readonly pointeur: number; readonly depart: Point; glisse: boolean };

type Options = {
  /** Seules les étiquettes de classer se glissent. */
  readonly glissable: boolean;
  /** Le doigt passe (ou ne passe plus) quelque part : pour signaler la maison survolée. */
  readonly onSurvol: (point: Point | undefined) => void;
  /** Le doigt est levé après avoir glissé l'étiquette. */
  readonly onLacher: (point: Point) => void;
};

/**
 * Le glisser d'une étiquette au doigt ou à la souris (événements pointer) : elle suit le doigt, puis revient à sa place par un mouvement.
 * Un simple toucher n'est pas un glissement : il reste un clic.
 */
export function useGlisserUneEtiquette<E extends HTMLElement>({ glissable, onSurvol, onLacher }: Options) {
  const ref = useRef<E | null>(null);
  const [etat, setEtat] = useState<EtatDeLEtiquette>("a-poser");
  const geste = useRef<Geste | undefined>(undefined);
  const aGlisse = useRef(false);
  const retour = useRef<Animation | undefined>(undefined);
  const mouvementsReduits = useReducedMotion();

  useEffect(() => () => retour.current?.cancel(), []);

  const deplacer = (element: HTMLElement, depart: Point, point: Point) => {
    element.style.translate = `${point.x - depart.x}px ${point.y - depart.y}px`;
  };

  const remettreEnPlace = (element: HTMLElement) => {
    element.style.translate = "";
    setEtat("a-poser");
  };

  const revenir = (element: HTMLElement) => {
    const depuis = element.style.translate;
    if (mouvementsReduits) {
      remettreEnPlace(element);
      return;
    }
    setEtat("revient");
    retour.current = element.animate({ translate: [depuis, "0px 0px"] }, { duration: DUREE_DU_RETOUR_MS, easing: "ease-out" });
    void retour.current.finished.then(() => remettreEnPlace(element), () => undefined);
  };

  const terminer = (evenement: PointerEvent<E>, lacher: boolean) => {
    const enCours = geste.current;
    if (enCours === undefined || enCours.pointeur !== evenement.pointerId) return;
    geste.current = undefined;
    if (!enCours.glisse) return;
    onSurvol(undefined);
    if (lacher) onLacher({ x: evenement.clientX, y: evenement.clientY });
    revenir(evenement.currentTarget);
  };

  const attributsDuGeste = glissable
    ? {
      onPointerDown: (evenement: PointerEvent<E>) => {
        if (evenement.pointerType === "mouse" && evenement.button !== 0) return;
        if (retour.current?.playState === "running") {
          retour.current.cancel();
          remettreEnPlace(evenement.currentTarget);
        }
        aGlisse.current = false;
        geste.current = { pointeur: evenement.pointerId, depart: { x: evenement.clientX, y: evenement.clientY }, glisse: false };
        evenement.currentTarget.setPointerCapture(evenement.pointerId);
      },
      onPointerMove: (evenement: PointerEvent<E>) => {
        const enCours = geste.current;
        if (enCours === undefined || enCours.pointeur !== evenement.pointerId) return;
        const point = { x: evenement.clientX, y: evenement.clientY };
        if (!enCours.glisse) {
          if (Math.hypot(point.x - enCours.depart.x, point.y - enCours.depart.y) < SEUIL_DU_GESTE_EN_PX) return;
          enCours.glisse = true;
          aGlisse.current = true;
          setEtat("suit-le-doigt");
        }
        deplacer(evenement.currentTarget, enCours.depart, point);
        onSurvol(point);
      },
      onPointerUp: (evenement: PointerEvent<E>) => terminer(evenement, true),
      onPointerCancel: (evenement: PointerEvent<E>) => terminer(evenement, false),
    }
    : {};

  /** Après un glissement, le clic qui le suit (souris) n'est pas un toucher. */
  const estUnToucher = () => {
    const toucher = !aGlisse.current;
    aGlisse.current = false;
    return toucher;
  };

  return { ref, etat, attributsDuGeste, estUnToucher };
}
