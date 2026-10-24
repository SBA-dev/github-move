import type { ExerciceMemoriser, Segment } from "../../catalogue/domain/index.ts";
import { type EtiquettePosee, EtiquettesAPlacer } from "./etiquettes-a-placer.ts";
import { PasDeQuestionEnCours, ReponseIncompatible } from "./erreurs.ts";
import type { ParoleDue } from "./parole-due.ts";
import { PlanDeMemorisation } from "./plan-de-memorisation.ts";
import { type AideDonnee, type QuestionJouee, questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { Placement, Reponse, ResultatDeReponse } from "./reponse.ts";
import type { Tireur } from "./tireur.ts";

export type EntrainementDeMemorisation = "ordreDesVers" | "motsCaches";

/** Une poésie à mémoriser : d'abord remettre les vers dans l'ordre, puis retrouver les mots cachés. */
export class MemorisationJouee {
  private dernierResultatDesMotsCaches: ResultatDeReponse | undefined;

  private constructor(
    private readonly ordreDesVers: EtiquettesAPlacer,
    private readonly motsCaches: readonly QuestionJouee[],
    private readonly segments: readonly Segment[],
    private readonly versSansMotCache: number,
  ) {}

  static pour(
    exercice: ExerciceMemoriser,
    tireur: Tireur,
  ): MemorisationJouee {
    const plan = PlanDeMemorisation.de(exercice);
    return new MemorisationJouee(
      EtiquettesAPlacer.pourOrdonner(plan.ordreDesVers, tireur.etiquettesMelangees(exercice.vers)),
      questionsJoueesAvec(plan.motsCaches, tireur),
      plan.motsCaches.segments,
      exercice.vers.length - plan.motsCaches.motsAttendus.length,
    );
  }

  entrainement(): EntrainementDeMemorisation {
    return this.ordreDesVers.etiquettesAPlacer().length === 0 ? "motsCaches" : "ordreDesVers";
  }

  questions(): readonly QuestionSuivie[] {
    return [...this.ordreDesVers.questions, ...this.motsCaches];
  }

  get nombreReussies(): number {
    const versSansMotCache = this.entrainement() === "motsCaches" ? this.versSansMotCache : 0;
    return this.ordreDesVers.nombreReussies + this.motsTrouves() + versSansMotCache;
  }

  segmentsAffiches(): readonly Segment[] {
    return this.entrainement() === "motsCaches" ? this.segments : [];
  }

  motsTrouves(): number {
    return this.motsCaches.filter((question) => question.reussie).length;
  }

  questionEnCours(): QuestionJouee | undefined {
    return this.entrainement() === "motsCaches" ? this.motCacheEnCours() : undefined;
  }

  etiquettesAPlacer(): string[] {
    return this.ordreDesVers.etiquettesAPlacer();
  }

  etiquettesPosees(): EtiquettePosee[] {
    return this.ordreDesVers.etiquettesPosees();
  }

  etiquetteViseeParJeNeSaisPas(choisie?: string): string | undefined {
    return this.ordreDesVers.etiquetteViseeParJeNeSaisPas(choisie);
  }

  repondre(reponse: Reponse): ResultatDeReponse {
    if (reponse.genre === "placement") return this.placer(reponse);
    if (reponse.genre === "motEcrit") throw new ReponseIncompatible(reponse.genre);
    this.dernierResultatDesMotsCaches = this.motCacheAReussir().repondre(reponse);
    return this.dernierResultatDesMotsCaches;
  }

  direJeNeSaisPas(etiquette?: string): AideDonnee {
    if (this.entrainement() === "ordreDesVers") return this.ordreDesVers.direJeNeSaisPas(etiquette);
    return this.motCacheAReussir().direJeNeSaisPas();
  }

  aideApresLaDerniereErreur(): string | undefined {
    return this.ordreDesVers.aideApresLaDerniereErreur();
  }

  paroleDueApresLaDerniereReponse(): ParoleDue | undefined {
    if (this.entrainement() === "ordreDesVers" || this.dernierResultatDesMotsCaches === undefined) {
      return this.ordreDesVers.paroleDueApresLaDerniereReponse();
    }
    return this.dernierResultatDesMotsCaches === "juste" ? "felicitation" : undefined;
  }

  derniereReponseTrouveLeDernierMot(): boolean {
    return this.dernierResultatDesMotsCaches === "juste" && this.motCacheEnCours() === undefined;
  }

  private placer(placement: Placement): ResultatDeReponse {
    return this.ordreDesVers.placer(placement);
  }

  private motCacheEnCours(): QuestionJouee | undefined {
    return this.motsCaches.find((question) => !question.reussie);
  }

  private motCacheAReussir(): QuestionJouee {
    const question = this.questionEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    return question;
  }
}
