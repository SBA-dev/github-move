import type { EtatDuSon } from "@domain/voix";

export type Enfant = { readonly prenom: string; readonly niveau: string };

type Props = {
  readonly surAccueil: boolean;
  readonly enfant?: Enfant;
  readonly son: EtatDuSon;
  readonly retourPossible: boolean;
  readonly onBasculerLeSon: () => void;
  readonly onAccueil: () => void;
  readonly onRetour: () => void;
  readonly onEspaceParent: () => void;
};

export function EnTete({ surAccueil, enfant, son, retourPossible, onBasculerLeSon, onAccueil, onRetour, onEspaceParent }: Props) {
  const Titre = surAccueil ? "h1" : "p";
  return (
    <header className="en-tete">
      <Titre className="nom-application">
        <button type="button" onClick={onAccueil}>Savanturier</button>
      </Titre>
      <div className="outils">
        {enfant && <span className="enfant" data-testid="enfant-en-cours">{enfant.prenom} · {enfant.niveau}</span>}
        <button type="button" aria-label="Son" aria-pressed={son === "son"} data-son={son} onClick={onBasculerLeSon}>
          <span aria-hidden="true">{son === "son" ? "🔊" : "🔇"}</span> Son
        </button>
        {retourPossible && <button type="button" onClick={onRetour}>Retour</button>}
        <button type="button" onClick={onEspaceParent}>Espace parent</button>
      </div>
    </header>
  );
}
