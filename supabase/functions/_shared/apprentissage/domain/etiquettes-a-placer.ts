import type { ExerciceClasser, ExerciceOrdre, Groupe } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { EtiquetteInconnue, GroupeInconnu, PasDeQuestionEnCours } from "./erreurs.ts";
import { QuestionAPlacer } from "./question-a-placer.ts";
import type { Placement, ResultatDeReponse } from "./reponse.ts";

const RELANCES = ["Oui ! Et après ?", "Bien ! Et ensuite ?", "Super ! La suite ?"];
const AIDE_DU_DEBUT = "Ce n'est pas le début. Lequel vient en premier ?";
const AIDE_DE_LA_SUITE = "Pas encore celui-là. Lequel vient juste après ?";

export abstract class EtiquettesAPlacer {
  private restantes: string[];
  private derniereAide: string | undefined;
  private dernierResultat: ResultatDeReponse | undefined;

  protected constructor(private readonly plateau: readonly string[], readonly questions: readonly QuestionAPlacer[]) {
    this.restantes = [...plateau];
  }

  static pourClasser(exercice: ExerciceClasser, plateau: readonly string[]): EtiquettesAPlacer {
    return new EtiquettesDeClasser(exercice, plateau);
  }

  static pourOrdonner(exercice: ExerciceOrdre, plateau: readonly string[]): EtiquettesAPlacer {
    return new EtiquettesDOrdre(exercice, plateau);
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

  tirage(): string[] {
    return [...this.plateau];
  }

  get nombreReussies(): number {
    return this.questions.filter((question) => question.reussie).length;
  }

  placer(placement: Placement): ResultatDeReponse {
    const position = this.restantes.indexOf(placement.etiquette);
    if (position === -1) throw new EtiquetteInconnue(placement.etiquette);
    const question = this.questionVisee(placement);
    const estJuste = this.estBienPlacee(question, placement);
    question.enregistrer(placement, estJuste);
    if (estJuste) this.restantes.splice(position, 1);
    this.derniereAide = estJuste ? undefined : this.aideApresErreur(question, placement);
    this.dernierResultat = estJuste ? "juste" : "fausse";
    return this.dernierResultat;
  }

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

  protected abstract questionVisee(placement: Placement): QuestionAPlacer;
  protected abstract estBienPlacee(question: QuestionAPlacer, placement: Placement): boolean;
  protected abstract aideApresErreur(question: QuestionAPlacer, placement: Placement): string;

  protected felicitationApresUneBonneEtiquette(_reussies: number): boolean {
    return false;
  }

  protected relanceApresUneBonneEtiquette(_reussies: number): string | undefined {
    return undefined;
  }
}

class EtiquettesDeClasser extends EtiquettesAPlacer {
  constructor(private readonly exercice: ExerciceClasser, plateau: readonly string[]) {
    super(plateau, EtiquettesAPlacer.questionsDeClasser(exercice));
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
  constructor(exercice: ExerciceOrdre, plateau: readonly string[]) {
    super(plateau, EtiquettesAPlacer.questionsDOrdre(exercice));
  }

  protected questionVisee(): QuestionAPlacer {
    const question = this.questions.find((candidate) => !candidate.reussie);
    if (!question) throw new PasDeQuestionEnCours();
    return question;
  }

  protected estBienPlacee(question: QuestionAPlacer, placement: Placement): boolean {
    return question.etiquette === placement.etiquette;
  }

  protected aideApresErreur(): string {
    return this.nombreReussies === 0 ? AIDE_DU_DEBUT : AIDE_DE_LA_SUITE;
  }

  protected override relanceApresUneBonneEtiquette(reussies: number): string {
    return RELANCES[(reussies - 1) % RELANCES.length] as string;
  }
}
