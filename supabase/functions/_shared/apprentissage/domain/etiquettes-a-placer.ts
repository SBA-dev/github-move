import type { ExerciceClasser, ExerciceOrdre, Groupe } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { EtiquetteDejaPlacee, EtiquetteInconnue, GroupeInconnu, PasDeQuestionEnCours } from "./erreurs.ts";
import { QuestionAPlacer } from "./question-a-placer.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { Placement, ResultatDeReponse } from "./reponse.ts";

const RELANCES = ["Oui ! Et après ?", "Bien ! Et ensuite ?", "Super ! La suite ?"];
const AIDE_DU_DEBUT = "Ce n'est pas le début. Lequel vient en premier ?";
const AIDE_DE_LA_SUITE = "Pas encore celui-là. Lequel vient juste après ?";

export type EtiquettePosee = Readonly<{ texte: string; groupe?: string }>;

export abstract class EtiquettesAPlacer {
  private restantes: string[];
  private posees: EtiquettePosee[] = [];
  private derniereAide: string | undefined;
  private dernierResultat: ResultatDeReponse | undefined;

  protected constructor(
    private readonly etiquettesMelangees: readonly string[],
    readonly questions: readonly QuestionAPlacer[],
  ) {
    this.restantes = [...etiquettesMelangees];
  }

  static pourClasser(exercice: ExerciceClasser, etiquettesMelangees: readonly string[]): EtiquettesAPlacer {
    return new EtiquettesDeClasser(exercice, etiquettesMelangees);
  }

  static pourOrdonner(exercice: ExerciceOrdre, etiquettesMelangees: readonly string[]): EtiquettesAPlacer {
    return new EtiquettesDOrdre(exercice, etiquettesMelangees);
  }

  static questionsDeClasser(exercice: ExerciceClasser): QuestionAPlacer[] {
    const noms = exercice.groupes.map((groupe) => groupe.nom).join();
    return exercice.items.map((item) =>
      new QuestionAPlacer(CleDeQuestion.de("classer", item.texte + noms), "classer", item.texte, {
        groupe: item.groupe,
        aide: item.aide,
      })
    );
  }

  static questionsDOrdre(exercice: ExerciceOrdre): QuestionAPlacer[] {
    return exercice.elements.map((element, rang) =>
      new QuestionAPlacer(CleDeQuestion.de("ordre", `${rang + 1} ${element}`), "ordre", element)
    );
  }

  etiquettesAPlacer(): string[] {
    return [...this.restantes];
  }

  etiquettesPosees(): EtiquettePosee[] {
    return [...this.posees];
  }

  tirage(): string[] {
    return [...this.etiquettesMelangees];
  }

  get nombreReussies(): number {
    return this.questions.filter((question) => question.reussie).length;
  }

  placer(placement: Placement): ResultatDeReponse {
    const position = this.restantes.indexOf(placement.etiquette);
    if (position === -1) throw this.etiquetteHorsDesRestantes(placement.etiquette);
    const question = this.questionVisee(placement);
    const estJuste = this.estBienPlacee(question, placement);
    question.enregistrer(placement, estJuste);
    if (estJuste) {
      this.restantes.splice(position, 1);
      this.posees.push(
        question.groupe === undefined
          ? { texte: question.etiquette }
          : { texte: question.etiquette, groupe: question.groupe },
      );
    }
    this.derniereAide = estJuste ? undefined : this.aideApresErreur(question, placement);
    this.dernierResultat = estJuste ? "juste" : "fausse";
    return this.dernierResultat;
  }

  direJeNeSaisPas(etiquette?: string): AideDonnee {
    const question = this.questionPourJeNeSaisPas(etiquette);
    return question.direJeNeSaisPas(this.bonneReponseDe(question));
  }

  abstract etiquetteViseeParJeNeSaisPas(choisie?: string): string | undefined;

  aideApresLaDerniereErreur(): string | undefined {
    return this.derniereAide;
  }

  felicitationApresLaDerniereReponse(): boolean {
    return this.dernierResultat === "juste" && this.felicitationApresUneBonneEtiquette(this.nombreReussies);
  }

  relanceApresLaDerniereReponse(): string | undefined {
    if (this.dernierResultat !== "juste" || this.restantes.length === 0) return undefined;
    return this.relanceApresUneBonneEtiquette(this.nombreReussies);
  }

  protected etiquetteHorsDesRestantes(etiquette: string): Error {
    const estDeLExercice = this.questions.some((question) => question.etiquette === etiquette);
    return estDeLExercice ? new EtiquetteDejaPlacee(etiquette) : new EtiquetteInconnue(etiquette);
  }

