import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { Defi } from "./defis-de-la-matiere.ts";
import { DefiDejaTermine, DefiNonFini, ReponseIncompatible, SeanceDeRevisionDejaFinie } from "./erreurs.ts";
import type { QuestionRateeARetenir } from "./file-de-revision.ts";
import type { Jour } from "./jour.ts";
import type { PlanDuDefi } from "./plan-du-defi.ts";
import { type QuestionDeRevision, questionDeRevision } from "./question-de-revision.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { MotEcrit, ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import type { Tireur } from "./tireur.ts";

export type DefiTermine = Readonly<{
  type: "DefiTermine";
  id: string;
  enfant: string;
  defi: Defi;
  nombreDeQuestions: number;
  questionsRatees: readonly QuestionRateeARetenir[];
  termineeLe: Date;
  jour: Jour;
}>;

export class SeanceDeDefi {
  private termine = false;

  private constructor(
    readonly id: string,
    readonly enfant: string,
    private readonly defi: Defi,
    private readonly questions: readonly { posee: QuestionDeRevision; ratable: QuestionRateeARetenir }[],
  ) {}

  static commencer(
    { id, enfant, defi, plan, lecons, tireurDe, niveau }: {
      readonly id: string;
      readonly enfant: string;
      readonly defi: Defi;
      readonly plan: PlanDuDefi;
      readonly lecons: readonly Lecon[];
      readonly tireurDe: (identite: CleDeQuestion) => Tireur;
      readonly niveau: Niveau;
    },
  ): SeanceDeDefi {
    const questions = plan.questions.flatMap((prevue) => {
      const lecon = lecons.find(({ id }) => id === prevue.origine.leconDOrigine);
      const posee = lecon &&
        questionDeRevision(lecon, prevue.origine, prevue.identite, tireurDe(prevue.identite), niveau);
      return posee ? [{ posee, ratable: prevue }] : [];
    });
    return new SeanceDeDefi(id, enfant, defi, questions);
  }

  questionEnCours(): QuestionDeRevision | undefined {
    return this.questions.map(({ posee }) => posee).find((posee) => !suivie(posee).reussie);
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

  terminer(maintenant: Date, jour: Jour): DefiTermine {
    if (this.termine) throw new DefiDejaTermine();
    if (!this.estFinie()) throw new DefiNonFini();
    this.termine = true;
    return {
      type: "DefiTermine",
      id: this.id,
      enfant: this.enfant,
      defi: this.defi,
      nombreDeQuestions: this.questions.length,
      questionsRatees: this.questions
        .filter(({ posee }) => estRatee(suivie(posee)))
        .map(({ ratable: { identite, origine } }) => ({ identite, origine })),
      termineeLe: maintenant,
      jour,
    };
  }

  private questionAPoser(): QuestionDeRevision {
    const enCours = this.questionEnCours();
    if (!enCours) throw new SeanceDeRevisionDejaFinie();
    return enCours;
  }
}

function estRatee({ erreurs, bonneReponseMontree }: QuestionSuivie): boolean {
  return erreurs > 0 || bonneReponseMontree;
}

function suivie(
  { question, dictee }: QuestionDeRevision,
): QuestionSuivie & { direJeNeSaisPas(): AideDonnee; tirage(): string[] } {
  return question ?? dictee;
}
