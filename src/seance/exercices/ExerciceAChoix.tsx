import { useState } from "react";
import type { LigneDuTableauDeConjugaison, QuestionJouee, SegmentDuTexteATrous } from "@domain/apprentissage";
import type { Exercice } from "@domain/catalogue";
import type { DepartDuMot } from "./mot-qui-voyage/useMotQuiVoyage.tsx";
import type { LectureDuTexte } from "../parchemin/LectureDuTexte.ts";
import { ActionDeLExercice } from "./ActionDeLExercice.tsx";
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
  readonly lectureDuTexte: LectureDuTexte;
  /** Muet, voix bloquée ou absente : le texte est lu par l'enfant seul. */
  readonly voixCoupee: boolean;
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
  const [motChoisi, setMotChoisi] = useState<DepartDuMot | undefined>();
  const choisir = (texte: string, bulle: HTMLElement) => {
    const { left, top, width, height } = bulle.getBoundingClientRect();
    setMotChoisi({ texte, centre: { x: left + width / 2, y: top + height / 2 } });
    props.onChoisir(texte);
  };
  return (
    <>
      {exercice.type === "lecture" && (
        <TexteDeLecture
          key={exercice.texte}
          titre={exercice.titre}
          texte={exercice.texte}
          rangDuMotPrononce={props.rangDuMotDuTexte}
          lecture={props.lectureDuTexte}
          texteEcoute={texteEcoute}
          voixCoupee={props.voixCoupee}
        />
      )}
      {exercice.type === "trous" && (
        <TexteATrous segments={props.texteATrous} phraseDuTrouEnCours={props.phraseDuTrouEnCours} motChoisi={motChoisi} />
      )}
      {exercice.type === "conjugaison" && (
        <TableauDeConjugaison verbe={exercice.verbe} temps={exercice.temps} lignes={props.tableauDeConjugaison} motChoisi={motChoisi} />
      )}
      {lectureEnAttente && (
        <ActionDeLExercice>
          <button type="button" className="action-principale" data-testid="j-ai-ecoute" onClick={props.onJAiEcoute}>
            J'ai écouté
          </button>
        </ActionDeLExercice>
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
        onChoisir={choisir}
        onRelireLaQuestion={props.onRelireLaQuestion}
        onJeNeSaisPas={props.onJeNeSaisPas}
        onEcouterLeMot={props.onEcouterLeMot}
        onActiverLeSon={props.onActiverLeSon}
      />
    </>
  );
}
