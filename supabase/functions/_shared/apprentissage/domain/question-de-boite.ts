import type { ItemDeBoite, Niveau } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { aideDeLaBoite, deroulementDeLaBoite, ouvertureDeLaBoite } from "./exercices/boite.ts";
import type { CalculEnCours } from "./question-de-calcul.ts";
import { calculAuNiveau, QuestionEnveloppantUnCalcul } from "./question-enveloppant-un-calcul.ts";
import type { Tireur } from "./tireur.ts";

export type BoiteEnCours = Readonly<{
  deroulement: readonly string[];
  mode: CalculEnCours["mode"];
  jeNeSaisPasPropose: boolean;
  reponseATaper?: string;
}>;

export type BoiteOuverte = Readonly<{ deroulement: readonly string[]; jetons: number; ouverture: string }>;

/** Une boîte à jetons se joue comme un calcul : même clé de révision, mêmes modes de réponse. */
export class QuestionDeBoite extends QuestionEnveloppantUnCalcul {
  private constructor(private readonly item: ItemDeBoite, calcul: ReturnType<typeof calculDeLaBoite>) {
    super(calcul);
  }

  static pour(item: ItemDeBoite, tireur: Tireur, niveau: Niveau): QuestionDeBoite {
    return new QuestionDeBoite(item, calculDeLaBoite(item, tireur, niveau));
  }

  enCours(): BoiteEnCours {
    return { deroulement: deroulementDeLaBoite(this.item), ...this.modeEnCours() };
  }

  ouverte(): BoiteOuverte {
    return {
      deroulement: deroulementDeLaBoite(this.item),
      jetons: this.item.reponse,
      ouverture: ouvertureDeLaBoite(this.item),
    };
  }
}

function calculDeLaBoite(item: ItemDeBoite, tireur: Tireur, niveau: Niveau) {
  const operation = { q: calculSansResultat(item), r: item.reponse, aide: aideDeLaBoite(item) };
  const identite = { type: "boite", cle: CleDeQuestion.de("boite", operation.q) } as const;
  return calculAuNiveau(operation, identite, tireur, niveau);
}

function calculSansResultat({ ecriture }: ItemDeBoite): string {
  return ecriture.slice(0, ecriture.lastIndexOf(" = "));
}
