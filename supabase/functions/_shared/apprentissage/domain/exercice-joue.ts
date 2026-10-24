import type { Exercice, Segment } from "../../catalogue/domain/index.ts";
import { EtiquettesAPlacer } from "./etiquettes-a-placer.ts";
import { PasDeQuestionEnCours } from "./erreurs.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";
import { type QuestionJouee, questionsJoueesAvec } from "./question-jouee.ts";
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
  private dernierResultatDuTrou: ResultatDeReponse | undefined;

  constructor(
    readonly position: number,
    readonly titre: string | undefined,
    readonly questions: number,
    private readonly contenu: Contenu = {},
  ) {}

  static depuis(position: number, exercice: Exercice, tireur: Tireur): ExerciceJoue {
    return new ExerciceJoue(position, exercice.titre, nombreDeQuestions(exercice), contenuDe(exercice, tireur));
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
    const etiquettes = this.contenu.etiquettes;
    if (etiquettes) return etiquettes.felicitationApresLaDerniereReponse();
    return this.dernierBonMotDUnTrou();
  }

  texteCompleteParLaDerniereReponse(): boolean {
    return this.dernierBonMotDUnTrou() && this.estReussi();
  }

  relanceApresLaDerniereReponse(): string | undefined {
    return this.contenu.etiquettes?.relanceApresLaDerniereReponse();
  }

  repondre(reponse: Reponse): ResultatDeReponse {
    if (reponse.genre === "placement") return this.placer(reponse);
    const question = this.questionEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    const resultat = question.repondre(reponse);
    this.dernierResultatDuTrou = resultat;
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

  private dernierBonMotDUnTrou(): boolean {
    return this.contenu.segments !== undefined && this.dernierResultatDuTrou === "juste";
  }

  private questionsAChoix(): readonly QuestionJouee[] {
    return this.contenu.questionsAChoix ?? [];
  }
}

function contenuDe(exercice: Exercice, tireur: Tireur): Contenu {
  switch (exercice.type) {
    case "classer": {
      const plateau = tireur.plateau(exercice.items.map((item) => item.texte));
      return { etiquettes: EtiquettesAPlacer.pourClasser(exercice, plateau) };
    }
    case "ordre":
      return { etiquettes: EtiquettesAPlacer.pourOrdonner(exercice, tireur.plateau(exercice.elements)) };
    case "trous":
      return { questionsAChoix: questionsJoueesAvec(exercice, tireur), segments: exercice.segments };
    default:
      return { questionsAChoix: questionsJoueesAvec(exercice, tireur) };
  }
}
