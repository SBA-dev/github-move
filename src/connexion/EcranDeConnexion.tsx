import { useState } from "react";
import { FormulaireDeConnexion } from "./FormulaireDeConnexion.tsx";
import { FormulaireDeReinitialisation } from "./FormulaireDeReinitialisation.tsx";
import { FormulaireDInscription } from "./FormulaireDInscription.tsx";
import type { Connexion } from "./useConnexion.ts";

type Props = {
  readonly connexion: Connexion;
  readonly onConnecte: () => void;
};

type Ecran = "connexion" | "inscription" | "reinitialisation";

const TITRES: Record<Ecran, string> = {
  connexion: "Se connecter",
  inscription: "Créer ton compte",
  reinitialisation: "Mot de passe oublié",
};

export function EcranDeConnexion({ connexion, onConnecte }: Props) {
  const [ecran, setEcran] = useState<Ecran>("connexion");
  const aller = (suivant: Ecran) => () => setEcran(suivant);

  return (
    <section className="connexion" aria-labelledby="titre-connexion">
      <h2 id="titre-connexion">{TITRES[ecran]}</h2>
      {ecran === "connexion" && (
        <FormulaireDeConnexion
          connexion={connexion}
          onConnecte={onConnecte}
          onCreerLeCompte={aller("inscription")}
          onMotDePasseOublie={aller("reinitialisation")}
        />
      )}
      {ecran === "inscription" && (
        <FormulaireDInscription connexion={connexion} onConnecte={onConnecte} onSeConnecter={aller("connexion")} />
      )}
      {ecran === "reinitialisation" && (
        <FormulaireDeReinitialisation
          connexion={connexion}
          onConnecte={onConnecte}
          onSeConnecter={aller("connexion")}
        />
      )}
    </section>
  );
}
