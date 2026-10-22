import { useState } from "react";
import {
  encourager,
  feliciter,
  HUMEUR_PAR_DEFAUT,
  type Humeur,
  humeurApresReponse,
  presentation,
  type Univers,
} from "@domain/motivation";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import { PersonnageGuide } from "../univers/index.ts";

type Parole = { readonly nature: "felicitation" | "encouragement"; readonly texte: string };

export function PageDemonstration({ univers }: { readonly univers: Univers }) {
  const [humeur, setHumeur] = useState<Humeur>(HUMEUR_PAR_DEFAUT);
  const [parole, setParole] = useState<Parole | undefined>();

  function repondre(juste: boolean) {
    setHumeur(humeurApresReponse(juste));
    setParole(
      juste
        ? { nature: "felicitation", texte: feliciter(univers.personnageGuide, hasardDuNavigateur).texte }
        : { nature: "encouragement", texte: encourager(hasardDuNavigateur).texte },
    );
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
