import type { Exercice } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { ChoixProposes } from "./choix-proposes.ts";
import {
  complementDeLEncouragement,
  type ExplicationDeLaReponse,
  explicationDeLaReponse,
  questionDeLEcoute,
  type TypeDExerciceAChoix,
} from "./exercices/phrases-des-exercices-a-choix.ts";
import { ChoixInconnu, QuestionDejaReussie } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";

const ERREURS_AVANT_LA_REDUCTION_A_DEUX = 2;

type Complements = { readonly aide?: string; readonly motAEcouter?: string; readonly langue?: string };

export class QuestionJouee {
  private nombreDErreurs = 0;
  private estReussie = false;

  private constructor(
    readonly enonce: string,
    readonly cle: CleDeQuestion,
    private readonly bonneReponse: string,
    private choixProposes: ChoixProposes,
    private readonly type: TypeDExerciceAChoix,
    private readonly complements: Complements,
  ) {}

  static aChoix(
    { cle, enonce, choix, bonneReponse, hasard, type, complements = {} }: {
      readonly cle: CleDeQuestion;
      readonly enonce: string;
      readonly choix: readonly string[];
      readonly bonneReponse: string;
      readonly hasard: Hasard;
      readonly type: TypeDExerciceAChoix;
      readonly complements?: Complements;
    },
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

  explication(): ExplicationDeLaReponse | undefined {
    return explicationDeLaReponse(this.type, {
      dire: this.motAEcouter,
      reponse: this.bonneReponse,
      langue: this.langue,
    });
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
    case "lecture": {
      const type = exercice.type;
      return exercice.questions.map((q) =>
        QuestionJouee.aChoix({
          cle: CleDeQuestion.de(type, q.question + q.reponse),
          enonce: q.question,
          choix: q.choix,
          bonneReponse: q.reponse,
          hasard,
          type,
          complements: { aide: q.aide },
        })
      );
    }
    case "ecoute":
      return exercice.items.map((item) =>
        QuestionJouee.aChoix({
          cle: CleDeQuestion.de("ecoute", item.dire),
          enonce: questionDeLEcoute(item),
          choix: item.choix,
          bonneReponse: item.reponse,
          hasard,
          type: "ecoute",
          complements: { aide: item.aide, motAEcouter: item.dire, langue: exercice.langue },
        })
      );
    default:
      return [];
  }
}
