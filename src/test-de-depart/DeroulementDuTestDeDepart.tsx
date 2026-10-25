import { useEffect } from "react";
import { QuestionDeCalcul, QuestionJouee, type TestDeDepart } from "@domain/apprentissage";
import type { PersonnageGuide, Univers } from "@domain/motivation";
import { ExerciceDeCalcul } from "../seance/exercices/ExerciceDeCalcul.tsx";
import { QuestionAChoix } from "../seance/exercices/QuestionAChoix.tsx";
import { RecipientDeProgression } from "../seance/RecipientDeProgression.tsx";
import type { Voix } from "../voix/index.ts";
import { ParoleDuGuide } from "./ParoleDuGuide.tsx";
import { type Personnage, useDeroulementDuTestDeDepart } from "./useDeroulementDuTestDeDepart.ts";

type Props = {
  readonly test: TestDeDepart;
  readonly nombreDeQuestions: number;
  readonly personnage: Personnage;
  readonly univers: Univers;
  readonly personnageGuide: PersonnageGuide;
  readonly voix: Voix;
  /** Réglage du profil en cours : les choix proposés sont lus après la question. */
  readonly toutLireAVoixHaute: boolean;
  readonly onFini: () => void;
};

/** Le test de départ en cours : une question à la fois, sans étape de leçon, avec l'avancement de la séance. */
export function DeroulementDuTestDeDepart(
  { test, nombreDeQuestions, personnage, univers, personnageGuide, voix, toutLireAVoixHaute, onFini }: Props,
) {
  const deroulement = useDeroulementDuTestDeDepart({
    test,
    nombreDeQuestions,
    personnage,
    lire: voix.lire,
    personnageGuide,
    toutLireAVoixHaute,
    onFini,
  });
  const { commencer, abandonner } = deroulement;
  useEffect(() => {
    void commencer();
    return abandonner;
  }, [commencer, abandonner]);

  const { figee } = deroulement;
  const question = figee ?? test.questionEnCours();
  return (
    <>
      <RecipientDeProgression avancement={deroulement.avancement} libelle="Avancement du test de départ" />
      <ParoleDuGuide personnage={personnage} univers={univers} onReecouter={deroulement.reecouter} />
      <div className="annonce-d-avancement" role="status" data-testid="annonce-d-avancement">
        {deroulement.avancementAnnonce}
      </div>
      {question && (
        <div className="exercice-en-cours" data-testid="exercice-en-cours">
          {question instanceof QuestionDeCalcul && (
            <ExerciceDeCalcul
              calcul={question.enCours()}
              reussi={figee !== undefined}
              onRelire={deroulement.relireLaQuestion}
              onChoisir={(texte) => void deroulement.repondreParUnChoix(texte)}
              onValider={(nombre) => void deroulement.repondreParUnNombre(nombre)}
              onJeNeSaisPas={() => void deroulement.jeNeSaisPas()}
            />
          )}
          {question instanceof QuestionJouee && (
            <QuestionAChoix
              question={question}
              avecEcoute={question.motAEcouter !== undefined}
              questionMasquee={false}
              choixVisibles={deroulement.choixVisiblesPour === question}
              reussie={figee !== undefined}
              bulleEclatee={deroulement.bulleEclatee}
              sonImpossible={voix.son === "muet" || !voix.syntheseVocalePresente}
              sonCoupe={voix.son === "muet"}
              onChoisir={(texte) => void deroulement.repondreParUnChoix(texte)}
              onRelireLaQuestion={() => void deroulement.relireLaQuestion()}
              onJeNeSaisPas={() => void deroulement.jeNeSaisPas()}
              onEcouterLeMot={() => void deroulement.ecouterLeMot()}
              onActiverLeSon={voix.basculerLeSon}
            />
          )}
        </div>
      )}
    </>
  );
}
