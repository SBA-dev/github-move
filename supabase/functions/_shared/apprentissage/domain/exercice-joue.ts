import type {
  Exercice,
  ExerciceBarres,
  ExerciceBoite,
  ExerciceCalcul,
  FormeConjuguee,
  Niveau,
  Operation,
  Segment,
} from "../../catalogue/domain/index.ts";
import { AdditionsJouees } from "./additions-jouees.ts";
import { type EtiquettePosee, EtiquettesAPlacer } from "./etiquettes-a-placer.ts";
import { ExerciceChronometre, type FluenceEnCours } from "./exercice-chronometre.ts";
import { FluenceNonCommencee, JeNeSaisPasEnFluence, PasDeQuestionEnCours, ReponseIncompatible } from "./erreurs.ts";
import { type EntrainementDeMemorisation, MemorisationJouee } from "./memorisation-jouee.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";
import type { CorrectionDuMot } from "./mot-a-ecrire.ts";
import { type BoiteEnCours, type BoiteOuverte, QuestionDeBoite } from "./question-de-boite.ts";
import { QuestionDeProblemeEnBarres, type SchemaEnCours, type SchemaResolu } from "./question-de-probleme-en-barres.ts";
import { QuestionEnveloppantUnCalcul } from "./question-enveloppant-un-calcul.ts";
import { type CalculEnCours, QuestionDeCalcul } from "./question-de-calcul.ts";
import { QuestionDeDictee } from "./question-de-dictee.ts";
import { QuestionJouee, questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import type { ParoleDue } from "./parole-due.ts";
import type { QuestionSuivie, TypeDeQuestion } from "./question-suivie.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { estUnTypeDeQuestionRetenu } from "./types-de-question-retenus.ts";
import { enonceDUneAddition } from "./tirage-d-additions.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";
import type { VueAddition } from "./vue-d-addition.ts";
import { enonceTire } from "./tirage-d-operations.ts";
import type { Tireur } from "./tireur.ts";

export type SegmentDuTexteATrous =
  | Readonly<{ type: "texte"; texte: string }>
  | Readonly<{ type: "trou"; mot: string }>
  | Readonly<{ type: "trou"; mot: undefined }>;

export type LigneDuTableauDeConjugaison = Readonly<{ pronom: string; forme: string | undefined; texte: string }>;

function ecrireLaPersonne(pronom: string, forme: string | undefined): string {
  const elide = pronom.endsWith("'") || pronom.endsWith("’");
  return `${pronom}${elide ? "" : " "}${forme ?? "…"}`;
}

type Contenu = Readonly<{
  questionsPosees?: readonly QuestionPosee[];
  questionsDeDictee?: readonly QuestionDeDictee[];
  etiquettes?: EtiquettesAPlacer;
  segments?: readonly Segment[];
  formes?: readonly FormeConjuguee[];
  operationsTirees?: readonly Operation[];
  chronometre?: ExerciceChronometre;
  additions?: AdditionsJouees;
  memorisation?: MemorisationJouee;
}>;

export class ExerciceJoue {
  private reussies = 0;
  private dernierResultatDuTrou: ResultatDeReponse | undefined;
  private derniereQuestionDeDicteeCorrigee: QuestionDeDictee | undefined;
  private aideDeLaDerniereErreur: string | undefined;
  private derniereBoiteOuverte: BoiteOuverte | undefined;
  private dernierSchemaResolu: SchemaResolu | undefined;

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
    if (this.contenu.memorisation) return this.contenu.memorisation.questionEnCours();
    const question = this.questionPoseeEnCours();
    return question instanceof QuestionJouee ? question : undefined;
  }

  entrainementDeMemorisation(): EntrainementDeMemorisation | undefined {
    return this.contenu.memorisation?.entrainement();
  }

  questionDeDicteeEnCours(): QuestionDeDictee | undefined {
    return this.contenu.questionsDeDictee?.[this.reussies];
  }

  calculEnCours(): CalculEnCours | undefined {
    const question = this.questionPoseeEnCours();
    return question instanceof QuestionDeCalcul ? question.enCours() : undefined;
  }

  boiteEnCours(): BoiteEnCours | undefined {
    const question = this.questionPoseeEnCours();
    return question instanceof QuestionDeBoite ? question.enCours() : undefined;
  }

  schemaEnCours(): SchemaEnCours | undefined {
    const question = this.questionPoseeEnCours();
    return question instanceof QuestionDeProblemeEnBarres ? question.enCours() : undefined;
  }

  schemaApresLaDerniereReponse(): SchemaResolu | undefined {
    return this.dernierSchemaResolu;
  }

  boiteApresLaDerniereReponse(): BoiteOuverte | undefined {
    return this.derniereBoiteOuverte;
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
    if (this.contenu.memorisation) return this.contenu.memorisation.questions();
    return this.contenu.etiquettes?.questions ?? this.contenu.additions?.questions ??
      this.contenu.questionsDeDictee ?? this.questionsPosees();
  }

  questionsRatees(): QuestionSuivie[] {
    return this.questionsJouees().filter((question) => question.erreurs > 0);
  }

  questionsRateesARetenir(): { cle: CleDeQuestion; type: TypeDeQuestion }[] {
    if (this.contenu.additions) {
      return this.contenu.additions.additionsRatees().map((addition) => ({
        cle: CleDeQuestion.de("calcul", enonceDUneAddition(addition)),
        type: "calcul",
      }));
    }
    return this.questionsRatees()
      .filter(({ type }) => estUnTypeDeQuestionRetenu(type))
      .map(({ cle, type }) => ({ cle, type }));
  }

  tirages(): string[][] {
    const chronometre = this.contenu.chronometre;
    if (chronometre) return chronometre.tirages().slice(0, 1);
    const etiquettes = this.contenu.etiquettes;
    if (etiquettes) return [etiquettes.tirage()];
    if (this.contenu.additions) return this.contenu.additions.tirages();
    if (this.contenu.memorisation) return this.contenu.memorisation.tirages();
    if (this.contenu.questionsDeDictee) return this.contenu.questionsDeDictee.map((question) => question.tirage());
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
    return (this.contenu.etiquettes ?? this.contenu.memorisation)?.etiquettesAPlacer() ?? [];
  }

  etiquettesPosees(): EtiquettePosee[] {
    return (this.contenu.etiquettes ?? this.contenu.memorisation)?.etiquettesPosees() ?? [];
  }

  etiquetteViseeParJeNeSaisPas(choisie?: string): string | undefined {
    return this.contenu.etiquettes?.etiquetteViseeParJeNeSaisPas(choisie);
  }

  texteATrous(): SegmentDuTexteATrous[] {
    let rangDuTrou = 0;
    const trousRemplis = this.contenu.memorisation?.motsTrouves() ?? this.reussies;
    return (this.contenu.segments ?? this.contenu.memorisation?.segmentsAffiches() ?? []).map((segment) => {
      if (segment.type === "texte") return segment;
      const estRempli = rangDuTrou++ < trousRemplis;
      return estRempli ? { type: "trou", mot: segment.motAttendu } : { type: "trou", mot: undefined };
    });
  }

  tableauDeConjugaison(): LigneDuTableauDeConjugaison[] {
    return (this.contenu.formes ?? []).map(({ pronom, forme }, rang) => {
      const formeTrouvee = rang < this.reussies ? forme : undefined;
      return { pronom, forme: formeTrouvee, texte: ecrireLaPersonne(pronom, formeTrouvee) };
    });
  }

  aideApresLaDerniereErreur(): string | undefined {
    if (this.contenu.questionsDeDictee) return this.derniereQuestionDeDicteeCorrigee?.aideApresErreur();
    if (this.contenu.memorisation) return this.contenu.memorisation.aideApresLaDerniereErreur();
    return this.contenu.etiquettes?.aideApresLaDerniereErreur() ??
      this.contenu.additions?.aideApresLaDerniereErreur() ??
      this.aideDeLaDerniereErreur;
  }

  derniereCorrection(): CorrectionDuMot | undefined {
    return this.derniereQuestionDeDicteeCorrigee?.derniereCorrection();
  }

  suiteDeLaFelicitation(): string | undefined {
    return this.derniereQuestionDeDicteeCorrigee?.suiteDeLaFelicitation();
  }

  paroleDueApresLaDerniereReponse(): ParoleDue | undefined {
    const etiquettes = this.contenu.etiquettes;
    if (etiquettes) return etiquettes.paroleDueApresLaDerniereReponse();
    if (this.contenu.memorisation) return this.contenu.memorisation.paroleDueApresLaDerniereReponse();
    if (this.contenu.questionsDeDictee) return this.derniereCorrection()?.juste ? "felicitation" : undefined;
    if (this.contenu.formes) return this.paroleDueEnConjugaison();
    return this.dernierBonMotDUnTrou() ? "felicitation" : undefined;
  }

  texteCompleteParLaDerniereReponse(): boolean {
    if (this.contenu.memorisation) return this.contenu.memorisation.derniereReponseTrouveLeDernierMot();
    return this.contenu.segments !== undefined && this.derniereReponseCompleteLExercice();
  }

  conjugaisonCompleteParLaDerniereReponse(): boolean {
    return this.contenu.formes !== undefined && this.derniereReponseCompleteLExercice();
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
    if (this.contenu.memorisation) return this.contenu.memorisation.repondre(reponse);
    if (reponse.genre === "placement") return this.placer(reponse);
    if (reponse.genre === "motEcrit") return this.corrigerLaDictee(this.questionDeDicteeAReussir().repondre(reponse));
    const question = this.questionPoseeEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    const resultat = question.repondre(reponse);
    this.dernierResultatDuTrou = resultat;
    const joueeCommeUnCalcul = question instanceof QuestionDeCalcul || question instanceof QuestionEnveloppantUnCalcul;
    this.aideDeLaDerniereErreur = joueeCommeUnCalcul && resultat === "fausse" ? question.aideApresErreur() : undefined;
    this.derniereBoiteOuverte = question instanceof QuestionDeBoite && resultat === "juste"
      ? question.ouverte()
      : undefined;
    this.dernierSchemaResolu = question instanceof QuestionDeProblemeEnBarres && resultat === "juste"
      ? question.resolu()
      : undefined;
    if (resultat === "juste") this.reussies++;
    return resultat;
  }

  taper(lettre: string): ResultatDeReponse | undefined {
    const resultat = this.questionDeDicteeAReussir().taper(lettre);
    return resultat && this.corrigerLaDictee(resultat);
  }

  effacer(): void {
    this.questionDeDicteeAReussir().effacer();
  }

  direJeNeSaisPas(etiquette?: string): AideDonnee {
    if (this.contenu.questionsDeDictee) return this.questionDeDicteeAReussir().direJeNeSaisPas();
    if (this.contenu.chronometre) throw new JeNeSaisPasEnFluence();
    if (this.contenu.etiquettes) return this.contenu.etiquettes.direJeNeSaisPas(etiquette);
    if (this.contenu.additions) return this.contenu.additions.direJeNeSaisPas(etiquette);
    if (this.contenu.memorisation) return this.contenu.memorisation.direJeNeSaisPas(etiquette);
    const question = this.questionPoseeEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    return question.direJeNeSaisPas();
  }

  get questionsReussies(): number {
    if (this.contenu.chronometre) return this.contenu.chronometre.reussie ? 1 : 0;
    return this.contenu.etiquettes?.nombreReussies ?? this.contenu.additions?.nombreReussies ??
      this.contenu.memorisation?.nombreReussies ?? this.reussies;
  }

  get rangDeLaQuestionEnCours(): number {
    return this.reussies;
  }

  estReussi(): boolean {
    return this.questionsReussies >= this.questions;
  }

  private questionDeDicteeAReussir(): QuestionDeDictee {
    const question = this.questionDeDicteeEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    return question;
  }

  private corrigerLaDictee(resultat: ResultatDeReponse): ResultatDeReponse {
    this.derniereQuestionDeDicteeCorrigee = this.questionDeDicteeAReussir();
    if (resultat === "juste") this.reussies++;
    return resultat;
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

  private paroleDueEnConjugaison(): ParoleDue | undefined {
    if (this.dernierResultatDuTrou !== "juste") return undefined;
    return this.estReussi() ? "tuSaisConjuguer" : "applaudir";
  }

  private dernierBonMotDUnTrou(): boolean {
    return this.contenu.segments !== undefined && this.dernierResultatDuTrou === "juste";
  }

  private derniereReponseCompleteLExercice(): boolean {
    return this.dernierResultatDuTrou === "juste" && this.estReussi();
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
    case "conjugaison":
      return { questionsPosees: questionsJoueesAvec(exercice, tireur), formes: exercice.formes };
    case "dictee":
      return {
        questionsDeDictee: exercice.mots.map((mot) =>
          new QuestionDeDictee(mot, exercice.consigne, tireur.clavier(MotAEcrire.de(mot.mot)))
        ),
      };
    case "calcul":
      return contenuDeCalcul(exercice, tireur, niveau);
    case "boite":
      return { questionsPosees: questionsDeBoite(exercice, tireur, niveau) };
    case "barres":
      return { questionsPosees: questionsDeProblemesEnBarres(exercice, tireur, niveau) };
    case "fluence":
      return { chronometre: ExerciceChronometre.pour(exercice, tireur) };
    case "addition":
      return { additions: AdditionsJouees.pour(exercice, tireur, niveau) };
    case "memoriser":
      return { memorisation: MemorisationJouee.pour(exercice, tireur) };
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
  return operations.map((operation) => QuestionDeCalcul.pour(operation, tireur, niveau));
}

function questionsDeBoite(exercice: ExerciceBoite, tireur: Tireur, niveau: Niveau): QuestionDeBoite[] {
  return exercice.items.map((item) => QuestionDeBoite.pour(item, tireur, niveau));
}

function questionsDeProblemesEnBarres(
  exercice: ExerciceBarres,
  tireur: Tireur,
  niveau: Niveau,
): QuestionDeProblemeEnBarres[] {
  return exercice.items.map((probleme) => QuestionDeProblemeEnBarres.pour(probleme, tireur, niveau));
}
