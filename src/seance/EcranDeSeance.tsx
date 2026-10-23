import { useEffect, useRef, useState } from "react";
import { ChoixDeSeance, ExerciceIntrouvable, LeconSansExercice, Seance } from "@domain/apprentissage";
import { type Lecon, enonceDeLaQuestion, pageDeLaLecon } from "@domain/catalogue";
import type { Univers } from "@domain/motivation";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";
import { BulleDuPersonnageGuide } from "./BulleDuPersonnageGuide.tsx";
import { generateurIdDuNavigateur } from "./generateur-id-navigateur.ts";
import { RecipientDeProgression } from "./RecipientDeProgression.tsx";
import { useDeroulementDeSeance } from "./useDeroulementDeSeance.ts";
import { useLecon } from "./useLecon.ts";

type Props = {
  readonly leconId: string;
  /** Sans position : la séance complète ; avec une position : un seul exercice. */
  readonly exercice: number | undefined;
  readonly prenom: string;
  readonly univers: Univers;
  readonly voix: Voix;
  readonly onRetour: () => void;
};

function commencerLaSeance(prenom: string, lecon: Lecon, exercice: number | undefined): Seance | undefined {
  const choix = exercice === undefined ? ChoixDeSeance.complete() : ChoixDeSeance.unExercice(exercice);
  try {
    return Seance.commencer(generateurIdDuNavigateur, prenom, lecon, choix);
  } catch (erreur) {
    if (erreur instanceof ExerciceIntrouvable || erreur instanceof LeconSansExercice) return undefined;
    throw erreur;
  }
}

export function EcranDeSeance({ leconId, ...reste }: Props) {
  const chargee = useLecon(leconId);
  if (chargee.type === "chargement") return <p>Chargement de la leçon…</p>;
  if (chargee.type === "introuvable") return <JeuIntrouvable onRetour={reste.onRetour} />;
  return <SeanceDeLaLecon lecon={chargee.lecon} {...reste} />;
}

function JeuIntrouvable({ onRetour }: { readonly onRetour: () => void }) {
  return (
    <section className="seance">
      <h2>Jeu introuvable</h2>
      <p>Ce jeu n'est pas dans la leçon.</p>
      <button type="button" onClick={onRetour}>Retour</button>
    </section>
  );
}

type PropsDeLaLecon = Omit<Props, "leconId"> & { readonly lecon: Lecon };

function SeanceDeLaLecon({ lecon, exercice, prenom, ...reste }: PropsDeLaLecon) {
  const [seance] = useState(() => commencerLaSeance(prenom, lecon, exercice));
  if (!seance) return <JeuIntrouvable onRetour={reste.onRetour} />;
  return <SeanceEnCours seance={seance} lecon={lecon} {...reste} />;
}

type PropsEnCours = Omit<PropsDeLaLecon, "exercice" | "prenom"> & { readonly seance: Seance };

function SeanceEnCours({ seance, lecon, univers, voix, onRetour }: PropsEnCours) {
  const deroulement = useDeroulementDeSeance(seance, lecon, voix);
  const { commencer, abandonner } = deroulement;
  useEffect(() => {
    void commencer();
    return abandonner;
  }, [commencer, abandonner]);

  const { titre, niveauEtMatiere } = pageDeLaLecon(lecon);
  const etape = seance.etapeDeLeconEnCours();
  const exerciceJoue = seance.exerciceEnCours();
  const exerciceDeLaLecon = exerciceJoue && lecon.exercices[exerciceJoue.position];
  const question = exerciceJoue && exerciceDeLaLecon && enonceDeLaQuestion(exerciceDeLaLecon, exerciceJoue.rangDeLaQuestionEnCours);
  const zoneDeLExercice = useRef<HTMLDivElement>(null);
  const exerciceCommence = exerciceJoue !== undefined;
  const dejaMonte = useRef(false);
  useEffect(() => {
    if (exerciceCommence && dejaMonte.current) zoneDeLExercice.current?.focus();
    dejaMonte.current = true;
  }, [exerciceCommence]);

  return (
    <section className="seance" aria-labelledby="titre-de-la-seance">
      <div className="entete-de-seance">
        <button type="button" onClick={onRetour}>Retour</button>
        <div>
          <h2 id="titre-de-la-seance">{titre}</h2>
          <p data-testid="niveau-et-matiere">{niveauEtMatiere}</p>
        </div>
      </div>
      <RecipientDeProgression avancement={seance.avancement()} />
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={deroulement.humeur} />
        <BulleDuPersonnageGuide
          texte={deroulement.parole?.texte}
          nature={deroulement.parole?.nature}
          rangDuMotPrononce={deroulement.rangDuMotPrononce}
        />
      </div>
      <button type="button" onClick={deroulement.reecouter}>Réécouter</button>
      {etape && (
        <div className="etape-de-lecon" data-testid="etape-de-lecon">
          {etape.exemples.length > 0 && (
            <ul className="exemples" aria-label="Exemples">
              {etape.exemples.map((exemple, i) => <li key={i} className="pastille" data-testid="exemple">{exemple}</li>)}
            </ul>
          )}
          <button type="button" onClick={() => void deroulement.continuer()}>Continuer</button>
        </div>
      )}
      {exerciceJoue && (
        <div ref={zoneDeLExercice} tabIndex={-1} className="exercice-en-cours" data-testid="exercice-en-cours" data-position={exerciceJoue.position}>
          {question !== undefined && <p className="question" data-testid="question">{question}</p>}
        </div>
      )}
    </section>
  );
}
