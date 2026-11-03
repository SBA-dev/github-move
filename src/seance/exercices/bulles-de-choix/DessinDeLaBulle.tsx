import { useId, useLayoutEffect, useRef, useState } from "react";
import type { CleUnivers } from "@domain/motivation";
import { DESSINS_DES_BULLES } from "./dessins/index.ts";
import { HAUTEUR_DE_REFERENCE, LARGEUR_DE_REFERENCE } from "./dessins/dessin-de-bulle.tsx";

const EPAISSEUR_DU_TRAIT = 3;

type Props = {
  readonly univers: CleUnivers;
  readonly ecarte: boolean;
};

/**
 * Le dessin de la bulle de choix : décor pour les yeux, jamais annoncé. Il prend la taille de la bulle, texte compris :
 * les bouts gardent leur rayon (la moitié de la hauteur) et le milieu s'étire, sans rien déformer.
 * Les couleurs du fond et du trait changent selon l'état de la bulle (écartée, bonne réponse montrée, réussie) : voir `styles.css`.
 */
export function DessinDeLaBulle({ univers, ecarte }: Props) {
  const p = useId();
  const calque = useRef<HTMLSpanElement>(null);
  const [taille, setTaille] = useState({ largeur: LARGEUR_DE_REFERENCE, hauteur: HAUTEUR_DE_REFERENCE });
  useLayoutEffect(() => {
    const element = calque.current;
    if (element === null) return;
    const mesurer = () =>
      setTaille((avant) =>
        avant.largeur === element.offsetWidth && avant.hauteur === element.offsetHeight
          ? avant
          : { largeur: element.offsetWidth, hauteur: element.offsetHeight }
      );
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  const { largeur, hauteur } = taille;
  const dessin = DESSINS_DES_BULLES[univers];
  const demiTrait = EPAISSEUR_DU_TRAIT / 2;
  const rayon = (hauteur - EPAISSEUR_DU_TRAIT) / 2;
  const contour = `M${demiTrait + rayon} ${demiTrait}H${largeur - demiTrait - rayon}A${rayon} ${rayon} 0 0 1 ${largeur - demiTrait - rayon} ${hauteur - demiTrait}H${demiTrait + rayon}A${rayon} ${rayon} 0 0 1 ${demiTrait + rayon} ${demiTrait}Z`;
  return (
    <span ref={calque} className="dessin-de-la-bulle" data-testid="dessin-de-la-bulle" aria-hidden="true">
      <svg width={largeur} height={hauteur} viewBox={`0 0 ${largeur} ${hauteur}`} focusable="false">
        {!ecarte && <defs>{dessin.degrades?.(p)}</defs>}
        <path
          d={contour}
          fill={dessin.fond}
          stroke={dessin.trait(p)}
          strokeWidth={EPAISSEUR_DU_TRAIT}
        />
        {!ecarte && (
          <g className="decor-de-la-bulle">{dessin.decor({ largeur, hauteur, echelle: hauteur / HAUTEUR_DE_REFERENCE, p })}</g>
        )}
      </svg>
    </span>
  );
}
