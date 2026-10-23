import type { Hasard } from "./hasard.ts";
import { QuestionDuControleParental } from "./question-du-controle-parental.ts";

export type EtatDeLEspaceParent =
  | { type: "ferme" }
  | { type: "questionPosee"; enonce: string }
  | { type: "ouvert" };

export type ResultatDeLaReponse = "ouvert" | "refuse";

type Situation =
  | { type: "ferme" }
  | { type: "questionPosee"; question: QuestionDuControleParental }
  | { type: "ouvert" };

export class AccesALEspaceParent {
  private situation: Situation = { type: "ferme" };

  constructor(private readonly hasard: Hasard) {}

  etat(): EtatDeLEspaceParent {
    if (this.situation.type === "questionPosee") {
      return { type: "questionPosee", enonce: this.situation.question.enonce() };
    }
    return { type: this.situation.type };
  }

  demanderLEntree(): void {
    if (this.situation.type !== "ferme") return;
    this.situation = { type: "questionPosee", question: QuestionDuControleParental.tirer(this.hasard) };
  }

  repondre(saisie: string): ResultatDeLaReponse {
    if (this.situation.type === "questionPosee" && this.situation.question.estBienRepondue(saisie)) {
      this.situation = { type: "ouvert" };
      return "ouvert";
    }
    return "refuse";
  }

  ouvrirApresLaConnexion(): void {
    this.situation = { type: "ouvert" };
  }

  quitter(): void {
    this.situation = { type: "ferme" };
  }
}
