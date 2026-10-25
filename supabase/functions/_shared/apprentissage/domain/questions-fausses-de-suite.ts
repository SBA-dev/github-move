const QUESTIONS_FAUSSES_DE_SUITE_POUR_ARRETER = 3;

/** La règle d'arrêt du test de départ : trois questions fausses de suite. */
export class QuestionsFaussesDeSuite {
  private constructor(private readonly nombre: number) {}

  static aucune(): QuestionsFaussesDeSuite {
    return new QuestionsFaussesDeSuite(0);
  }

  apres(juste: boolean): QuestionsFaussesDeSuite {
    return new QuestionsFaussesDeSuite(juste ? 0 : this.nombre + 1);
  }

  arreteLeTest(): boolean {
    return this.nombre >= QUESTIONS_FAUSSES_DE_SUITE_POUR_ARRETER;
  }
}
