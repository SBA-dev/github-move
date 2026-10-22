import { useState } from "react";

export type Enfant = { readonly prenom: string; readonly niveau: string };

type Props = {
  readonly surAccueil: boolean;
  readonly enfant?: Enfant;
  readonly retourPossible: boolean;
  readonly onAccueil: () => void;
  readonly onRetour: () => void;
  readonly onEspaceParent: () => void;
};

export function EnTete({ surAccueil, enfant, retourPossible, onAccueil, onRetour, onEspaceParent }: Props) {
  const [son, setSon] = useState(true);
  const Titre = surAccueil ? "h1" : "p";
  return (
    <header className="en-tete">
      <Titre className="nom-application">
        <button type="button" onClick={onAccueil}>Savanturier</button>
      </Titre>
      <div className="outils">
        {enfant && <span className="enfant" data-testid="enfant-en-cours">{enfant.prenom} · {enfant.niveau}</span>}
        <button type="button" aria-pressed={son} onClick={() => setSon(!son)}>
          <span aria-hidden="true">{son ? "🔊" : "🔇"}</span> Son
        </button>
        {retourPossible && <button type="button" onClick={onRetour}>Retour</button>}
        <button type="button" onClick={onEspaceParent}>Espace parent</button>
      </div>
    </header>
  );
}
