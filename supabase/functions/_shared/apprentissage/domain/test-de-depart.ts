import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import { LeconIntrouvable, TestDeDepartDejaFini, TestDeDepartNonFini } from "./erreurs.ts";
import type { GenerateurId } from "./generateur-id.ts";
import type { PlanDuTestDeDepart } from "./plan-du-test-de-depart.ts";
import type { AideDonnee } from "./question-jouee.ts";
import { questionDuTestDeDepart } from "./question-du-test-de-depart.ts";
import type { QuestionPosee } from "./question-posee.ts";
import type { ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import type { TestDeDepartTermineAEnregistrer } from "./test-de-depart-termine-a-enregistrer.ts";
import { TestDeDepartId } from "./test-de-depart-id.ts";
import type { Tireur } from "./tireur.ts";
import { enonceDUneAddition } from "./tirage-d-additions.ts";
import { enonceTire } from "./tirage-d-operations.ts";

const QUESTIONS_FAUSSES_DE_SUITE_POUR_ARRETER = 3;

export type TestDeDepartTermine = Readonly<{
  type: "TestDeDepartTermine";
  test: string;
  enfant: string;
  termineeLe: Date;
  questions: readonly Readonly<{ lecon: string; juste: boolean }>[];
  arrete: boolean;
}>;

export class TestDeDepart {
  private rang = 0;
  private questionsFaussesDeSuite = 0;
  private termineeLe: Date | undefined;

  private constructor(
    readonly id: TestDeDepartId,
    readonly enfant: string,
    private readonly plan: PlanDuTestDeDepart,
    private readonly questions: readonly QuestionPosee[],
    private readonly tirages: readonly (readonly (readonly string[])[])[],
  ) {}

  static commencer(
    { generateurId, enfant, niveau, lecons, plan, tireur }: {
      readonly generateurId: GenerateurId;
      readonly enfant: string;
      readonly niveau: Niveau;
      readonly lecons: readonly Lecon[];
      readonly plan: PlanDuTestDeDepart;
      readonly tireur: Tireur;
    },
  ): TestDeDepart {
    const tirages: string[][][] = [];
    const questions = plan.map((prevue) => {
      const tiragesDeLaQuestion: string[][] = [];
      tirages.push(tiragesDeLaQuestion);
      const lecon = lecons.find(({ id }) => id === prevue.leconId);
      if (lecon === undefined) throw new LeconIntrouvable(prevue.leconId);
      const question = questionDuTestDeDepart(lecon, prevue, tireurQuiNote(tireur, tiragesDeLaQuestion), niveau);
      if (question.tirage().length > 0) tiragesDeLaQuestion.push(question.tirage());
      return question;
    });
    return new TestDeDepart(TestDeDepartId.de(generateurId.nouveau()), enfant, plan, questions, tirages);
  }

  questionEnCours(): QuestionPosee | undefined {
    if (this.estArrete()) return undefined;
    return this.questions[this.rang];
  }

  repondre(reponse: ReponseParChoix | ReponseEnNombre): ResultatDeReponse {
    const question = this.questionAPoser();
    const resultat = question.repondre(reponse);
    this.passerALaSuivanteSiReussie(question);
    return resultat;
  }

  direJeNeSaisPas(): AideDonnee {
    return this.questionAPoser().direJeNeSaisPas();
  }

  estArrete(): boolean {
    return this.questionsFaussesDeSuite >= QUESTIONS_FAUSSES_DE_SUITE_POUR_ARRETER;
  }

  estFini(): boolean {
    return this.estArrete() || this.rang >= this.questions.length;
  }

  terminer(maintenant: Date): TestDeDepartTermine {
    if (!this.estFini()) throw new TestDeDepartNonFini();
    this.termineeLe = maintenant;
    return {
      type: "TestDeDepartTermine",
      test: this.id.valeur,
      enfant: this.enfant,
      termineeLe: maintenant,
      questions: this.plan.slice(0, this.rang).flatMap(({ leconId }, rang) =>
        this.questions.slice(rang, rang + 1).map((question) => ({ lecon: leconId, juste: question.erreurs === 0 }))
      ),
      arrete: this.estArrete(),
    };
  }

  aEnregistrer(): TestDeDepartTermineAEnregistrer {
    if (!this.termineeLe) throw new TestDeDepartNonFini();
    return {
      test: this.id.valeur,
      enfant: this.enfant,
      questions: this.plan,
      tirages: this.tirages,
      reponses: this.questionsPosees().map((question) => question.reponses()),
      termineeLe: this.termineeLe,
    };
  }

  private questionsPosees(): QuestionPosee[] {
    return this.questions.slice(0, this.rang);
  }

  private questionAPoser(): QuestionPosee {
    const question = this.questionEnCours();
    if (!question) throw new TestDeDepartDejaFini();
    return question;
  }

  private passerALaSuivanteSiReussie(question: QuestionPosee): void {
    if (!question.reussie) return;
    this.rang++;
    this.questionsFaussesDeSuite = question.erreurs > 0 ? this.questionsFaussesDeSuite + 1 : 0;
  }
}

/** Les opérations et additions tirées par un générateur sont notées dans l'ordre où le tireur les rend. */
function tireurQuiNote(tireur: Tireur, tirages: string[][]): Tireur {
  return {
    ...tireur,
    operations: (generateur) => {
      const operations = tireur.operations(generateur);
      tirages.push(operations.map(enonceTire));
      return operations;
    },
    additions: (generateur) => {
      const additions = tireur.additions(generateur);
      tirages.push(additions.map(enonceDUneAddition));
      return additions;
    },
  };
}
