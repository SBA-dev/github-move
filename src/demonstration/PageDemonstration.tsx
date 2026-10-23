import { useCallback, useEffect, useRef, useState } from "react";
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
import { ConsigneLue, type Voix } from "../voix/index.ts";
import { lireConsigne } from "./consigne-preparee.ts";

type Props = { readonly univers: Univers; readonly voix: Voix };

export function PageDemonstration({ univers, voix }: Props) {
  const [reaction, setReaction] = useState<Reaction | undefined>();
  const [consigne] = useState(lireConsigne);
  const [rangDuMotPrononce, setRangDuMotPrononce] = useState<number | undefined>();
  const derniereLecture = useRef(0);
  const { lire, couperLaVoix } = voix;
  const humeur = reaction?.humeur ?? HUMEUR_PAR_DEFAUT;
  const parole: Parole | undefined = reaction?.parole;

  const lireLaConsigne = useCallback(() => {
    const numero = ++derniereLecture.current;
    const estLaDerniere = () => numero === derniereLecture.current;
    setRangDuMotPrononce(undefined);
    void lire(consigne.texte, {
      langue: consigne.langue,
      onMot: (rang) => estLaDerniere() && setRangDuMotPrononce(rang),
      onFin: () => estLaDerniere() && setRangDuMotPrononce(undefined),
    });
  }, [lire, consigne]);

  useEffect(() => {
    lireLaConsigne();
    return couperLaVoix;
  }, [lireLaConsigne, couperLaVoix]);

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
      <ConsigneLue consigne={consigne} rangDuMotPrononce={rangDuMotPrononce} />
      <button type="button" onClick={lireLaConsigne}>Réécouter</button>
      <div className="reponses">
        <button type="button" onClick={() => repondre(true)}>Bonne réponse</button>
        <button type="button" onClick={() => repondre(false)}>Erreur</button>
      </div>
    </section>
  );
}
