import { useCallback, useEffect, useRef, useState } from "react";
import {
  HUMEUR_PAR_DEFAUT,
  type Parole,
  presentation,
  reagirALaReponse,
  type Reaction,
  type Univers,
} from "@domain/motivation";
import { lectureDesChoix } from "@domain/apprentissage";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import { TexteEnSyllabes } from "../reglages/index.ts";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";
import { lireConsigne } from "./consigne-preparee.ts";
import { ConsigneLue } from "./ConsigneLue.tsx";

type Props = {
  readonly univers: Univers;
  readonly voix: Voix;
  /** Réglage du profil en cours : les choix proposés sont lus après la consigne. */
  readonly toutLireAVoixHaute: boolean;
};

export function PageDemonstration({ univers, voix, toutLireAVoixHaute }: Props) {
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
    const choixALire = toutLireAVoixHaute ? lectureDesChoix(consigne.choix ?? []) : undefined;
    void (async () => {
      await lire(consigne.texte, {
        langue: consigne.langue,
        onMot: (rang) => estLaDerniere() && setRangDuMotPrononce(rang),
        onFin: () => estLaDerniere() && setRangDuMotPrononce(undefined),
      });
      if (choixALire !== undefined && estLaDerniere()) await lire(choixALire);
    })();
  }, [lire, consigne, toutLireAVoixHaute]);

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
          {parole && <TexteEnSyllabes texte={parole.texte} />}
        </div>
      </div>
      <ConsigneLue consigne={consigne} rangDuMotPrononce={rangDuMotPrononce} />
      {consigne.choix && consigne.choix.length > 0 && (
        <ul className="choix-de-demonstration" data-testid="choix-de-demonstration" aria-label="Choix">
          {consigne.choix.map((choix) => <li key={choix} className="pastille"><TexteEnSyllabes texte={choix} /></li>)}
        </ul>
      )}
      <button type="button" onClick={lireLaConsigne}>Réécouter</button>
      <div className="reponses">
        <button type="button" onClick={() => repondre(true)}>Bonne réponse</button>
        <button type="button" onClick={() => repondre(false)}>Erreur</button>
      </div>
    </section>
  );
}
