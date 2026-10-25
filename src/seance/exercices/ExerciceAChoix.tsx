import type { LigneDuTableauDeConjugaison, QuestionJouee, SegmentDuTexteATrous } from "@domain/apprentissage";
import type { Exercice } from "@domain/catalogue";
import { QuestionAChoix } from "./QuestionAChoix.tsx";
import { TableauDeConjugaison } from "./TableauDeConjugaison.tsx";
import { TexteATrous } from "./TexteATrous.tsx";
import { TexteDeLecture } from "./TexteDeLecture.tsx";

type Props = {
  readonly exercice: Exercice;
  readonly question: QuestionJouee | undefined;
  /** Texte à trous : le texte entier, ses trous remplis au fil des bonnes réponses. */
  readonly texteATrous: readonly SegmentDuTexteATrous[];
  readonly phraseDuTrouEnCours: string | undefined;
  /** Conjugaison : une ligne par personne, la forme écrite quand elle est trouvée. */
  readonly tableauDeConjugaison: readonly LigneDuTableauDeConjugaison[];
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
  readonly onJeNeSaisPas: () => void;
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
      {exercice.type === "trous" && (
        <TexteATrous segments={props.texteATrous} phraseDuTrouEnCours={props.phraseDuTrouEnCours} />
      )}
      {exercice.type === "conjugaison" && (
        <TableauDeConjugaison verbe={exercice.verbe} temps={exercice.temps} lignes={props.tableauDeConjugaison} />
      )}
      {lectureEnAttente && (
        <button type="button" className="action-principale" data-testid="j-ai-ecoute" onClick={props.onJAiEcoute}>
          J'ai écouté
        </button>
      )}
      <QuestionAChoix
        question={question}
        avecEcoute={exercice.type === "ecoute"}
        questionMasquee={lectureEnAttente}
        choixVisibles={choixVisibles}
        reussie={reussie}
        bulleEclatee={props.bulleEclatee}
        sonImpossible={props.sonImpossible}
        sonCoupe={props.sonCoupe}
        onChoisir={props.onChoisir}
        onRelireLaQuestion={props.onRelireLaQuestion}
        onJeNeSaisPas={props.onJeNeSaisPas}
        onEcouterLeMot={props.onEcouterLeMot}
        onActiverLeSon={props.onActiverLeSon}
      />
    </>
  );
}
