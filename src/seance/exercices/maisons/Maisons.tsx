import { Fragment, type KeyboardEvent, type RefObject, useRef } from "react";
import type { EtiquettePosee } from "@domain/apprentissage";
import type { Exercice } from "@domain/catalogue";
import { useRetourDe } from "../../../retours/index.ts";
import { TexteEnSyllabes } from "../../../reglages/index.ts";
import { useUnivers } from "../../../univers/index.ts";
import { DessinDeLaMaison } from "./DessinDeLaMaison.tsx";
import { useMaisonAllumee } from "./useMaisonAllumee.ts";

type Groupe = Extract<Exercice, { type: "classer" }>["groupes"][number];

type Props = {
  readonly exercice: Extract<Exercice, { type: "classer" }>;
  readonly posees: readonly EtiquettePosee[];
  readonly choisie: string | undefined;
  readonly maisonQuiBrille: string | undefined;
  /** La maison au-dessus de laquelle une étiquette tenue au doigt passe. */
  readonly maisonSurvolee: string | undefined;
  readonly conteneur: RefObject<HTMLDivElement | null>;
  readonly onPoser: (etiquette: string, groupe: string) => void;
};

/** Les maisons d'un exercice classer : une étiquette s'y pose en la glissant, ou en la choisissant puis en touchant la maison. */
export function Maisons({ exercice, posees, choisie, maisonQuiBrille, maisonSurvolee, conteneur, onPoser }: Props) {
  const portes = useRef<Array<HTMLButtonElement | null>>([]);
  const passerALaMaisonVoisine = (rang: number, evenement: KeyboardEvent) => {
    const voisine = rang + (evenement.key === "ArrowRight" ? 1 : evenement.key === "ArrowLeft" ? -1 : 0);
    if (voisine === rang) return;
    evenement.preventDefault();
    portes.current[voisine]?.focus();
  };
  return (
    <div className="maisons" ref={conteneur}>
      {exercice.groupes.map((groupe, rang) => (
        <Fragment key={groupe.id}>
          <Maison
            groupe={groupe}
            posees={posees.filter((posee) => posee.groupe === groupe.id)}
            choisie={choisie}
            brille={groupe.id === maisonQuiBrille}
            survolee={groupe.id === maisonSurvolee}
            refDeLaPorte={(porte) => {
              portes.current[rang] = porte;
            }}
            onFleche={(evenement) => passerALaMaisonVoisine(rang, evenement)}
            onPoser={onPoser}
          />
          {" "}
        </Fragment>
      ))}
    </div>
  );
}

type PropsDUneMaison = {
  readonly groupe: Groupe;
  readonly posees: readonly EtiquettePosee[];
  readonly choisie: string | undefined;
  readonly brille: boolean;
  readonly survolee: boolean;
  readonly refDeLaPorte: (porte: HTMLButtonElement | null) => void;
  readonly onFleche: (evenement: KeyboardEvent) => void;
  readonly onPoser: (etiquette: string, groupe: string) => void;
};

function Maison({ groupe, posees, choisie, brille, survolee, refDeLaPorte, onFleche, onPoser }: PropsDUneMaison) {
  const univers = useUnivers();
  const ouverte = posees.length > 0;
  const allumee = useMaisonAllumee(ouverte);
  return (
    <section
      className="maison"
      role="group"
      aria-label={`Maison « ${groupe.nom} »`}
      data-testid="maison"
      data-groupe={groupe.id}
      data-univers={univers}
      data-ouverte={String(ouverte)}
      data-allumee={String(allumee)}
      data-survolee={survolee ? "true" : undefined}
      data-brille={brille ? "true" : undefined}
    >
      <DessinDeLaMaison univers={univers} ouverte={ouverte} allumee={allumee} />
      {brille && <span className="signal-brille" data-testid="signal-brille" data-brille="true" aria-hidden="true" />}
      {survolee && <span className="signal-de-survol" data-testid="signal-de-survol" aria-hidden="true" />}
      <button
        ref={refDeLaPorte}
        type="button"
        className="porte-de-la-maison"
        data-donne-une-reponse="true"
        aria-label={`Poser dans la maison « ${groupe.nom} »`}
        aria-disabled={choisie === undefined ? true : undefined}
        onClick={() => choisie !== undefined && onPoser(choisie, groupe.id)}
        onKeyDown={onFleche}
      >
        <TexteEnSyllabes texte={groupe.nom} />
      </button>
      <ul aria-label={`Étiquettes dans la maison « ${groupe.nom} »`}>
        {posees.map((posee, rang) => <EtiquettePosee key={`${posee.texte}-${rang}`} texte={posee.texte} />)}
      </ul>
    </section>
  );
}

/** Une étiquette bien posée dans sa maison : elle rebondit. */
function EtiquettePosee({ texte }: { readonly texte: string }) {
  const retour = useRetourDe<HTMLLIElement>(texte);
  return (
    <li ref={retour.ref} className="etiquette posee" data-testid="etiquette-posee" {...retour.attributs}>
      <TexteEnSyllabes texte={texte} />
    </li>
  );
}
