import type { QuestionJouee } from "@domain/apprentissage";
import { MESSAGE_DE_L_ECOUTE_SANS_SON } from "@domain/apprentissage";
import { TexteEnSyllabes } from "../../reglages/index.ts";
import { ChoixDeLaQuestion } from "./ChoixDeLaQuestion.tsx";

type Props = {
  readonly question: QuestionJouee | undefined;
  /** Écoute : un bouton « Écouter » redit le mot de la question. */
  readonly avecEcoute: boolean;
  /** Lecture : la question reste cachée tant que l'enfant n'a pas dit qu'il avait écouté le texte. */
  readonly questionMasquee: boolean;
  readonly choixVisibles: boolean;
  readonly reussie: boolean;
  readonly bulleEclatee: string | undefined;
  readonly sonImpossible: boolean;
  readonly sonCoupe: boolean;
  readonly onChoisir: (texte: string) => void;
  readonly onRelireLaQuestion: () => void;
  readonly onJeNeSaisPas: () => void;
  readonly onEcouterLeMot: () => void;
  readonly onActiverLeSon: () => void;
};

/** Une question à choix : l'énoncé (qui se relit en le touchant), le mot à écouter, les bulles de choix et « Je ne sais pas ». */
export function QuestionAChoix(props: Props) {
  const { question, avecEcoute, questionMasquee, choixVisibles, reussie } = props;
  return (
    <>
      {question && !questionMasquee && (
        <button
          type="button"
          className="question"
          data-testid="question"
          onClick={props.onRelireLaQuestion}
        >
          <TexteEnSyllabes texte={question.enonce} />
        </button>
      )}
      {avecEcoute && (
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
      <p className="visuellement-cache" role="status" data-testid="bonne-reponse-annoncee">
        {question?.bonneReponseMontree && !reussie ? `La bonne réponse est « ${question.choix.possibles()[0]} ».` : ""}
      </p>
      {question && choixVisibles && (
        <>
          <ChoixDeLaQuestion
            textes={question.choix.textes()}
            ecartes={question.choix.ecartes()}
            possibles={question.choix.possibles()}
            reponseQuiBrille={question.bonneReponseMontree ? question.choix.possibles()[0] : undefined}
            reussie={reussie}
            bulleEclatee={props.bulleEclatee}
            onChoisir={props.onChoisir}
          />
          {question.jeNeSaisPasPermis() && !question.bonneReponseMontree && !reussie && (
            <button type="button" className="je-ne-sais-pas" data-testid="je-ne-sais-pas" onClick={props.onJeNeSaisPas}>
              Je ne sais pas
            </button>
          )}
        </>
      )}
    </>
  );
}
