import type { ReactNode } from "react";
import type { CleDeTenue } from "@domain/motivation";

const CONTOUR = "#33304A";

/** Où poser une tenue sur un personnage guide : position et taille relative au dessin de Coach Léo. */
type Repere = { readonly x: number; readonly y: number; readonly echelle: number };

export type Ancrage = {
  readonly cou: Repere;
  readonly dos: Repere & { readonly elargissement: number };
  readonly pieds: {
    readonly gauche: Repere;
    readonly droit: Repere;
    readonly tige: number;
    /** Les bottes passent derrière le vêtement (le manteau de Capitaine Sam les surplombe). */
    readonly derriere?: true;
  };
};

function placer({ x, y, echelle }: Repere, dessin: ReactNode): ReactNode {
  return <g transform={`translate(${x} ${y}) scale(${echelle})`}>{dessin}</g>;
}

const ROUGE_DE_L_ECHARPE = "#E8604C";
const CREME_DE_L_ECHARPE = "#FFF4DC";
const BANDE_DU_COL = "M-19 -6 Q0 4 19 -6 L19 4 Q0 14 -19 4 Z";

function Echarpe({ id }: { readonly id: string }) {
  const bandesDuCol = [-19, -13, -7, -1, 5, 11, 17].map((x, i) => (
    <rect key={x} x={x} y="-8" width="6" height="24" fill={i % 2 === 0 ? ROUGE_DE_L_ECHARPE : CREME_DE_L_ECHARPE} />
  ));
  const bandesDeLaQueue = [3, 8.5, 14, 19.5].map((y, i) => (
    <rect key={y} x="-20" y={y} width="14" height="5.5" fill={i % 2 === 0 ? ROUGE_DE_L_ECHARPE : CREME_DE_L_ECHARPE} />
  ));
  return (
    <g data-tenue-dessin="echarpe-rayee" strokeLinejoin="round">
      <clipPath id={`${id}queue`}>
        <path d="M-19 2 L-6 4 L-7 25 L-20 24 Z" />
      </clipPath>
      <clipPath id={`${id}col`}>
        <path d={BANDE_DU_COL} />
      </clipPath>
      <g clipPath={`url(#${id}queue)`}>{bandesDeLaQueue}</g>
      <path d="M-19 2 L-6 4 L-7 25 L-20 24 Z" fill="none" stroke={CONTOUR} strokeWidth="2.4" />
      <path d="M-19 25 v4 M-15 25 v4 M-11 25 v4" stroke={ROUGE_DE_L_ECHARPE} strokeWidth="2" strokeLinecap="round" />
      <g clipPath={`url(#${id}col)`}>{bandesDuCol}</g>
      <path d={BANDE_DU_COL} fill="none" stroke={CONTOUR} strokeWidth="2.4" />
    </g>
  );
}

function NoeudPapillon() {
  return (
    <g data-tenue-dessin="noeud-papillon" stroke={CONTOUR} strokeWidth="2.4" strokeLinejoin="round">
      <path d="M-2 0 Q-8 -9 -15 -8 Q-18 0 -15 8 Q-8 9 -2 0 Z" fill="#7A4FD6" />
      <path d="M2 0 Q8 -9 15 -8 Q18 0 15 8 Q8 9 2 0 Z" fill="#7A4FD6" />
      <g stroke="none" fill="#FFFFFF" opacity=".85">
        <circle cx="-10" cy="-2.5" r="1.7" />
        <circle cx="-10" cy="3" r="1.7" />
        <circle cx="10" cy="-2.5" r="1.7" />
        <circle cx="10" cy="3" r="1.7" />
      </g>
      <rect x="-4.5" y="-5" width="9" height="10" rx="3.5" fill="#FFC93C" />
    </g>
  );
}

