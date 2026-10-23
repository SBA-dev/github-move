import { PasDeQuestionEnCours } from "./erreurs.ts";
import type { QuestionJouee } from "./question-jouee.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";

export class ExerciceJoue {
  private reussies = 0;

  constructor(
    readonly position: number,
    readonly titre: string | undefined,
    readonly questions: number,
    private readonly questionsAChoix: readonly QuestionJouee[] = [],
  ) {}

  questionEnCours(): QuestionJouee | undefined {
    return this.questionsAChoix[this.reussies];
  }

  questionsRatees(): QuestionJouee[] {
    return this.questionsAChoix.filter((question) => question.erreurs > 0);
  }

  repondre(reponse: Reponse): ResultatDeReponse {
    const question = this.questionEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    const resultat = question.repondre(reponse);
    if (resultat === "juste") this.reussies++;
    return resultat;
  }

  get questionsReussies(): number {
    return this.reussies;
  }

  get rangDeLaQuestionEnCours(): number {
    return this.reussies;
  }

  estReussi(): boolean {
    return this.reussies >= this.questions;
  }
}
