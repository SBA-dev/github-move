import { useCallback, useEffect, useState } from "react";
import {
  type ChoixDeSeance,
  ExerciceIntrouvable,
  LeconSansExercice,
  NombreDeQuestionsInconnu,
  Seance,
  seanceComplete,
  seanceDUnExercice,
} from "@domain/apprentissage";
import { type Lecon, pageDeLaLecon } from "@domain/catalogue";
import type { Univers } from "@domain/motivation";
import type { Voix } from "../voix/index.ts";
import { chargerLaLecon, type ResultatDeLecture } from "./bibliotheque.ts";
import { generateurIdDuNavigateur, hasardDeLaSeance } from "./adaptateurs-navigateur.ts";
import { EcranDeSeance } from "./EcranDeSeance.tsx";
import { PageDeLaLecon } from "./PageDeLaLecon.tsx";

type Props = {
  readonly leconId: string;
  readonly enfant: { readonly id: string; readonly prenom: string; readonly modeDys: boolean };
  readonly univers: Univers;
  readonly voix: Voix;
  readonly onRetourSurLaSeance: (retour: (() => void) | undefined) => void;
  readonly onQuitter: () => void;
};

const MESSAGE_DE_JEU_INDISPONIBLE = "Ce jeu n'est pas encore prêt. Choisis-en un autre !";

function MessageNonPunitif({ texte, onQuitter }: { readonly texte: string; readonly onQuitter: () => void }) {
  return (
    <section className="lecon-indisponible">
      <p className="message-erreur" role="status">{texte}</p>
      <button type="button" onClick={onQuitter}>Retour à l'accueil</button>
    </section>
  );
}

function useLecon(leconId: string): ResultatDeLecture | undefined {
  const [resultat, setResultat] = useState<{ leconId: string; lecture: ResultatDeLecture } | undefined>();
  useEffect(() => {
    let annule = false;
    void chargerLaLecon(leconId).then((lecture) => !annule && setResultat({ leconId, lecture }));
    return () => {
      annule = true;
    };
  }, [leconId]);
  return resultat?.leconId === leconId ? resultat.lecture : undefined;
}

function LeconOuverte({ lecon, enfant, univers, voix, onRetourSurLaSeance }: Omit<Props, "leconId" | "onQuitter"> & { readonly lecon: Lecon }) {
  const [seance, setSeance] = useState<Seance | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  const commencer = (choisir: () => ChoixDeSeance) => {
    try {
      setSeance(Seance.commencer({
        lecon,
        enfant: enfant.id,
        choix: choisir(),
        generateurId: generateurIdDuNavigateur,
        hasard: hasardDeLaSeance,
      }));
      setMessage(undefined);
    } catch (erreur) {
      if (
        !(erreur instanceof NombreDeQuestionsInconnu || erreur instanceof LeconSansExercice ||
          erreur instanceof ExerciceIntrouvable)
      ) throw erreur;
      setMessage(MESSAGE_DE_JEU_INDISPONIBLE);
    }
  };

  const { couperLaVoix } = voix;
  const abandonner = useCallback(() => {
    couperLaVoix();
    setSeance(undefined);
  }, [couperLaVoix]);

  const enSeance = seance !== undefined;
  useEffect(() => {
    onRetourSurLaSeance(enSeance ? abandonner : undefined);
    return () => onRetourSurLaSeance(undefined);
  }, [enSeance, abandonner, onRetourSurLaSeance]);

  if (seance) {
    return <EcranDeSeance seance={seance} lecon={lecon} univers={univers} voix={voix} modeDys={enfant.modeDys} />;
  }
  return (
    <PageDeLaLecon
      page={pageDeLaLecon(lecon)}
      prenom={enfant.prenom}
      univers={univers}
      voix={voix}
      modeDys={enfant.modeDys}
      message={message}
      onSeanceComplete={() => commencer(seanceComplete)}
      onUnExercice={(position) => commencer(() => seanceDUnExercice(lecon, position))}
    />
  );
}

export function PageLecon({ leconId, enfant, univers, voix, onRetourSurLaSeance, onQuitter }: Props) {
  const resultat = useLecon(leconId);
  if (resultat === undefined) return <p role="status">Je cherche la leçon…</p>;
  if (resultat.type === "introuvable") {
    return <MessageNonPunitif texte="Je ne trouve pas cette leçon. On retourne à l'accueil ?" onQuitter={onQuitter} />;
  }
  if (resultat.type === "indisponible") {
    return <MessageNonPunitif texte="La leçon ne s'ouvre pas pour l'instant. On réessaie un peu plus tard ?" onQuitter={onQuitter} />;
  }
  return (
    <LeconOuverte
      lecon={resultat.lecon}
      enfant={enfant}
      univers={univers}
      voix={voix}
      onRetourSurLaSeance={onRetourSurLaSeance}
    />
  );
}
