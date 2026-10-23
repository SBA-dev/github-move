import type { EtapeDeLecon, Lecon } from "../../catalogue/domain/index.ts";
import type { ChoixDeSeance } from "./choix-de-seance.ts";
import { Avancement } from "./avancement.ts";
import { PasDeQuestionEnCours, PasDEtapeDeLeconEnCours, SeanceDejaFinie } from "./erreurs.ts";
import { ExerciceJoue } from "./exercice-joue.ts";
import type { GenerateurId } from "./generateur-id.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";
import { PlanDeSeance } from "./plan-de-seance.ts";
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

  static commencer(generateurId: GenerateurId, enfant: string, lecon: Lecon, choix: ChoixDeSeance): Seance {
    const plan = PlanDeSeance.pour(lecon, choix);
    const exercices = lecon.exercices
      .map((exercice, position) => new ExerciceJoue(position, exercice.titre, nombreDeQuestions(exercice)))
      .filter((joue) => plan.positionsDesExercices.includes(joue.position));
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

  reussirLaQuestionEnCours(): void {
    if (this.estFinie()) throw new SeanceDejaFinie();
    const exercice = this.exerciceEnCours();
    if (!exercice) throw new PasDeQuestionEnCours();
    exercice.reussirUneQuestion();
    if (exercice.estReussi()) this.passerALExerciceSuivant();
  }

  continuer(): void {
    if (!this.etapeDeLeconEnCours()) throw new PasDEtapeDeLeconEnCours();
    this.indexDeLEtape++;
    if (!this.etapeDeLeconEnCours()) this.faits.push({ type: "EtapesDeLeconFinies" });
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