  protected abstract questionVisee(placement: Placement): QuestionAPlacer;
  protected abstract estBienPlacee(question: QuestionAPlacer, placement: Placement): boolean;
  protected abstract aideApresErreur(question: QuestionAPlacer, placement: Placement): string;
  protected abstract questionPourJeNeSaisPas(etiquette: string | undefined): QuestionAPlacer;
  protected abstract bonneReponseDe(question: QuestionAPlacer): string;

  protected felicitationApresUneBonneEtiquette(_reussies: number): boolean {
    return false;
  }

  protected relanceApresUneBonneEtiquette(_reussies: number): string | undefined {
    return undefined;
  }
}

class EtiquettesDeClasser extends EtiquettesAPlacer {
  constructor(private readonly exercice: ExerciceClasser, etiquettesMelangees: readonly string[]) {
    super(etiquettesMelangees, EtiquettesAPlacer.questionsDeClasser(exercice));
  }

  protected questionVisee(placement: Placement): QuestionAPlacer {
    const nonPlacees = this.questions.filter((question) =>
      !question.reussie && question.etiquette === placement.etiquette
    );
    const question = nonPlacees.find((candidate) => candidate.groupe === placement.groupe) ?? nonPlacees[0];
    if (!question) throw new EtiquetteInconnue(placement.etiquette);
    return question;
  }

  protected estBienPlacee(question: QuestionAPlacer, placement: Placement): boolean {
    this.groupeTouche(placement);
    return question.groupe === placement.groupe;
  }

  override etiquetteViseeParJeNeSaisPas(choisie?: string): string | undefined {
    return choisie ?? this.etiquettesAPlacer()[0];
  }

  protected questionPourJeNeSaisPas(etiquette: string | undefined): QuestionAPlacer {
    const visee = this.etiquetteViseeParJeNeSaisPas(etiquette);
    if (visee === undefined) throw new EtiquetteInconnue(String(visee));
    if (!this.etiquettesAPlacer().includes(visee)) throw this.etiquetteHorsDesRestantes(visee);
    const question = this.questions.find((candidate) => !candidate.reussie && candidate.etiquette === visee);
    if (!question) throw new EtiquetteInconnue(visee);
    return question;
  }

  protected bonneReponseDe(question: QuestionAPlacer): string {
    if (question.groupe === undefined) throw new GroupeInconnu(question.etiquette);
    return question.groupe;
  }

  protected aideApresErreur(question: QuestionAPlacer, placement: Placement): string {
    const nom = this.groupeTouche(placement).nom;
    return question.aide ??
      `« ${question.etiquette} » n'habite pas dans la maison « ${nom} ». Essaie une autre maison.`;
  }

  protected override felicitationApresUneBonneEtiquette(reussies: number): boolean {
    return reussies % 2 === 1;
  }

  private groupeTouche(placement: Placement): Groupe {
    const groupe = this.exercice.groupes.find((candidat) => candidat.id === placement.groupe);
    if (!groupe) throw new GroupeInconnu(placement.groupe);
    return groupe;
  }
}

class EtiquettesDOrdre extends EtiquettesAPlacer {
  constructor(exercice: ExerciceOrdre, etiquettesMelangees: readonly string[]) {
    super(etiquettesMelangees, EtiquettesAPlacer.questionsDOrdre(exercice));
  }

  protected questionVisee(): QuestionAPlacer {
    const question = this.questions.find((candidate) => !candidate.reussie);
    if (!question) throw new PasDeQuestionEnCours();
    return question;
  }

  protected estBienPlacee(question: QuestionAPlacer, placement: Placement): boolean {
    return question.etiquette === placement.etiquette;
  }

  override etiquetteViseeParJeNeSaisPas(): undefined {
    return undefined;
  }

  protected questionPourJeNeSaisPas(): QuestionAPlacer {
    return this.questionVisee();
  }

  protected bonneReponseDe(question: QuestionAPlacer): string {
    return question.etiquette;
  }

  protected aideApresErreur(): string {
    return this.nombreReussies === 0 ? AIDE_DU_DEBUT : AIDE_DE_LA_SUITE;
  }

  protected override felicitationApresUneBonneEtiquette(reussies: number): boolean {
    return reussies === this.questions.length;
  }

  protected override relanceApresUneBonneEtiquette(reussies: number): string {
    return RELANCES[(reussies - 1) % RELANCES.length] as string;
  }
}
