import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import { AucuneQuestionDue, ReponseIncompatible, SeanceDejaFinie } from "./erreurs.ts";
import type { PlanDeSeanceDeRevision, ResultatDeRevision } from "./file-de-revision.ts";
import type { AideDonnee } from "./question-jouee.ts";
import { type QuestionDeRevision, questionDeRevision } from "./question-de-revision.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { MotEcrit, ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
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
    return this.questions.find((posee) => !suivie(posee).reussie);
  }

  repondre(reponse: ReponseParChoix | ReponseEnNombre | MotEcrit): ResultatDeReponse {
    const { question, dictee } = this.questionAPoser();
    if (dictee) {
      if (reponse.genre !== "motEcrit") throw new ReponseIncompatible(reponse.genre);
      return dictee.repondre(reponse);
    }
    if (reponse.genre === "motEcrit") throw new ReponseIncompatible(reponse.genre);
    return question.repondre(reponse);
  }

  direJeNeSaisPas(): AideDonnee {
    return suivie(this.questionAPoser()).direJeNeSaisPas();
  }

  estFinie(): boolean {
    return this.questionEnCours() === undefined;
  }

  resultats(): ResultatDeRevision[] {
    return this.questions.map((posee) => ({ identite: posee.identite, juste: suivie(posee).erreurs === 0 }));
  }

  private questionAPoser(): QuestionDeRevision {
    const enCours = this.questionEnCours();
    if (!enCours) throw new SeanceDejaFinie();
    return enCours;
  }
}

function suivie({ question, dictee }: QuestionDeRevision): QuestionSuivie & { direJeNeSaisPas(): AideDonnee } {
  return question ?? dictee;
}
