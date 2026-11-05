import type { ReactNode } from "react";
import type { CleDeTenue } from "@domain/motivation";
import {
  type Ancrage,
  DESSIN_DES_BRETELLES,
  DESSIN_DU_NOEUD_PAPILLON,
  dessinDeLaBotte,
  dessinDeLEcharpe,
  dessinDuSacADos,
} from "../celebrations/commun/tenues.ts";

/** Les tracés viennent de `celebrations/commun/tenues.ts`, la source commune avec les scènes de célébration. */
export type { Ancrage };

type Repere = Ancrage["cou"];

function placer({ x, y, echelle }: Repere, dessin: ReactNode): ReactNode {
  return <g transform={`translate(${x} ${y}) scale(${echelle})`}>{dessin}</g>;
}

function Trace({ svg }: { readonly svg: string }) {
  return <g dangerouslySetInnerHTML={{ __html: svg }} />;
}

function BottesDePluie({ pieds }: { readonly pieds: Ancrage["pieds"] }) {
  const botte = <Trace svg={dessinDeLaBotte(pieds.tige)} />;
  return (
    <g data-tenue-dessin="bottes-de-pluie">
      {placer(pieds.gauche, botte)}
      {placer(pieds.droit, botte)}
    </g>
  );
}

type Pose = (props: { readonly ancrage: Ancrage; readonly id: string }) => ReactNode;

const SANS_DESSIN: Pose = () => null;

const DESSINS_DES_TENUES: Readonly<Record<CleDeTenue, { readonly derriere: Pose; readonly devant: Pose }>> = {
  "echarpe-rayee": {
    derriere: SANS_DESSIN,
    devant: ({ ancrage, id }) => placer(ancrage.cou, <Trace svg={dessinDeLEcharpe(id)} />),
  },
  "noeud-papillon": {
    derriere: SANS_DESSIN,
    devant: ({ ancrage }) => placer(ancrage.cou, <Trace svg={DESSIN_DU_NOEUD_PAPILLON} />),
  },
  "sac-a-dos-d-explorateur": {
    derriere: ({ ancrage, id }) => placer(ancrage.dos, <Trace svg={dessinDuSacADos(id, ancrage.dos.elargissement)} />),
    devant: ({ ancrage }) => placer(ancrage.dos, <Trace svg={DESSIN_DES_BRETELLES} />),
  },
  "bottes-de-pluie": {
    derriere: SANS_DESSIN,
    devant: ({ ancrage }) => <BottesDePluie pieds={ancrage.pieds} />,
  },
};

function dessinDeLaTenue(tenue: string | undefined) {
  return tenue !== undefined && Object.hasOwn(DESSINS_DES_TENUES, tenue) ? DESSINS_DES_TENUES[tenue as CleDeTenue] : undefined;
}

type PropsDeLaTenue = { readonly tenue?: string; readonly ancrage: Ancrage; readonly id: string };

export function TenueDerriere({ tenue, ancrage, id }: PropsDeLaTenue) {
  return dessinDeLaTenue(tenue)?.derriere({ ancrage, id }) ?? null;
}

export function TenueDevant({ tenue, ancrage, id }: PropsDeLaTenue) {
  return dessinDeLaTenue(tenue)?.devant({ ancrage, id }) ?? null;
}
