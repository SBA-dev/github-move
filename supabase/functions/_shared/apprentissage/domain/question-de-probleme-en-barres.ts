import type { FormeDeSchema, Niveau, ProblemeEnBarres } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { descriptionDuSchema } from "./description-du-schema.ts";
import { aideDesBarres, explicationDeLaReponseEnBarres, explicationDuSchema } from "./exercices/barres.ts";
import type { CalculEnCours } from "./question-de-calcul.ts";
import { calculAuNiveau, QuestionEnveloppantUnCalcul } from "./question-enveloppant-un-calcul.ts";
import type { Tireur } from "./tireur.ts";

export type SchemaEnCours = Readonly<{
  enonce: string;
  explicationDuSchema: string;
  forme: FormeDeSchema;
  description: string;
  mode: CalculEnCours["mode"];
  jeNeSaisPasPropose: boolean;
  reponseATaper?: string;
}>;

export type SchemaResolu = Readonly<{ forme: FormeDeSchema; reponse: number; explication: string }>;

/** Un problème en barres se joue comme un calcul : même clé de révision, mêmes modes de réponse. */
export class QuestionDeProblemeEnBarres extends QuestionEnveloppantUnCalcul {
  private constructor(private readonly probleme: ProblemeEnBarres, calcul: ReturnType<typeof calculDuProbleme>) {
    super(calcul);
  }

  static pour(probleme: ProblemeEnBarres, tireur: Tireur, niveau: Niveau): QuestionDeProblemeEnBarres {
    return new QuestionDeProblemeEnBarres(probleme, calculDuProbleme(probleme, tireur, niveau));
  }

  enCours(): SchemaEnCours {
    const { enonce, forme } = this.probleme;
    return {
      enonce,
      explicationDuSchema: explicationDuSchema(),
      forme,
      description: descriptionDuSchema(forme),
      ...this.modeEnCours(),
    };
  }

  resolu(): SchemaResolu {
    const { forme, reponse } = this.probleme;
    return { forme, reponse, explication: explicationDeLaReponseEnBarres(this.probleme) };
  }
}

function calculDuProbleme(probleme: ProblemeEnBarres, tireur: Tireur, niveau: Niveau) {
  const operation = { q: probleme.enonce, r: probleme.reponse, aide: aideDesBarres(probleme) };
  const identite = { type: "barres", cle: CleDeQuestion.de("barres", probleme.enonce) } as const;
  return calculAuNiveau(operation, identite, tireur, niveau);
}
