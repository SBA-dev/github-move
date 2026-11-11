import { cleDuCalcul } from "./cles-des-questions.ts";
import type { Niveau, Operation } from "../../catalogue/domain/index.ts";
import { aideApresUneErreurDeCalcul } from "./astuce-de-l-operation.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { ReponseIncompatible } from "./erreurs.ts";
import { JeuAuClavier } from "./jeu-au-clavier.ts";
import { choixAutourDuResultat, ModeDeReponse } from "./mode-de-reponse.ts";
import { carteDuCalcul, phraseDuCalcul } from "./exercices/phrases-du-calcul.ts";
import { type AideDonnee, QuestionJouee } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import type { ReponseDonnee, ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import type { Tireur } from "./tireur.ts";

type ReponseDeCalcul = ReponseEnNombre | ReponseParChoix;

export type CalculEnCours = Readonly<{
  carte: string;
  phrase: string;
  mode: { genre: "choix"; choix: readonly string[]; ecartes: readonly string[] } | { genre: "clavierDeCristaux" };
  jeNeSaisPasPropose: boolean;
  reponseATaper?: string;
}>;

export type Identite = Readonly<{ type: "calcul" | "colonne" | "boite" | "barres"; cle: CleDeQuestion }>;

function identiteDuCalcul(operation: Operation): Identite {
  return { type: "calcul", cle: cleDuCalcul(operation.q) };
}

type OptionsDeChoix = Readonly<{ nombresProposes?: readonly number[]; identite?: Identite }>;

export class QuestionDeCalcul implements QuestionPosee {
  readonly type: Identite["type"];
  readonly cle: CleDeQuestion;
  private readonly auClavier = new JeuAuClavier();

  private constructor(
    private readonly operation: Operation,
    private readonly auxChoix: QuestionJouee | undefined,
    identite: Identite,
  ) {
    this.type = identite.type;
    this.cle = identite.cle;
  }

  static auClavier(operation: Operation, identite: Identite = identiteDuCalcul(operation)): QuestionDeCalcul {
    return new QuestionDeCalcul(operation, undefined, identite);
  }

  static avecLesChoix(
    operation: Operation,
    tireur: Tireur,
    { nombresProposes = choixAutourDuResultat(operation.r), identite = identiteDuCalcul(operation) }: OptionsDeChoix =
      {},
  ): QuestionDeCalcul {
    const textes = nombresProposes.map(String);
    const bonneReponse = String(operation.r);
    const question = QuestionJouee.aChoix({
      cle: identite.cle,
      enonce: operation.q,
      choix: tireur.choix(textes, bonneReponse),
      bonneReponse,
      type: "bulles",
      complements: { aide: aideApresUneErreurDeCalcul(operation) },
    });
    return new QuestionDeCalcul(operation, question, identite);
  }

  static pour(operation: Operation, tireur: Tireur, niveau: Niveau): QuestionDeCalcul {
    return ModeDeReponse.pour(niveau).genre === "choix"
      ? QuestionDeCalcul.avecLesChoix(operation, tireur)
      : QuestionDeCalcul.auClavier(operation);
  }

  get enonce(): string {
    return this.operation.q;
  }

  get erreurs(): number {
    return this.auxChoix?.erreurs ?? this.auClavier.erreurs;
  }

  get reussie(): boolean {
    return this.auxChoix?.reussie ?? this.auClavier.reussi;
  }

  get bonneReponseMontree(): boolean {
    return this.auxChoix?.bonneReponseMontree ?? this.auClavier.jeNeSaisPasDejaDit;
  }

  aideApresErreur(): string | undefined {
    return aideApresUneErreurDeCalcul(this.operation);
  }

  enCours(): CalculEnCours {
    const base = {
      carte: carteDuCalcul(this.operation),
      phrase: phraseDuCalcul(this.operation),
      jeNeSaisPasPropose: !this.reussie && !this.bonneReponseMontree,
    };
    if (this.auxChoix) {
      return {
        ...base,
        mode: { genre: "choix", choix: this.auxChoix.choix.textes(), ecartes: this.auxChoix.choix.ecartes() },
      };
    }
    const mode = { genre: "clavierDeCristaux" } as const;
    if (this.auClavier.jeNeSaisPasDejaDit) return { ...base, mode, reponseATaper: String(this.operation.r) };
    return { ...base, mode };
  }

  tirage(): string[] {
    return this.auxChoix?.tirage() ?? [];
  }

  reponses(): ReponseDonnee[] {
    return this.auxChoix?.reponses() ?? this.auClavier.reponses();
  }

  repondre(reponse: ReponseDeCalcul): ResultatDeReponse {
    if (this.auxChoix) {
      if (reponse.genre === "nombre") throw new ReponseIncompatible(reponse.genre);
      return this.auxChoix.repondre(reponse);
    }
    if (reponse.genre === "choix") throw new ReponseIncompatible(reponse.genre);
    return this.repondreAuClavier(reponse);
  }

  direJeNeSaisPas(): AideDonnee {
    if (this.auxChoix) return this.auxChoix.direJeNeSaisPas();
    this.auClavier.direJeNeSaisPas();
    return { aide: this.aideApresErreur(), bonneReponse: String(this.operation.r), maniere: "briller" };
  }

  private repondreAuClavier(reponse: ReponseEnNombre): ResultatDeReponse {
    return this.auClavier.repondre(reponse, () => reponse.valeur === this.operation.r);
  }
}
