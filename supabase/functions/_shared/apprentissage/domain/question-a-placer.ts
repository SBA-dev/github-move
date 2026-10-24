import type { CleDeQuestion } from "./cle-de-question.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import { JeNeSaisPasDejaDit } from "./erreurs.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { Placement, ReponseDonnee } from "./reponse.ts";

type Cible = Readonly<{ groupe?: string; aide?: string }>;

export class QuestionAPlacer implements QuestionSuivie {
  private nombreDErreurs = 0;
  private estReussie = false;
  private jeNeSaisPasDejaDit = false;
  private readonly reponsesDonnees: ReponseDonnee[] = [];

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
    return this.jeNeSaisPasDejaDit;
  }

  reponses(): ReponseDonnee[] {
    return [...this.reponsesDonnees];
  }

  enregistrer(placement: Placement, estJuste: boolean): void {
    this.reponsesDonnees.push(placement);
    if (estJuste) this.estReussie = true;
    else if (!this.jeNeSaisPasDejaDit) this.nombreDErreurs++;
  }

  direJeNeSaisPas(bonneReponse: string): AideDonnee {
    if (this.jeNeSaisPasDejaDit) throw new JeNeSaisPasDejaDit();
    this.jeNeSaisPasDejaDit = true;
    this.reponsesDonnees.push({ genre: "jeNeSaisPas" });
    if (this.nombreDErreurs === 0) this.nombreDErreurs = 1;
    return { aide: this.aide, bonneReponse, maniere: "briller" };
  }
}
