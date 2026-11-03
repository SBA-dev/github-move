import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { TexteEnSyllabes, useModeDys } from "../../../reglages/index.ts";

type Point = { readonly x: number; readonly y: number };

/** Le trajet d'un mot, du centre de sa bulle au centre de sa place, que la page peut déplacer en chemin. */
export type Trajet = {
  readonly mot: string;
  readonly de: Point;
  readonly versLaPlace: () => Point;
};

const DUREE_DU_VOYAGE_MS = 250;

/** Le mot reste posé sur sa place un court instant : l'œil le voit arriver avant qu'il disparaisse. */
const DUREE_SUR_PLACE_MS = 60;
const IMAGES_SUR_PLACE = 2;

const progression = (avancement: number) => avancement * avancement * (3 - 2 * avancement);

type Props = {
  readonly trajet: Trajet;
  readonly onArrivee: () => void;
};

/** Le mot juste en chemin vers sa place : décor pour les yeux, jamais annoncé. */
export function MotQuiVoyage({ trajet, onArrivee }: Props) {
  const element = useRef<HTMLSpanElement>(null);
  const modeDys = useModeDys();
  const arrivee = useRef(onArrivee);
  useEffect(() => {
    arrivee.current = onArrivee;
  });
  const { de, versLaPlace } = trajet;
  useEffect(() => {
    let image = 0;
    let poseA: number | undefined;
    let imagesDepuisLaPose = 0;
    const debut = performance.now();
    const avancer = (maintenant: number) => {
      const mot = element.current;
      if (mot === null) return;
      if (poseA !== undefined && ++imagesDepuisLaPose >= IMAGES_SUR_PLACE && maintenant - poseA >= DUREE_SUR_PLACE_MS) {
        return arrivee.current();
      }
      const avancement = Math.min((maintenant - debut) / DUREE_DU_VOYAGE_MS, 1);
      const vers = versLaPlace();
      const fraction = progression(avancement);
      mot.style.left = `${de.x + (vers.x - de.x) * fraction}px`;
      mot.style.top = `${de.y + (vers.y - de.y) * fraction}px`;
      if (avancement === 1) poseA ??= maintenant;
      image = requestAnimationFrame(avancer);
    };
    image = requestAnimationFrame(avancer);
    return () => cancelAnimationFrame(image);
  }, [de, versLaPlace]);
  return createPortal(
    <span
      ref={element}
      className="mot-qui-voyage"
      data-testid="mot-qui-voyage"
      data-mode-dys={modeDys ? "true" : undefined}
      aria-hidden="true"
      style={{ left: de.x, top: de.y }}
    >
      <TexteEnSyllabes texte={trajet.mot} />
    </span>,
    document.body,
  );
}
