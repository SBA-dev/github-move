import type { AideDonnee } from "./question-jouee.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";

/** Une question que l'enfant se voit poser une à une, à choix ou au clavier de cristaux. */
export interface QuestionPosee extends QuestionSuivie {
  readonly enonce: string;
  /** Les choix tirés pour la question, dans leur ordre initial ; vide quand elle se joue au clavier. */
  tirage(): string[];
  aideApresErreur(): string | undefined;
  repondre(reponse: ReponseParChoix | ReponseEnNombre): ResultatDeReponse;
  direJeNeSaisPas(): AideDonnee;
}
