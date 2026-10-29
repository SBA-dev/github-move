import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { DefiTermineAEnregistrer } from "./defi-termine-a-enregistrer.ts";
import type { Defi } from "./defis-de-la-matiere.ts";
import { DefiDejaTermine, DefiNonFini } from "./erreurs.ts";
import type { QuestionRateeARetenir } from "./file-de-revision.ts";
import type { Jour } from "./jour.ts";
import type { PlanDuDefi } from "./plan-du-defi.ts";
import { type QuestionDeRevision, questionDeRevision } from "./question-de-revision.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import { QuestionsEnCours, suivie } from "./questions-en-cours.ts";
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
  private termine: { termineeLe: Date; jour: Jour } | undefined;
  private readonly enCours: QuestionsEnCours;

  private constructor(
    readonly id: string,
    readonly enfant: string,
    private readonly defi: Defi,
    private readonly questions: readonly { posee: QuestionDeRevision; ratable: QuestionRateeARetenir }[],
  ) {
    this.enCours = new QuestionsEnCours(questions.map(({ posee }) => posee));
  }

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
    return this.enCours.enCours();
  }

  repondre(reponse: ReponseParChoix | ReponseEnNombre | MotEcrit): ResultatDeReponse {
    return this.enCours.repondre(reponse);
  }

  direJeNeSaisPas(): AideDonnee {
    return this.enCours.direJeNeSaisPas();
  }

  estFinie(): boolean {
    return this.enCours.estFinie();
  }

  terminer(maintenant: Date, jour: Jour): DefiTermine {
    if (this.termine) throw new DefiDejaTermine();
    if (!this.estFinie()) throw new DefiNonFini();
    this.termine = { termineeLe: maintenant, jour };
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

  aEnregistrer(): DefiTermineAEnregistrer {
    if (!this.termine) throw new DefiNonFini();
    const { matiere, niveau, numero } = this.defi;
    return {
      id: this.id,
      enfant: this.enfant,
      defi: { matiere, niveau, numero },
      questions: this.questions.map(({ ratable }) => ratable.identite),
      tirages: this.questions.map(({ posee }) => suivie(posee).tirage()),
      reponses: this.questions.map(({ posee }) => suivie(posee).reponses()),
      termineeLe: this.termine.termineeLe,
      jour: this.termine.jour.toString(),
    };
  }
}

function estRatee({ erreurs, bonneReponseMontree }: QuestionSuivie): boolean {
  return erreurs > 0 || bonneReponseMontree;
}
