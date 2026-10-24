import { TestDeDepartDejaFini } from "./erreurs.ts";
import type { GenerateurId } from "./generateur-id.ts";
import type { AideDonnee, QuestionJouee } from "./question-jouee.ts";
import type { ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import { TestDeDepartId } from "./test-de-depart-id.ts";

const QUESTIONS_FAUSSES_DE_SUITE_POUR_ARRETER = 3;

export class TestDeDepart {
  private rang = 0;
  private questionsFaussesDeSuite = 0;

  private constructor(
    readonly id: TestDeDepartId,
    readonly enfant: string,
    private readonly questions: readonly QuestionJouee[],
  ) {}

  static commencer(
    { generateurId, enfant, questions }: {
      readonly generateurId: GenerateurId;
      readonly enfant: string;
      readonly questions: readonly QuestionJouee[];
    },
  ): TestDeDepart {
    return new TestDeDepart(TestDeDepartId.de(generateurId.nouveau()), enfant, questions);
  }

  questionEnCours(): QuestionJouee | undefined {
    if (this.estArrete()) return undefined;
    return this.questions[this.rang];
  }

  repondre(reponse: ReponseParChoix): ResultatDeReponse {
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

  private questionAPoser(): QuestionJouee {
    const question = this.questionEnCours();
    if (!question) throw new TestDeDepartDejaFini();
    return question;
  }

  private passerALaSuivanteSiReussie(question: QuestionJouee): void {
    if (!question.reussie) return;
    this.rang++;
    this.questionsFaussesDeSuite = question.erreurs > 0 ? this.questionsFaussesDeSuite + 1 : 0;
  }
}
