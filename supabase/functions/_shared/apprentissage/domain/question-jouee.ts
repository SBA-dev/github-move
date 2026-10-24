import type { Exercice } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import type { ChoixProposes } from "./choix-proposes.ts";
import {
  aideParDefaut,
  type ExplicationDeLaReponse,
  explicationDeLaReponse,
  questionDeLEcoute,
  type TypeDExerciceAChoix,
} from "./exercices/phrases-des-exercices-a-choix.ts";
import { ChoixInconnu, JeNeSaisPasDejaDit, QuestionDejaReussie } from "./erreurs.ts";
import { questionsDeConjugaison } from "./exercices/conjugaison.ts";
import { questionsDeTrous } from "./exercices/trous.ts";
import type { Hasard } from "./hasard.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { ReponseDonnee, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import { type Tireur, tireurAuHasard } from "./tireur.ts";

const ERREURS_AVANT_LA_REDUCTION_A_DEUX = 2;

export type AideDonnee = {
  readonly aide: string | undefined;
  readonly bonneReponse: string;
  readonly maniere: "briller" | "ecrire";
};

type Complements = { readonly aide?: string; readonly motAEcouter?: string; readonly langue?: string };

export class QuestionJouee implements QuestionSuivie {
  private nombreDErreurs = 0;
  private estReussie = false;
  private jeNeSaisPasDejaDit = false;
  private readonly ordreInitialDesChoix: string[];
  private readonly reponsesDonnees: ReponseDonnee[] = [];

  private constructor(
    readonly enonce: string,
    readonly cle: CleDeQuestion,
    private readonly bonneReponse: string,
    private choixProposes: ChoixProposes,
    readonly type: TypeDExerciceAChoix,
    private readonly complements: Complements,
  ) {
    this.ordreInitialDesChoix = choixProposes.textes();
  }

  static aChoix(
    { cle, enonce, choix, bonneReponse, type, complements = {} }: {
      readonly cle: CleDeQuestion;
      readonly enonce: string;
      readonly choix: ChoixProposes;
      readonly bonneReponse: string;
      readonly type: TypeDExerciceAChoix;
      readonly complements?: Complements;
    },
  ): QuestionJouee {
    return new QuestionJouee(
      enonce,
      cle,
      bonneReponse,
      choix,
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

  aideApresErreur(): string {
    return this.aideDeLaQuestion() ?? aideParDefaut(this.type);
  }

  jeNeSaisPasPermis(): boolean {
    return true;
  }

  direJeNeSaisPas(): AideDonnee {
    if (this.estReussie) throw new QuestionDejaReussie();
    if (this.jeNeSaisPasDejaDit) throw new JeNeSaisPasDejaDit();
    this.jeNeSaisPasDejaDit = true;
    this.reponsesDonnees.push({ genre: "jeNeSaisPas" });
    if (this.nombreDErreurs === 0) this.nombreDErreurs = 1;
    this.choixProposes = this.choixProposes.reduireALaBonneReponse();
    return { aide: this.aideDeLaQuestion(), bonneReponse: this.bonneReponse, maniere: "briller" };
  }

  tirage(): string[] {
    return [...this.ordreInitialDesChoix];
  }

  reponses(): ReponseDonnee[] {
    return [...this.reponsesDonnees];
  }

  get bonneReponseMontree(): boolean {
    return this.jeNeSaisPasDejaDit;
  }

  private aideDeLaQuestion(): string | undefined {
    return this.aide || undefined;
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

  repondre(reponse: ReponseParChoix): ResultatDeReponse {
    if (this.estReussie) throw new QuestionDejaReussie();
    if (!this.choixProposes.textes().includes(reponse.texte)) throw new ChoixInconnu(reponse.texte);
    this.reponsesDonnees.push(reponse);
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
  return questionsJoueesAvec(exercice, tireurAuHasard(hasard));
}

export function questionsJoueesAvec(exercice: Exercice, tireur: Tireur): QuestionJouee[] {
  switch (exercice.type) {
    case "bulles":
    case "lecture": {
      const type = exercice.type;
      return exercice.questions.map((q) =>
        QuestionJouee.aChoix({
          cle: CleDeQuestion.de(type, q.question + q.reponse),
          enonce: q.question,
          choix: tireur.choix(q.choix, q.reponse),
          bonneReponse: q.reponse,
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
          choix: tireur.choix(item.choix, item.reponse),
          bonneReponse: item.reponse,
          type: "ecoute",
          complements: { aide: item.aide, motAEcouter: item.dire, langue: exercice.langue },
        })
      );
    case "trous":
      return questionsDeTrous(exercice).map((question) =>
        QuestionJouee.aChoix({
          cle: CleDeQuestion.de("trous", question.enonce),
          enonce: question.enonce,
          choix: tireur.trou(question.motAttendu, question.candidats),
          bonneReponse: question.motAttendu,
          type: "trous",
        })
      );
    case "conjugaison":
      return questionsDeConjugaison(exercice).map((question) =>
        QuestionJouee.aChoix({
          cle: CleDeQuestion.de("conjugaison", question.cle),
          enonce: question.enonce,
          choix: tireur.trou(question.motAttendu, question.candidats),
          bonneReponse: question.motAttendu,
          type: "conjugaison",
          complements: { aide: question.aide },
        })
      );
    default:
      return [];
  }
}
