import type { EtapeDeLecon, Lecon } from "../../catalogue/domain/index.ts";
import { Avancement } from "./avancement.ts";
import type { ChoixDeSeance } from "./choix-de-seance.ts";
import { PasDEtapeDeLeconEnCours } from "./erreurs.ts";
import type { GenerateurId } from "./generateur-id.ts";
import type { Hasard } from "./hasard.ts";
import { type PlanDeSeance, planDeSeance } from "./plan-de-seance.ts";

export type ExerciceEnCours = { readonly position: number };

export type CommencerUneSeance = {
  readonly lecon: Lecon;
  readonly enfant: string;
  readonly choix: ChoixDeSeance;
  readonly generateurId: GenerateurId;
  readonly hasard: Hasard;
};

export class Seance {
  private etapesPassees = 0;

  private constructor(
    readonly id: string,
    readonly enfant: string,
    readonly lecon: string,
    readonly plan: PlanDeSeance,
    private readonly avancementInitial: Avancement,
  ) {}

  static commencer({ lecon, enfant, choix, generateurId }: CommencerUneSeance): Seance {
    const plan = planDeSeance(lecon, choix);
    return new Seance(generateurId.suivant(), enfant, lecon.id, plan, Avancement.initial(lecon, plan));
  }

  etapeDeLeconEnCours(): EtapeDeLecon | undefined {
    return this.plan.etapes[this.etapesPassees];
  }

  exerciceEnCours(): ExerciceEnCours | undefined {
    if (this.etapeDeLeconEnCours() !== undefined) return undefined;
    const position = this.plan.positionsDesExercices[0];
    return position === undefined ? undefined : { position };
  }

  continuer(): void {
    if (this.etapeDeLeconEnCours() === undefined) throw new PasDEtapeDeLeconEnCours();
    this.etapesPassees += 1;
  }

  avancement(): Avancement {
    return this.avancementInitial;
  }
}
