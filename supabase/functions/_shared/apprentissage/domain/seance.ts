import type { EtapeDeLecon, Lecon } from "../../catalogue/domain/index.ts";
import type { ChoixDeSeance } from "./choix-de-seance.ts";
import { PasDEtapeDeLeconEnCours } from "./erreurs.ts";
import type { GenerateurId } from "./generateur-id.ts";
import { PlanDeSeance } from "./plan-de-seance.ts";
import { SeanceId } from "./seance-id.ts";

export type FaitDeSeance = Readonly<{ type: "EtapesDeLeconFinies" }>;

export type ExerciceEnCours = Readonly<{ position: number }>;

export class Seance {
  private indexDeLEtape = 0;
  private faits: FaitDeSeance[] = [];

  private constructor(
    readonly id: SeanceId,
    readonly enfant: string,
    readonly lecon: string,
    readonly choix: ChoixDeSeance,
    readonly plan: PlanDeSeance,
  ) {}

  static commencer(generateurId: GenerateurId, enfant: string, lecon: Lecon, choix: ChoixDeSeance): Seance {
    const plan = PlanDeSeance.pour(lecon, choix);
    return new Seance(SeanceId.de(generateurId.nouveau()), enfant, lecon.id, choix, plan);
  }

  etapeDeLeconEnCours(): EtapeDeLecon | undefined {
    return this.plan.etapes[this.indexDeLEtape];
  }

  exerciceEnCours(): ExerciceEnCours | undefined {
    if (this.etapeDeLeconEnCours()) return undefined;
    const position = this.plan.positionsDesExercices[0];
    return position === undefined ? undefined : { position };
  }

  continuer(): void {
    if (!this.etapeDeLeconEnCours()) throw new PasDEtapeDeLeconEnCours();
    this.indexDeLEtape++;
    if (!this.etapeDeLeconEnCours()) this.faits.push({ type: "EtapesDeLeconFinies" });
  }

  retirerFaits(): FaitDeSeance[] {
    const faits = this.faits;
    this.faits = [];
    return faits;
  }
}
