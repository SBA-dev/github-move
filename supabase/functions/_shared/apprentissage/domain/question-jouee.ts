import type { Exercice } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { ChoixProposes } from "./choix-proposes.ts";
import { questionDeLEcoute } from "./exercices/phrases-des-exercices-a-choix.ts";
import type { Hasard } from "./hasard.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";

const ERREURS_AVANT_LA_REDUCTION_A_DEUX = 2;

export class QuestionJouee {
  private nombreDErreurs = 0;
  private estReussie = false;

  private constructor(
    readonly enonce: string,
    readonly cle: CleDeQuestion,
    private readonly bonneReponse: string,
    private choixProposes: ChoixProposes,
  ) {}

  static aChoix(
    cle: CleDeQuestion,
    enonce: string,
    choix: readonly string[],
    bonneReponse: string,
    hasard: Hasard,
  ): QuestionJouee {
    return new QuestionJouee(enonce, cle, bonneReponse, ChoixProposes.proposer(choix, bonneReponse, hasard));
  }

  get choix(): ChoixProposes {
    return this.choixProposes;
  }

  get erreurs(): number {
    return this.nombreDErreurs;
  }

  get reussie(): boolean {
    return this.estReussie;
  }

  repondre(reponse: Reponse): ResultatDeReponse {
    if (this.choixProposes.ecartes().includes(reponse.texte)) return "dejaEcartee";
    if (reponse.texte === this.bonneReponse) {
      this.reussir();
      return "juste";
    }
    this.nombreDErreurs++;
    this.choixProposes = this.choixProposes.ecarter(reponse.texte);
    if (this.nombreDErreurs === ERREURS_AVANT_LA_REDUCTION_A_DEUX) {
      this.choixProposes = this.choixProposes.reduireADeux();
    }
    return "fausse";
  }

  reussir(): void {
    this.estReussie = true;
  }
}

export function questionsJoueesDe(exercice: Exercice, hasard: Hasard): QuestionJouee[] {
  switch (exercice.type) {
    case "bulles":
      return exercice.questions.map((q) =>
        QuestionJouee.aChoix(CleDeQuestion.de("bulles", q.question + q.reponse), q.question, q.choix, q.reponse, hasard)
      );
    case "lecture":
      return exercice.questions.map((q) =>
        QuestionJouee.aChoix(
          CleDeQuestion.de("lecture", q.question + q.reponse),
          q.question,
          q.choix,
          q.reponse,
          hasard,
        )
      );
    case "ecoute":
      return exercice.items.map((item) =>
        QuestionJouee.aChoix(
          CleDeQuestion.de("ecoute", item.dire),
          questionDeLEcoute(item),
          item.choix,
          item.reponse,
          hasard,
        )
      );
    default:
      return [];
  }
}
