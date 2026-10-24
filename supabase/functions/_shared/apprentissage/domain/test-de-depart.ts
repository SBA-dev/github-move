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
    const questions = plan.map((prevue) => {
      const lecon = lecons.find(({ id }) => id === prevue.leconId);
      if (lecon === undefined) throw new LeconIntrouvable(prevue.leconId);
      return questionDuTestDeDepart(lecon, prevue, tireur, niveau);
    });
    return new TestDeDepart(TestDeDepartId.de(generateurId.nouveau()), enfant, plan, questions);
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
      questions: this.questionsPosees().map((question, rang) => ({
        lecon: this.plan[rang].leconId,
        juste: question.erreurs === 0,
      })),
      arrete: this.estArrete(),
    };
  }

  aEnregistrer(): TestDeDepartTermineAEnregistrer {
    if (!this.termineeLe) throw new TestDeDepartNonFini();
    return {
      test: this.id.valeur,
      enfant: this.enfant,
      questions: this.plan,
      tirages: this.questions.map((question) => question.tirage()).filter((tirage) => tirage.length > 0),
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
