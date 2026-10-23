import type { EtapeDeLecon, Lecon } from "../../catalogue/domain/index.ts";
import type { ChoixDeSeance } from "./choix-de-seance.ts";
import { Avancement } from "./avancement.ts";
import { PasDeQuestionEnCours, PasDEtapeDeLeconEnCours, SeanceDejaFinie } from "./erreurs.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import { ExerciceJoue } from "./exercice-joue.ts";
import type { GenerateurId } from "./generateur-id.ts";
import type { Hasard } from "./hasard.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";
import { PlanDeSeance } from "./plan-de-seance.ts";
import { type AideDonnee, questionsJoueesDe } from "./question-jouee.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";
import { SeanceId } from "./seance-id.ts";

export type FaitDeSeance =
  | Readonly<{ type: "EtapesDeLeconFinies" }>
  | Readonly<{ type: "ExerciceSuivantCommence"; titre: string }>;

export class Seance {
  private indexDeLEtape = 0;
  private indexDeLExercice = 0;
  private faits: FaitDeSeance[] = [];

  private constructor(
    readonly id: SeanceId,
    readonly enfant: string,
    readonly lecon: string,
    readonly choix: ChoixDeSeance,
    readonly plan: PlanDeSeance,
    private readonly exercices: readonly ExerciceJoue[],
  ) {}

  static commencer(
    generateurId: GenerateurId,
    hasard: Hasard,
    enfant: string,
    lecon: Lecon,
    choix: ChoixDeSeance,
  ): Seance {
    const plan = PlanDeSeance.pour(lecon, choix);
    const exercices = lecon.exercices
      .map((exercice, position) => ({ exercice, position }))
      .filter(({ position }) => plan.positionsDesExercices.includes(position))
      .map(({ exercice, position }) =>
        new ExerciceJoue(
          position,
          exercice.titre,
          nombreDeQuestions(exercice),
          questionsJoueesDe(exercice, hasard),
        )
      );
    return new Seance(SeanceId.de(generateurId.nouveau()), enfant, lecon.id, choix, plan, exercices);
  }

  etapeDeLeconEnCours(): EtapeDeLecon | undefined {
    return this.plan.etapes[this.indexDeLEtape];
  }

  exerciceEnCours(): ExerciceJoue | undefined {
    if (this.etapeDeLeconEnCours()) return undefined;
    return this.exercices[this.indexDeLExercice];
  }

  avancement(): Avancement {
    const reussies = this.exercices.reduce((somme, exercice) => somme + exercice.questionsReussies, 0);
    const total = this.exercices.reduce((somme, exercice) => somme + exercice.questions, 0);
    return new Avancement(reussies, total);
  }

  estFinie(): boolean {
    return this.indexDeLExercice >= this.exercices.length;
  }

  repondre(reponse: Reponse): ResultatDeReponse {
    const exercice = this.exerciceDeLaQuestionEnCours();
    const resultat = exercice.repondre(reponse);
    this.avancerSiExerciceReussi(exercice);
    return resultat;
  }

  direJeNeSaisPas(): AideDonnee {
    const question = this.exerciceDeLaQuestionEnCours().questionEnCours();
    if (!question) throw new PasDeQuestionEnCours();
    return question.direJeNeSaisPas();
  }

  clesDesQuestionsRatees(): CleDeQuestion[] {
    return this.exercices.flatMap((exercice) => exercice.questionsRatees().map((question) => question.cle));
  }

  continuer(): void {
    if (!this.etapeDeLeconEnCours()) throw new PasDEtapeDeLeconEnCours();
    this.indexDeLEtape++;
    if (!this.etapeDeLeconEnCours()) this.faits.push({ type: "EtapesDeLeconFinies" });
  }

  private exerciceDeLaQuestionEnCours(): ExerciceJoue {
    if (this.estFinie()) throw new SeanceDejaFinie();
    const exercice = this.exerciceEnCours();
    if (!exercice) throw new PasDeQuestionEnCours();
    return exercice;
  }

  private avancerSiExerciceReussi(exercice: ExerciceJoue): void {
    if (exercice.estReussi()) this.passerALExerciceSuivant();
  }

  private passerALExerciceSuivant(): void {
    this.indexDeLExercice++;
    const suivant = this.exerciceEnCours();
    if (suivant?.titre) this.faits.push({ type: "ExerciceSuivantCommence", titre: suivant.titre });
  }

  retirerFaits(): FaitDeSeance[] {
    const faits = this.faits;
    this.faits = [];
    return faits;
  }
}
