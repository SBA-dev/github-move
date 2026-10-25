import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import {
  AucuneQuestionDue,
  ReponseIncompatible,
  SeanceDeRevisionDejaFinie,
  SeanceDeRevisionDejaTerminee,
  SeanceDeRevisionNonFinie,
} from "./erreurs.ts";
import type { PlanDeSeanceDeRevision, ResultatDeRevision } from "./file-de-revision.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { Jour } from "./jour.ts";
import type { AideDonnee } from "./question-jouee.ts";
import { type QuestionDeRevision, questionDeRevision } from "./question-de-revision.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { MotEcrit, ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "./seance-de-revision-terminee-a-enregistrer.ts";
import type { Tireur } from "./tireur.ts";

export type SeanceDeRevisionTerminee = Readonly<{
  type: "SeanceDeRevisionTerminee";
  id: string;
  enfant: string;
  termineeLe: Date;
  jour: Jour;
  resultats: readonly ResultatDeRevision[];
  nombreDeQuestions: number;
  nombreDeQuestionsJustes: number;
}>;

export class SeanceDeRevision {
  private termineeLe: Date | undefined;
  private jour: Jour | undefined;

  private constructor(
    readonly id: string,
    readonly enfant: string,
    private readonly questions: readonly QuestionDeRevision[],
  ) {}

  static commencer(
    { id, enfant, plan, lecons, tireurDe, niveau }: {
      readonly id: string;
      readonly enfant: string;
      readonly plan: PlanDeSeanceDeRevision;
      readonly lecons: readonly Lecon[];
      readonly tireurDe: (identite: CleDeQuestion) => Tireur;
      readonly niveau: Niveau;
    },
  ): SeanceDeRevision {
    const questions = plan.questions.flatMap(({ identite, origine }) => {
      const lecon = lecons.find(({ id }) => id === origine.leconDOrigine);
      const posee = lecon && questionDeRevision(lecon, origine, identite, tireurDe(identite), niveau);
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

  terminer(maintenant: Date, jour: Jour): SeanceDeRevisionTerminee {
    if (this.termineeLe) throw new SeanceDeRevisionDejaTerminee();
    if (!this.estFinie()) throw new SeanceDeRevisionNonFinie();
    this.termineeLe = maintenant;
    this.jour = jour;
    const resultats = this.resultats();
    return {
      type: "SeanceDeRevisionTerminee",
      id: this.id,
      enfant: this.enfant,
      termineeLe: maintenant,
      jour,
      resultats,
      nombreDeQuestions: resultats.length,
      nombreDeQuestionsJustes: resultats.filter(({ juste }) => juste).length,
    };
  }

  aEnregistrer(): SeanceDeRevisionTermineeAEnregistrer {
    if (!this.termineeLe || !this.jour) throw new SeanceDeRevisionNonFinie();
    return {
      id: this.id,
      enfant: this.enfant,
      questions: this.questions.map(({ identite }): CleDeQuestion => identite),
      tirages: this.questions.map((posee) => suivie(posee).tirage()),
      reponses: this.questions.map((posee) => suivie(posee).reponses()),
      termineeLe: this.termineeLe,
      jour: this.jour.toString(),
    };
  }

  private questionAPoser(): QuestionDeRevision {
    const enCours = this.questionEnCours();
    if (!enCours) throw new SeanceDeRevisionDejaFinie();
    return enCours;
  }
}

function suivie(
  { question, dictee }: QuestionDeRevision,
): QuestionSuivie & { direJeNeSaisPas(): AideDonnee; tirage(): string[] } {
  return question ?? dictee;
}
