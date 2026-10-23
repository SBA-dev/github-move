import { useEffect, useReducer, useRef, useState } from "react";
import { type Seance, texteALireDeLEtape } from "@domain/apprentissage";
import { type Lecon, pageDeLaLecon } from "@domain/catalogue";
import { finDesEtapes, HUMEUR_PAR_DEFAUT, type Univers } from "@domain/motivation";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import { PersonnageGuide } from "../univers/index.ts";
import { ConsigneLue, type Voix } from "../voix/index.ts";
import { BulleDuPersonnage } from "./BulleDuPersonnage.tsx";
import { Recipient } from "./Recipient.tsx";
import { useParoleLue } from "./useParoleLue.ts";

type Props = {
  readonly seance: Seance;
  readonly lecon: Lecon;
  readonly univers: Univers;
  readonly voix: Voix;
  readonly modeDys: boolean;
};

type FinDesEtapes = ReturnType<typeof finDesEtapes>;

export function EcranDeSeance({ seance, lecon, univers, voix, modeDys }: Props) {
  const [, rafraichir] = useReducer((n: number) => n + 1, 0);
  const [fin, setFin] = useState<FinDesEtapes | undefined>();
  const derniereLecture = useRef<() => void>(() => {});
  const { lireLaParole, arreter, rangDuMotPrononceDans } = useParoleLue(voix);

  const etape = seance.etapeDeLeconEnCours();
  const position = seance.exerciceEnCours()?.position;
  const exercice = position === undefined ? undefined : pageDeLaLecon(lecon).exercices[position];
  const consigne = position === undefined ? undefined : lecon.exercices[position]?.consigne;

  useEffect(() => {
    if (etape === undefined) return;
    const parties = texteALireDeLEtape(etape);
    const lecture = () => void lireLaParole(parties.join(" "), etape.texte);
    derniereLecture.current = lecture;
    lecture();
    return arreter;
  }, [etape, lireLaParole, arreter]);

  useEffect(() => {
    if (position === undefined) return;
    const lecture = async () => {
      if (fin && !await lireLaParole(fin.texte)) return;
      if (consigne) await lireLaParole(consigne);
    };
    derniereLecture.current = () => void lireLaParole(consigne ?? fin?.texte ?? "", consigne);
    void lecture();
    return arreter;
  }, [position, fin, consigne, lireLaParole, arreter]);

  const continuer = () => {
    seance.continuer();
    if (seance.etapeDeLeconEnCours() === undefined) setFin(finDesEtapes(hasardDuNavigateur));
    rafraichir();
  };

  return (
    <section className="seance" aria-labelledby="titre-seance">
      <h2 id="titre-seance">{lecon.titre}</h2>
      <Recipient avancement={seance.avancement()} />
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={fin && !etape ? fin.humeur : HUMEUR_PAR_DEFAUT} />
        <BulleDuPersonnage modeDys={modeDys}>
          {etape && (
            <div data-testid="etape-de-lecon">
              <ConsigneLue consigne={{ texte: etape.texte }} rangDuMotPrononce={rangDuMotPrononceDans(etape.texte)} />
              {etape.exemples.length > 0 && (
                <ul className="exemples" aria-label="Exemples" data-dys={modeDys ? "true" : undefined}>
                  {etape.exemples.map((exemple) => <li key={exemple} data-testid="exemple">{exemple}</li>)}
                </ul>
              )}
            </div>
          )}
          {!etape && fin?.texte}
        </BulleDuPersonnage>
      </div>
      {etape && <button type="button" onClick={continuer}>Continuer</button>}
      {exercice && (
        <div className="exercice-en-cours" data-testid="exercice-en-cours" data-position={position}>
          <h3>{exercice.titre}</h3>
          {exercice.titre !== exercice.libelleDuType && <p>{exercice.libelleDuType}</p>}
          {consigne && (
            <ConsigneLue consigne={{ texte: consigne }} rangDuMotPrononce={rangDuMotPrononceDans(consigne)} />
          )}
        </div>
      )}
      <button type="button" onClick={() => derniereLecture.current()}>Réécouter</button>
    </section>
  );
}
