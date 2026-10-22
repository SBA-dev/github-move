import { useState } from "react";
import {
  HUMEUR_PAR_DEFAUT,
  type Parole,
  presentation,
  reagirALaReponse,
  type Reaction,
  type Univers,
} from "@domain/motivation";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import { PersonnageGuide } from "../univers/index.ts";

export function PageDemonstration({ univers }: { readonly univers: Univers }) {
  const [reaction, setReaction] = useState<Reaction | undefined>();
  const humeur = reaction?.humeur ?? HUMEUR_PAR_DEFAUT;
  const parole: Parole | undefined = reaction?.parole;

  function repondre(juste: boolean) {
    setReaction(reagirALaReponse(juste, univers.personnageGuide, hasardDuNavigateur));
  }

  return (
    <section className="demonstration" aria-labelledby="titre-demonstration">
      <h2 id="titre-demonstration">Page de démonstration</h2>
      <p data-testid="presentation">{presentation(univers)}</p>
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={humeur} />
        <div className="bulle" role="status" data-testid="parole" data-nature={parole?.nature}>
          {parole?.texte}
        </div>
      </div>
      <p className="consigne" data-testid="consigne">Combien font 3 + 4 ?</p>
      <div className="reponses">
        <button type="button" onClick={() => repondre(true)}>Bonne réponse</button>
        <button type="button" onClick={() => repondre(false)}>Erreur</button>
      </div>
    </section>
  );
}
