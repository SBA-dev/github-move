import type { Exercice, FormeConjuguee, Segment } from "../../catalogue/domain/index.ts";
import { type EtiquettePosee, EtiquettesAPlacer } from "./etiquettes-a-placer.ts";
import { PasDeQuestionEnCours } from "./erreurs.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";
import { type QuestionJouee, questionsJoueesAvec } from "./question-jouee.ts";
import type { ParoleDue } from "./parole-due.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { CorrectionDuMot } from "./mot-a-ecrire.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";
import { QuestionDeDictee } from "./question-de-dictee.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";
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
  questionsAChoix?: readonly QuestionJouee[];
  questionsDeDictee?: readonly QuestionDeDictee[];
  etiquettes?: EtiquettesAPlacer;
  segments?: readonly Segment[];
  formes?: readonly FormeConjuguee[];
}>;

export class ExerciceJoue {
  private reussies = 0;
  private dernierResultatDuTrou: ResultatDeReponse | undefined;
  private derniereQuestionDeDicteeCorrigee: QuestionDeDictee | undefined;

  constructor(
    readonly position: number,
    readonly titre: string | undefined,
    readonly questions: number,
    private readonly contenu: Contenu = {},
  ) {}

  static depuis(position: number, exercice: Exercice, tireur: Tireur): ExerciceJoue {
    return new ExerciceJoue(
      position,
      exercice.titre,
      nombreDeQuestions(exercice),
      contenuDe(exercice, tireur),
    );
  }

  questionEnCours(): QuestionJouee | undefined {
    return this.questionsAChoix()[this.reussies];
  }

  questionsJouees(): readonly QuestionSuivie[] {
    return this.contenu.etiquettes?.questions ?? this.contenu.questionsDeDictee ?? this.questionsAChoix();
  }

  questionDeDicteeEnCours(): QuestionDeDictee | undefined {
    return this.contenu.questionsDeDictee?.[this.reussies];
  }

  questionsRatees(): QuestionSuivie[] {
    return this.questionsJouees().filter((question) => question.erreurs > 0);
  }

  tirages(): string[][] {
    const etiquettes = this.contenu.etiquettes;
    if (etiquettes) return [etiquettes.tirage()];
    const questions = this.contenu.questionsDeDictee ?? this.questionsAChoix();
    return questions.map((question) => question.tirage());
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

  tableauDeConjugaison(): LigneDuTableauDeConjugaison[] {
    return (this.contenu.formes ?? []).map(({ pronom, forme }, rang) => {
      const formeTrouvee = rang < this.reussies ? forme : undefined;
      return { pronom, forme: formeTrouvee, texte: ecrireLaPersonne(pronom, formeTrouvee) };
    });
  }

  aideApresLaDerniereErreur(): string | undefined {
    if (this.contenu.questionsDeDictee) return this.derniereQuestionDeDicteeCorrigee?.aideApresErreur();
    return this.contenu.etiquettes?.aideApresLaDerniereErreur();
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
    if (this.contenu.questionsDeDictee) return this.derniereCorrection()?.juste ? "felicitation" : undefined;
    if (this.contenu.formes) return this.paroleDueEnConjugaison();
    return this.dernierBonMotDUnTrou() ? "felicitation" : undefined;
  }

  texteCompleteParLaDerniereReponse(): boolean {
    return this.contenu.segments !== undefined && this.derniereReponseCompleteLExercice();
  }

  conjugaisonCompleteParLaDerniereReponse(): boolean {
    return this.contenu.formes !== undefined && this.derniereReponseCompleteLExercice();
  }

  repondre(reponse: Reponse): ResultatDeReponse {
    if (reponse.genre === "placement") return this.placer(reponse);
    if (reponse.genre === "motEcrit") return this.corrigerLaDictee(this.questionDeDicteeAReussir().repondre(reponse));
    const question = this.questionEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    const resultat = question.repondre(reponse);
    this.dernierResultatDuTrou = resultat;
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
    if (this.contenu.etiquettes) return this.contenu.etiquettes.direJeNeSaisPas(etiquette);
    const question = this.questionEnCours();
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

  private questionsAChoix(): readonly QuestionJouee[] {
    return this.contenu.questionsAChoix ?? [];
  }
}

function contenuDe(exercice: Exercice, tireur: Tireur): Contenu {
  switch (exercice.type) {
    case "classer": {
      const etiquettes = tireur.etiquettesMelangees(exercice.items.map((item) => item.texte));
      return { etiquettes: EtiquettesAPlacer.pourClasser(exercice, etiquettes) };
    }
    case "ordre":
      return { etiquettes: EtiquettesAPlacer.pourOrdonner(exercice, tireur.etiquettesMelangees(exercice.elements)) };
    case "trous":
      return { questionsAChoix: questionsJoueesAvec(exercice, tireur), segments: exercice.segments };
    case "conjugaison":
      return { questionsAChoix: questionsJoueesAvec(exercice, tireur), formes: exercice.formes };
    case "dictee":
      return {
        questionsDeDictee: exercice.mots.map((mot) =>
          new QuestionDeDictee(mot, exercice.consigne, tireur.clavier(MotAEcrire.de(mot.mot)))
        ),
      };
    default:
      return { questionsAChoix: questionsJoueesAvec(exercice, tireur) };
  }
}
