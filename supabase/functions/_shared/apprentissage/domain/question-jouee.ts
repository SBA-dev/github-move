import type { Exercice } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { ChoixProposes } from "./choix-proposes.ts";
import {
  complementDeLEncouragement,
  explicationDeLaReponse,
  questionDeLEcoute,
} from "./exercices/phrases-des-exercices-a-choix.ts";
import { ChoixInconnu, QuestionDejaReussie } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";

const ERREURS_AVANT_LA_REDUCTION_A_DEUX = 2;

type TypeDeQuestion = "bulles" | "lecture" | "ecoute";

type Complements = { readonly aide?: string; readonly motAEcouter?: string; readonly langue?: string };

export class QuestionJouee {
  private nombreDErreurs = 0;
  private estReussie = false;

  private constructor(
    readonly enonce: string,
    readonly cle: CleDeQuestion,
    private readonly bonneReponse: string,
    private choixProposes: ChoixProposes,
    private readonly type: TypeDeQuestion,
    private readonly complements: Complements,
  ) {}

  static aChoix(
    cle: CleDeQuestion,
    enonce: string,
    choix: readonly string[],
    bonneReponse: string,
    hasard: Hasard,
    type: TypeDeQuestion,
    complements: Complements = {},
  ): QuestionJouee {
    return new QuestionJouee(
      enonce,
      cle,
      bonneReponse,
      ChoixProposes.proposer(choix, bonneReponse, hasard),
      type,
      complements,
    );
  }

  get motAEcouter(): string | undefined {
    return this.complements.motAEcouter;
  }

  get langue(): string | undefined {
    return this.complements.langue;
  }

  get aide(): string | undefined {
    return this.complements.aide;
  }

  explication(): string | undefined {
    return explicationDeLaReponse(this.type, { dire: this.motAEcouter, reponse: this.bonneReponse });
  }

  complementDeLEncouragement(): string {
    return complementDeLEncouragement(this.type, { aide: this.aide });
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
    if (this.estReussie) throw new QuestionDejaReussie();
    if (!this.choixProposes.textes().includes(reponse.texte)) throw new ChoixInconnu(reponse.texte);
    if (this.choixProposes.ecartes().includes(reponse.texte)) return "dejaEcartee";
    if (reponse.texte === this.bonneReponse) {
      this.estReussie = true;
      return "juste";
    }
    this.nombreDErreurs++;
    this.choixProposes = this.choixProposes.ecarter(reponse.texte);
    if (this.nombreDErreurs === ERREURS_AVANT_LA_REDUCTION_A_DEUX) {
      this.choixProposes = this.choixProposes.reduireADeux();
    }
    return "fausse";
  }
}

export function questionsJoueesDe(exercice: Exercice, hasard: Hasard): QuestionJouee[] {
  switch (exercice.type) {
    case "bulles":
      return exercice.questions.map((q) =>
        QuestionJouee.aChoix(
          CleDeQuestion.de("bulles", q.question + q.reponse),
          q.question,
          q.choix,
          q.reponse,
          hasard,
          "bulles",
          {
            aide: q.aide,
          },
        )
      );
    case "lecture":
      return exercice.questions.map((q) =>
        QuestionJouee.aChoix(
          CleDeQuestion.de("lecture", q.question + q.reponse),
          q.question,
          q.choix,
          q.reponse,
          hasard,
          "lecture",
          { aide: q.aide },
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
          "ecoute",
          { aide: item.aide, motAEcouter: item.dire, langue: exercice.langue },
        )
      );
    default:
      return [];
  }
}
