import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import { AucuneQuestionDue } from "./erreurs.ts";
import type { PlanDeSeanceDeRevision } from "./file-de-revision.ts";
import { type QuestionDeRevision, questionDeRevision } from "./question-de-revision.ts";
import type { Tireur } from "./tireur.ts";

export class SeanceDeRevision {
  private constructor(
    readonly id: string,
    readonly enfant: string,
    private readonly questions: readonly QuestionDeRevision[],
  ) {}

  static commencer(
    { id, enfant, plan, lecons, tireur, niveau }: {
      readonly id: string;
      readonly enfant: string;
      readonly plan: PlanDeSeanceDeRevision;
      readonly lecons: readonly Lecon[];
      readonly tireur: Tireur;
      readonly niveau: Niveau;
    },
  ): SeanceDeRevision {
    const questions = plan.questions.flatMap(({ identite, origine }) => {
      const lecon = lecons.find(({ id }) => id === origine.leconDOrigine);
      const posee = lecon && questionDeRevision(lecon, origine, identite, tireur, niveau);
      return posee ? [posee] : [];
    });
    if (questions.length === 0) throw new AucuneQuestionDue();
    return new SeanceDeRevision(id, enfant, questions);
  }

  questionEnCours(): QuestionDeRevision | undefined {
    return this.questions.find(({ question }) => !question?.reussie);
  }

  estFinie(): boolean {
    return this.questionEnCours() === undefined;
  }
}
