import type { Exercice, ExerciceCalcul, Niveau, Operation, Segment } from "../../catalogue/domain/index.ts";
import { type EtiquettePosee, EtiquettesAPlacer } from "./etiquettes-a-placer.ts";
import { PasDeQuestionEnCours } from "./erreurs.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";
import { ModeDeReponse } from "./mode-de-reponse.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import { QuestionJouee, questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import type { ParoleDue } from "./parole-due.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";
import { enonceTire } from "./tirage-d-operations.ts";
import type { Tireur } from "./tireur.ts";

export type SegmentDuTexteATrous =
  | Readonly<{ type: "texte"; texte: string }>
  | Readonly<{ type: "trou"; mot: string }>
  | Readonly<{ type: "trou"; mot: undefined }>;

type Contenu = Readonly<{
  questionsPosees?: readonly QuestionPosee[];
  etiquettes?: EtiquettesAPlacer;
  segments?: readonly Segment[];
  operationsTirees?: readonly Operation[];
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

  static depuis(position: number, exercice: Exercice, tireur: Tireur, niveau: Niveau): ExerciceJoue {
    return new ExerciceJoue(position, exercice.titre, nombreDeQuestions(exercice), contenuDe(exercice, tireur, niveau));
  }

  /** La question à choix en cours ; une question de calcul s'affichera par son propre composant. */
  questionEnCours(): QuestionJouee | undefined {
    const question = this.questionPoseeEnCours();
    return question instanceof QuestionJouee ? question : undefined;
  }

  questionsJouees(): readonly QuestionSuivie[] {
    return this.contenu.etiquettes?.questions ?? this.questionsPosees();
  }

  questionsRatees(): QuestionSuivie[] {
    return this.questionsJouees().filter((question) => question.erreurs > 0);
  }

  tirages(): string[][] {
    const etiquettes = this.contenu.etiquettes;
    if (etiquettes) return [etiquettes.tirage()];
    const operations = (this.contenu.operationsTirees ?? []).map(enonceTire);
    const tiragesDesQuestions = this.questionsPosees().map((question) => question.tirage());
    return [...(operations.length > 0 ? [operations] : []), ...tiragesDesQuestions].filter((tirage) =>
      tirage.length > 0
    );
  }

  etiquettesAPlacer(): string[] {
    return this.contenu.etiquettes?.etiquettesAPlacer() ?? [];
  }

  etiquettesPosees(): EtiquettePosee[] {
    return this.contenu.etiquettes?.etiquettesPosees() ?? [];
  }

  etiquetteViseeParJeNeSaisPas(choisie?: string): string | undefined {
    return this.contenu.etiquettes?.etiquetteViseeParJeNeSaisPas(choisie);
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

  paroleDueApresLaDerniereReponse(): ParoleDue | undefined {
    const etiquettes = this.contenu.etiquettes;
    if (etiquettes) return etiquettes.paroleDueApresLaDerniereReponse();
    return this.dernierBonMotDUnTrou() ? "felicitation" : undefined;
  }

  texteCompleteParLaDerniereReponse(): boolean {
    return this.dernierBonMotDUnTrou() && this.estReussi();
  }

  repondre(reponse: Reponse): ResultatDeReponse {
    if (reponse.genre === "placement") return this.placer(reponse);
    const question = this.questionPoseeEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    const resultat = question.repondre(reponse);
    this.dernierResultatDuTrou = resultat;
    if (resultat === "juste") this.reussies++;
    return resultat;
  }

  direJeNeSaisPas(etiquette?: string): AideDonnee {
    if (this.contenu.etiquettes) return this.contenu.etiquettes.direJeNeSaisPas(etiquette);
    const question = this.questionPoseeEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    return question.direJeNeSaisPas();
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

  private questionPoseeEnCours(): QuestionPosee | undefined {
    return this.questionsPosees()[this.reussies];
  }

  private questionsPosees(): readonly QuestionPosee[] {
    return this.contenu.questionsPosees ?? [];
  }
}

function contenuDe(exercice: Exercice, tireur: Tireur, niveau: Niveau): Contenu {
  switch (exercice.type) {
    case "classer": {
      const etiquettes = tireur.etiquettesMelangees(exercice.items.map((item) => item.texte));
      return { etiquettes: EtiquettesAPlacer.pourClasser(exercice, etiquettes) };
    }
    case "ordre":
      return { etiquettes: EtiquettesAPlacer.pourOrdonner(exercice, tireur.etiquettesMelangees(exercice.elements)) };
    case "trous":
      return { questionsPosees: questionsJoueesAvec(exercice, tireur), segments: exercice.segments };
    case "calcul":
      return contenuDeCalcul(exercice, tireur, niveau);
    default:
      return { questionsPosees: questionsJoueesAvec(exercice, tireur) };
  }
}

function contenuDeCalcul(exercice: ExerciceCalcul, tireur: Tireur, niveau: Niveau): Contenu {
  if (exercice.operations || !exercice.generateur) {
    return { questionsPosees: questionsDeCalcul(exercice.operations ?? [], tireur, niveau) };
  }
  const operationsTirees = tireur.operations(exercice.generateur);
  return { operationsTirees, questionsPosees: questionsDeCalcul(operationsTirees, tireur, niveau) };
}

function questionsDeCalcul(operations: readonly Operation[], tireur: Tireur, niveau: Niveau): QuestionDeCalcul[] {
  const auxChoix = ModeDeReponse.pour(niveau).genre === "choix";
  return operations.map((operation) =>
    auxChoix ? QuestionDeCalcul.avecLesChoix(operation, tireur) : QuestionDeCalcul.auClavier(operation)
  );
}
