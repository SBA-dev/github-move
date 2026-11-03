import type { ReactNode } from "react";
import { useUnivers } from "../../univers/index.ts";
import { DESSINS_DES_PARCHEMINS } from "./dessins-du-parchemin.tsx";
import type { Deroule } from "./useDeroulementDuParchemin.ts";

type Props = {
  readonly deroule: Deroule;
  readonly children: ReactNode;
};

/** Le dessin de l'univers autour d'un texte à lire : un parchemin, un tableau, un carnet… (le texte reste du texte). */
export function Parchemin({ deroule, children }: Props) {
  const univers = useUnivers();
  const { haut, bas } = DESSINS_DES_PARCHEMINS[univers];
  return (
    <div className="parchemin" data-testid="parchemin" data-univers={univers} data-deroule={deroule}>
      <BandeDuDessin bande={haut} />
      <div className="corps-du-parchemin">{children}</div>
      <BandeDuDessin bande={bas} />
    </div>
  );
}

function BandeDuDessin({ bande }: { readonly bande: { readonly fenetre: string; readonly hauteur: number; readonly formes: ReactNode } }) {
  return (
    <svg
      className="bande-du-parchemin"
      data-testid="dessin-du-parchemin"
      aria-hidden="true"
      focusable="false"
      viewBox={bande.fenetre}
      preserveAspectRatio="xMidYMid meet"
      style={{ height: bande.hauteur }}
    >
      {bande.formes}
    </svg>
  );
}
