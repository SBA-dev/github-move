import type {
  AideDonnee,
  QuestionDeRevision,
  ResultatDeReponse,
  SeanceDeRevision,
} from "@domain/apprentissage";

/** Ce que le déroulement attend d'une séance de questions : la séance de révision et celle du défi se jouent de la même façon. */
export interface SeanceDeQuestions {
  questionEnCours(): QuestionDeRevision | undefined;
  repondre(reponse: Parameters<SeanceDeRevision["repondre"]>[0]): ResultatDeReponse;
  direJeNeSaisPas(): AideDonnee;
  estFinie(): boolean;
}