function SacADos({ id, elargissement }: { readonly id: string; readonly elargissement: number }) {
  const demiLargeur = 23 * elargissement;
  return (
    <g data-tenue-dessin="sac-a-dos-d-explorateur" stroke={CONTOUR} strokeWidth="2.6" strokeLinejoin="round">
      <defs>
        <radialGradient id={`${id}sac`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#8FDDA8" />
          <stop offset="1" stopColor="#4FB37A" />
        </radialGradient>
      </defs>
      <rect x={-demiLargeur} y="-24" width={2 * demiLargeur} height="48" rx="15" fill={`url(#${id}sac)`} />
      <path
        d={`M${-demiLargeur} -6 Q${-demiLargeur} -24 -8 -24 H8 Q${demiLargeur} -24 ${demiLargeur} -6 Q0 4 ${-demiLargeur} -6 Z`}
        fill="#3E9466"
      />
      <rect x={-demiLargeur * 0.6} y="9" width={demiLargeur * 1.2} height="13" rx="6" fill="#A8703A" />
      <rect x="-4" y="-4" width="8" height="7" rx="2.5" fill="#FFC93C" strokeWidth="1.8" />
    </g>
  );
}

function BretellesDuSac() {
  return (
    <g data-tenue-dessin="sac-a-dos-d-explorateur-bretelles" fill="none" stroke={CONTOUR} strokeLinecap="round">
      <path d="M-12 -18 Q-16 0 -14 18 M12 -18 Q16 0 14 18" strokeWidth="8" />
      <path d="M-12 -18 Q-16 0 -14 18 M12 -18 Q16 0 14 18" strokeWidth="4.4" stroke="#A8703A" />
    </g>
  );
}

function Botte({ tige }: { readonly tige: number }) {
  const haut = -tige;
  return (
    <g stroke={CONTOUR} strokeWidth="2.6" strokeLinejoin="round">
      <path
        d={`M-9 ${haut} H9 V0 Q14 1 14 8 Q14 15 7 16 H-7 Q-14 15 -14 8 Q-14 1 -9 0 Z`}
        fill="#FFC93C"
      />
      <path d={`M-9 ${haut} H9 V${haut + 6} H-9 Z`} fill="#E8604C" />
      <path d="M-14 12 H14" strokeWidth="1.6" stroke="#B9831A" />
      <path d={`M-5 ${haut + 10} V3`} stroke="#FFF3B8" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  );
}

function BottesDePluie({ pieds }: { readonly pieds: Ancrage["pieds"] }) {
  return (
    <g data-tenue-dessin="bottes-de-pluie">
      {placer(pieds.gauche, <Botte tige={pieds.tige} />)}
      {placer(pieds.droit, <Botte tige={pieds.tige} />)}
    </g>
  );
}

type Pose = (props: { readonly ancrage: Ancrage; readonly id: string }) => ReactNode;

const SANS_DESSIN: Pose = () => null;
const bottes: Pose = ({ ancrage }) => <BottesDePluie pieds={ancrage.pieds} />;

const DESSINS_DES_TENUES: Readonly<Record<CleDeTenue, { readonly derriere: Pose; readonly devant: Pose }>> = {
  "echarpe-rayee": {
    derriere: SANS_DESSIN,
    devant: ({ ancrage, id }) => placer(ancrage.cou, <Echarpe id={id} />),
  },
  "noeud-papillon": {
    derriere: SANS_DESSIN,
    devant: ({ ancrage }) => placer(ancrage.cou, <NoeudPapillon />),
  },
  "sac-a-dos-d-explorateur": {
    derriere: ({ ancrage, id }) => placer(ancrage.dos, <SacADos id={id} elargissement={ancrage.dos.elargissement} />),
    devant: ({ ancrage }) => placer(ancrage.dos, <BretellesDuSac />),
  },
  "bottes-de-pluie": {
    derriere: (props) => (props.ancrage.pieds.derriere ? bottes(props) : null),
    devant: (props) => (props.ancrage.pieds.derriere ? null : bottes(props)),
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
