import type { CleDeQuestion } from "./cle-de-question.ts";
import { IntervalleDeRevision } from "./intervalle-de-revision.ts";
import type { Jour } from "./jour.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";

export type QuestionRateeARetenir = {
  readonly identite: CleDeQuestion;
  readonly origine: OrigineDeLaQuestion;
};

export type QuestionRetenue = Readonly<{
  identite: CleDeQuestion;
  origine: OrigineDeLaQuestion;
  intervalle: IntervalleDeRevision;
  dateDeRevision: Jour;
  derniereErreurLe: Date;
  nombreDeFoisRatee: number;
}>;

export class FileDeRevision {
  private readonly questionsRetenues: QuestionRetenue[] = [];

  private constructor(readonly enfant: string) {}

  static vide(enfant: string): FileDeRevision {
    return new FileDeRevision(enfant);
  }

  get questions(): readonly QuestionRetenue[] {
    return this.questionsRetenues;
  }

  retenir(questions: readonly QuestionRateeARetenir[], jour: Jour, termineeLe: Date): void {
    for (const { identite, origine } of questions) {
      this.questionsRetenues.push({
        identite,
        origine,
        intervalle: IntervalleDeRevision.premier(),
        dateDeRevision: jour.plus(1),
        derniereErreurLe: termineeLe,
        nombreDeFoisRatee: 1,
      });
    }
  }
}
