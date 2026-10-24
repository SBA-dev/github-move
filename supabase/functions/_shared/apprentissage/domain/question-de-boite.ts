import type { ItemDeBoite, Niveau } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { aideDeLaBoite, deroulementDeLaBoite, ouvertureDeLaBoite } from "./exercices/boite.ts";
import { ModeDeReponse } from "./mode-de-reponse.ts";
import { type AideDonnee } from "./question-jouee.ts";
import { type CalculEnCours, QuestionDeCalcul } from "./question-de-calcul.ts";
import type { QuestionPosee } from "./question-posee.ts";
import type { ReponseDonnee, ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import type { Tireur } from "./tireur.ts";

export type BoiteEnCours = Readonly<{
  deroulement: readonly string[];
  mode: CalculEnCours["mode"];
  jeNeSaisPasPropose: boolean;
  reponseATaper?: string;
}>;

export type BoiteOuverte = Readonly<{ deroulement: readonly string[]; jetons: number; ouverture: string }>;

/** Une boîte à jetons se joue comme un calcul : même clé de révision, mêmes modes de réponse. */
export class QuestionDeBoite implements QuestionPosee {
  private constructor(private readonly item: ItemDeBoite, private readonly calcul: QuestionDeCalcul) {}

  static pour(item: ItemDeBoite, tireur: Tireur, niveau: Niveau): QuestionDeBoite {
    const operation = { q: calculSansResultat(item), r: item.reponse, aide: aideDeLaBoite(item) };
    const identite = { type: "boite", cle: CleDeQuestion.de("boite", operation.q) } as const;
    const auxChoix = ModeDeReponse.pour(niveau, item.reponse).genre === "choix";
    const calcul = auxChoix
      ? QuestionDeCalcul.avecLesChoix(operation, tireur, undefined, identite)
      : QuestionDeCalcul.auClavier(operation, identite);
    return new QuestionDeBoite(item, calcul);
  }

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

  enCours(): BoiteEnCours {
    const { mode, jeNeSaisPasPropose, reponseATaper } = this.calcul.enCours();
    return { deroulement: deroulementDeLaBoite(this.item), mode, jeNeSaisPasPropose, reponseATaper };
  }

  ouverte(): BoiteOuverte {
    return {
      deroulement: deroulementDeLaBoite(this.item),
      jetons: this.item.reponse,
      ouverture: ouvertureDeLaBoite(this.item),
    };
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

function calculSansResultat({ ecriture }: ItemDeBoite): string {
  return ecriture.slice(0, ecriture.lastIndexOf(" = "));
}
