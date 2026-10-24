import type { Exercice, Segment } from "../../catalogue/domain/index.ts";
import { EtiquettesAPlacer } from "./etiquettes-a-placer.ts";
import { PasDeQuestionEnCours } from "./erreurs.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";
import type { QuestionJouee } from "./question-jouee.ts";
import { questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";
import type { Tireur } from "./tireur.ts";

export type SegmentDuTexteATrous =
  | Readonly<{ type: "texte"; texte: string }>
  | Readonly<{ type: "trou"; mot: string }>
  | Readonly<{ type: "trou"; mot: undefined }>;

type Contenu = Readonly<{
  questionsAChoix?: readonly QuestionJouee[];
  etiquettes?: EtiquettesAPlacer;
  segments?: readonly Segment[];
}>;

export class ExerciceJoue {
  private reussies = 0;

  constructor(
    readonly position: number,
    readonly titre: string | undefined,
    readonly questions: number,
    private readonly contenu: Contenu = {},
  ) {}

  static depuis(position: number, exercice: Exercice, tireur: Tireur): ExerciceJoue {
    const contenu = (): Contenu => {
      switch (exercice.type) {
        case "classer":
          return {
            etiquettes: EtiquettesAPlacer.pourClasser(exercice, tireur.plateau(exercice.items.map((i) => i.texte))),
          };
        case "ordre":
          return { etiquettes: EtiquettesAPlacer.pourOrdonner(exercice, tireur.plateau(exercice.elements)) };
        case "trous":
          return { questionsAChoix: questionsJoueesAvec(exercice, tireur), segments: exercice.segments };
        default:
          return { questionsAChoix: questionsJoueesAvec(exercice, tireur) };
      }
    };
    return new ExerciceJoue(position, exercice.titre, nombreDeQuestions(exercice), contenu());
  }

  questionEnCours(): QuestionJouee | undefined {
    return this.questionsAChoix()[this.reussies];
  }

  questionsJouees(): readonly QuestionSuivie[] {
    return this.contenu.etiquettes?.questions ?? this.questionsAChoix();
  }

  questionsRatees(): QuestionSuivie[] {
    return this.questionsJouees().filter((question) => question.erreurs > 0);
  }

  tirages(): string[][] {
    const etiquettes = this.contenu.etiquettes;
    return etiquettes ? [etiquettes.tirage()] : this.questionsAChoix().map((question) => question.tirage());
  }

  etiquettesAPlacer(): string[] {
    return this.contenu.etiquettes?.etiquettesAPlacer() ?? [];
  }

  texteATrous(): SegmentDuTexteATrous[] {
    let rangDuTrou = 0;
    return (this.contenu.segments ?? []).map((segment) => {
      if (segment.type === "texte") return segment;
      const estRempli = rangDuTrou++ < this.reussies;
      return estRempli ? { type: "trou", mot: segment.motAttendu } : { type: "trou", mot: undefined };
    });
  }

  aideApresLaDerniereErreur(): string | undefined {
    return this.contenu.etiquettes?.aideApresLaDerniereErreur();
  }

  felicitationApresLaDerniereReponse(): boolean {
    return this.contenu.etiquettes?.felicitationApresLaDerniereReponse() ?? false;
  }

  relanceApresLaDerniereReponse(): string | undefined {
    return this.contenu.etiquettes?.relanceApresLaDerniereReponse();
  }

  repondre(reponse: Reponse): ResultatDeReponse {
    if (reponse.genre === "placement") return this.placer(reponse);
    const question = this.questionEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    const resultat = question.repondre(reponse);
    if (resultat === "juste") this.reussies++;
    return resultat;
  }

  get questionsReussies(): number {
    return this.contenu.etiquettes?.nombreReussies ?? this.reussies;
  }

  get rangDeLaQuestionEnCours(): number {
    return this.reussies;
  }

  estReussi(): boolean {
    return this.questionsReussies >= this.questions;
  }

  private placer(placement: Extract<Reponse, { genre: "placement" }>): ResultatDeReponse {
    if (!this.contenu.etiquettes) throw new PasDeQuestionEnCours();
    return this.contenu.etiquettes.placer(placement);
  }

  private questionsAChoix(): readonly QuestionJouee[] {
    return this.contenu.questionsAChoix ?? [];
  }
}
