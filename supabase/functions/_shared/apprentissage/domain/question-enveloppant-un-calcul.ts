import type { Niveau, Operation } from "../../catalogue/domain/index.ts";
import { ModeDeReponse } from "./mode-de-reponse.ts";
import { type CalculEnCours, type Identite, QuestionDeCalcul } from "./question-de-calcul.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import type { ReponseDonnee, ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import type { Tireur } from "./tireur.ts";

export function calculAuNiveau(
  operation: Operation,
  identite: Identite,
  tireur: Tireur,
  niveau: Niveau,
): QuestionDeCalcul {
  const auxChoix = ModeDeReponse.pour(niveau, operation.r).genre === "choix";
  return auxChoix
    ? QuestionDeCalcul.avecLesChoix(operation, tireur, undefined, identite)
    : QuestionDeCalcul.auClavier(operation, identite);
}

/** Une question qui se joue comme un calcul : même mode de réponse, même « Je ne sais pas », même suivi. */
export abstract class QuestionEnveloppantUnCalcul implements QuestionPosee {
  protected constructor(private readonly calcul: QuestionDeCalcul) {}

  get type() {
    return this.calcul.type;
  }

  get cle() {
    return this.calcul.cle;
  }

  get enonce(): string {
    return this.calcul.enonce;
  }

  get erreurs(): number {
    return this.calcul.erreurs;
  }

  get reussie(): boolean {
    return this.calcul.reussie;
  }

  get bonneReponseMontree(): boolean {
    return this.calcul.bonneReponseMontree;
  }

  protected modeEnCours(): Pick<CalculEnCours, "mode" | "jeNeSaisPasPropose" | "reponseATaper"> {
    const { mode, jeNeSaisPasPropose, reponseATaper } = this.calcul.enCours();
    return { mode, jeNeSaisPasPropose, reponseATaper };
  }

  tirage(): string[] {
    return this.calcul.tirage();
  }

  reponses(): ReponseDonnee[] {
    return this.calcul.reponses();
  }

  aideApresErreur(): string | undefined {
    return this.calcul.aideApresErreur();
  }

  repondre(reponse: ReponseParChoix | ReponseEnNombre): ResultatDeReponse {
    return this.calcul.repondre(reponse);
  }

  direJeNeSaisPas(): AideDonnee {
    return this.calcul.direJeNeSaisPas();
  }
}
