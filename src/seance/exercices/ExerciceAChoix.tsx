import type { QuestionJouee } from "@domain/apprentissage";
import type { Exercice } from "@domain/catalogue";
import { MESSAGE_DE_L_ECOUTE_SANS_SON } from "@domain/apprentissage";
import { TexteEnSyllabes } from "../../reglages/index.ts";
import { ChoixDeLaQuestion } from "./ChoixDeLaQuestion.tsx";
import { TexteDeLecture } from "./TexteDeLecture.tsx";

type Props = {
  readonly exercice: Exercice;
  readonly question: QuestionJouee | undefined;
  readonly choixVisibles: boolean;
  readonly reussie: boolean;
  readonly bulleEclatee: string | undefined;
  /** Lecture : l'enfant a dit qu'elle avait écouté le texte. */
  readonly texteEcoute: boolean;
  readonly rangDuMotDuTexte: number | undefined;
  readonly sonImpossible: boolean;
  readonly sonCoupe: boolean;
  readonly onChoisir: (texte: string) => void;
  readonly onRelireLaQuestion: () => void;
  readonly onEcouterLeMot: () => void;
  readonly onJAiEcoute: () => void;
  readonly onActiverLeSon: () => void;
};

export function ExerciceAChoix(props: Props) {
  const { exercice, question, choixVisibles, reussie, texteEcoute } = props;
  const lectureEnAttente = exercice.type === "lecture" && !texteEcoute;
  return (
    <>
      {exercice.type === "lecture" && (
        <TexteDeLecture titre={exercice.titre} texte={exercice.texte} rangDuMotPrononce={props.rangDuMotDuTexte} />
      )}
      {lectureEnAttente && (
        <button type="button" className="action-principale" data-testid="j-ai-ecoute" onClick={props.onJAiEcoute}>
          J'ai écouté
        </button>
      )}
      {question && !lectureEnAttente && (
        <button
          type="button"
          className="question"
          data-testid="question"
          onClick={props.onRelireLaQuestion}
        >
          <TexteEnSyllabes texte={question.enonce} />
        </button>
      )}
      {exercice.type === "ecoute" && (
        <div className="ecoute" data-testid="ecoute">
          <button type="button" className="action-principale" data-testid="ecouter" onClick={props.onEcouterLeMot}>
            Écouter
          </button>
          {props.sonImpossible && (
            <p className="ecoute-sans-son" role="status" data-testid="ecoute-sans-son">{MESSAGE_DE_L_ECOUTE_SANS_SON}</p>
          )}
          {props.sonImpossible && props.sonCoupe && (
            <button type="button" data-testid="activer-le-son" onClick={props.onActiverLeSon}>Activer le son</button>
          )}
        </div>
      )}
      {question && choixVisibles && (
        <ChoixDeLaQuestion
          question={question}
          reussie={reussie}
          bulleEclatee={props.bulleEclatee}
          onChoisir={props.onChoisir}
        />
      )}
    </>
  );
}
