import type { CleDeQuestion } from "./cle-de-question.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { Placement, ReponseDonnee } from "./reponse.ts";

type Cible = Readonly<{ groupe?: string; aide?: string }>;

export class QuestionAPlacer implements QuestionSuivie {
  private nombreDErreurs = 0;
  private estReussie = false;
  private readonly placements: Placement[] = [];

  constructor(
    readonly cle: CleDeQuestion,
    readonly type: "classer" | "ordre",
    readonly etiquette: string,
    private readonly cible: Cible = {},
  ) {}

  get groupe(): string | undefined {
    return this.cible.groupe;
  }

  get aide(): string | undefined {
    return this.cible.aide;
  }

  get erreurs(): number {
    return this.nombreDErreurs;
  }

  get reussie(): boolean {
    return this.estReussie;
  }

  get bonneReponseMontree(): boolean {
    return false;
  }

  reponses(): ReponseDonnee[] {
    return [...this.placements];
  }

  enregistrer(placement: Placement, estJuste: boolean): void {
    this.placements.push(placement);
    if (estJuste) this.estReussie = true;
    else this.nombreDErreurs++;
  }
}
