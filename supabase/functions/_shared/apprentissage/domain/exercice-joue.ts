import type { Exercice, ExerciceCalcul, Niveau, Operation, Segment } from "../../catalogue/domain/index.ts";
import { AdditionsJouees } from "./additions-jouees.ts";
import { type EtiquettePosee, EtiquettesAPlacer } from "./etiquettes-a-placer.ts";
import { ExerciceChronometre, type FluenceEnCours } from "./exercice-chronometre.ts";
import { FluenceNonCommencee, JeNeSaisPasEnFluence, PasDeQuestionEnCours, ReponseIncompatible } from "./erreurs.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";
import { ModeDeReponse } from "./mode-de-reponse.ts";
import { type CalculEnCours, QuestionDeCalcul } from "./question-de-calcul.ts";
import { QuestionJouee, questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import type { ParoleDue } from "./parole-due.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";
import type { VueAddition } from "./vue-d-addition.ts";
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
  chronometre?: ExerciceChronometre;
  additions?: AdditionsJouees;
}>;

export class ExerciceJoue {
  private reussies = 0;
  private dernierResultatDuTrou: ResultatDeReponse | undefined;
  private aideDeLErreurDeCalcul: string | undefined;

  constructor(
    readonly position: number,
    readonly titre: string | undefined,
    readonly questions: number,
    private readonly contenu: Contenu = {},
  ) {}

  static depuis(position: number, exercice: Exercice, tireur: Tireur, niveau: Niveau): ExerciceJoue {
    const contenu = contenuDe(exercice, tireur, niveau);
    const questions = contenu.additions?.questions.length ?? nombreDeQuestions(exercice);
    return new ExerciceJoue(position, exercice.titre, questions, contenu);
  }

  /** La question à choix en cours ; une question de calcul s'affichera par son propre composant. */
  questionEnCours(): QuestionJouee | undefined {
    const question = this.questionPoseeEnCours();
    return question instanceof QuestionJouee ? question : undefined;
  }

  calculEnCours(): CalculEnCours | undefined {
    const question = this.questionPoseeEnCours();
    return question instanceof QuestionDeCalcul ? question.enCours() : undefined;
  }

  additionEnCours(): VueAddition | undefined {
    return this.contenu.additions?.enCours();
  }

  additionApresLaDerniereReponse(): VueAddition | undefined {
    return this.contenu.additions?.apresLaDerniereReponse();
  }

  fluenceEnCours(maintenant: Date): FluenceEnCours | undefined {
    return this.contenu.chronometre?.enCours(maintenant);
  }

  questionsJouees(): readonly QuestionSuivie[] {
    if (this.contenu.chronometre) return [this.contenu.chronometre];
    return this.contenu.etiquettes?.questions ?? this.contenu.additions?.questions ?? this.questionsPosees();
  }

  questionsRatees(): QuestionSuivie[] {
    return this.questionsJouees().filter((question) => question.erreurs > 0);
  }

  tirages(): string[][] {
    const chronometre = this.contenu.chronometre;
    if (chronometre) return chronometre.tirages().slice(0, 1);
    const etiquettes = this.contenu.etiquettes;
    if (etiquettes) return [etiquettes.tirage()];
    if (this.contenu.additions) return this.contenu.additions.tirages();
    const operations = (this.contenu.operationsTirees ?? []).map(enonceTire);
    const tiragesDesQuestions = this.questionsPosees().map((question) => question.tirage());
    return [...(operations.length > 0 ? [operations] : []), ...tiragesDesQuestions].filter((tirage) =>
      tirage.length > 0
    );
  }

  /** Les tirages faits après le début de l'exercice : opérations d'une fluence, choix des colonnes d'une addition. */
  tiragesEnCoursDeJeu(): string[][] {
    return this.contenu.chronometre?.tirages().slice(1) ?? this.contenu.additions?.tiragesEnCoursDeJeu() ?? [];
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
    return this.contenu.etiquettes?.aideApresLaDerniereErreur() ??
      this.contenu.additions?.aideApresLaDerniereErreur() ??
      this.aideDeLErreurDeCalcul;
  }

  paroleDueApresLaDerniereReponse(): ParoleDue | undefined {
    const etiquettes = this.contenu.etiquettes;
    if (etiquettes) return etiquettes.paroleDueApresLaDerniereReponse();
    return this.dernierBonMotDUnTrou() ? "felicitation" : undefined;
  }

  texteCompleteParLaDerniereReponse(): boolean {
    return this.dernierBonMotDUnTrou() && this.estReussi();
  }

  scoreDeFluence(): { nom: string; score: number; reponsesFausses: number } | undefined {
    const chronometre = this.contenu.chronometre;
    if (!chronometre) return undefined;
    return { nom: chronometre.nom, score: chronometre.score, reponsesFausses: chronometre.reponsesFausses };
  }

  demarrerLaFluence(maintenant: Date): void {
    this.chronometre().demarrer(maintenant);
  }

  finirLaFluence(): void {
    this.chronometre().finir();
  }

  repondre(reponse: Reponse, maintenant?: Date): ResultatDeReponse {
    if (this.contenu.chronometre) return this.repondreALaFluence(this.contenu.chronometre, reponse, maintenant);
    if (this.contenu.additions) return this.contenu.additions.repondre(reponse);
    if (reponse.genre === "placement") return this.placer(reponse);
    const question = this.questionPoseeEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    const resultat = question.repondre(reponse);
    this.dernierResultatDuTrou = resultat;
    this.aideDeLErreurDeCalcul = question instanceof QuestionDeCalcul && resultat === "fausse"
      ? question.aideApresErreur()
      : undefined;
    if (resultat === "juste") this.reussies++;
    return resultat;
  }

  direJeNeSaisPas(etiquette?: string): AideDonnee {
    if (this.contenu.chronometre) throw new JeNeSaisPasEnFluence();
    if (this.contenu.etiquettes) return this.contenu.etiquettes.direJeNeSaisPas(etiquette);
    if (this.contenu.additions) return this.contenu.additions.direJeNeSaisPas(etiquette);
    const question = this.questionPoseeEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    return question.direJeNeSaisPas();
  }

  get questionsReussies(): number {
    if (this.contenu.chronometre) return this.contenu.chronometre.reussie ? 1 : 0;
    return this.contenu.etiquettes?.nombreReussies ?? this.contenu.additions?.nombreReussies ?? this.reussies;
  }

  get rangDeLaQuestionEnCours(): number {
    return this.reussies;
  }

  estReussi(): boolean {
    return this.questionsReussies >= this.questions;
  }

  private chronometre(): ExerciceChronometre {
    if (!this.contenu.chronometre) throw new PasDeQuestionEnCours();
    return this.contenu.chronometre;
  }

  private repondreALaFluence(chronometre: ExerciceChronometre, reponse: Reponse, maintenant?: Date): ResultatDeReponse {
    if (reponse.genre !== "nombre") throw new ReponseIncompatible(reponse.genre);
    if (!maintenant) throw new FluenceNonCommencee();
    return chronometre.repondre(reponse.valeur, maintenant);
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
    case "fluence":
      return { chronometre: ExerciceChronometre.pour(exercice, tireur) };
    case "addition":
      return { additions: AdditionsJouees.pour(exercice, tireur, niveau) };
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
