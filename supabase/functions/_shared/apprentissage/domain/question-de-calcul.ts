import type { Operation } from "../../catalogue/domain/index.ts";
import { aideApresUneErreurDeCalcul } from "./astuce-de-l-operation.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { JeNeSaisPasDejaDit, QuestionDejaReussie, ReponseIncompatible } from "./erreurs.ts";
import { choixAutourDuResultat } from "./mode-de-reponse.ts";
import { carteDuCalcul, phraseDuCalcul } from "./exercices/phrases-du-calcul.ts";
import { type AideDonnee, QuestionJouee } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import type { ReponseDonnee, ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import type { Tireur } from "./tireur.ts";

type ReponseDeCalcul = ReponseEnNombre | ReponseParChoix;

export type CalculEnCours = Readonly<{
  carte: string;
  phrase: string;
  mode: { genre: "choix"; choix: readonly string[] } | { genre: "clavierDeCristaux" };
  jeNeSaisPasPropose: boolean;
  reponseATaper?: string;
}>;

type Identite = Readonly<{ type: "calcul" | "colonne"; cle: CleDeQuestion }>;

function identiteDuCalcul(operation: Operation): Identite {
  return { type: "calcul", cle: CleDeQuestion.de("calcul", operation.q) };
}

export class QuestionDeCalcul implements QuestionPosee {
  readonly type: Identite["type"];
  readonly cle: CleDeQuestion;
  private nombreDErreurs = 0;
  private estReussie = false;
  private jeNeSaisPasDejaDit = false;
  private readonly reponsesDonnees: ReponseDonnee[] = [];

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
    nombresProposes: readonly number[] = choixAutourDuResultat(operation.r),
    identite: Identite = identiteDuCalcul(operation),
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

  get enonce(): string {
    return this.operation.q;
  }

  get erreurs(): number {
    return this.auxChoix?.erreurs ?? this.nombreDErreurs;
  }

  get reussie(): boolean {
    return this.auxChoix?.reussie ?? this.estReussie;
  }

  get bonneReponseMontree(): boolean {
    return this.auxChoix?.bonneReponseMontree ?? this.jeNeSaisPasDejaDit;
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
    if (this.auxChoix) return { ...base, mode: { genre: "choix", choix: this.auxChoix.choix.textes() } };
    const mode = { genre: "clavierDeCristaux" } as const;
    if (this.jeNeSaisPasDejaDit) return { ...base, mode, reponseATaper: String(this.operation.r) };
    return { ...base, mode };
  }

  tirage(): string[] {
    return this.auxChoix?.tirage() ?? [];
  }

  reponses(): ReponseDonnee[] {
    return this.auxChoix?.reponses() ?? [...this.reponsesDonnees];
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
    if (this.estReussie) throw new QuestionDejaReussie();
    if (this.jeNeSaisPasDejaDit) throw new JeNeSaisPasDejaDit();
    this.jeNeSaisPasDejaDit = true;
    this.reponsesDonnees.push({ genre: "jeNeSaisPas" });
    if (this.nombreDErreurs === 0) this.nombreDErreurs = 1;
    return { aide: this.aideApresErreur(), bonneReponse: String(this.operation.r), maniere: "briller" };
  }

  private repondreAuClavier(reponse: ReponseEnNombre): ResultatDeReponse {
    if (this.estReussie) throw new QuestionDejaReussie();
    this.reponsesDonnees.push(reponse);
    if (reponse.valeur === this.operation.r) {
      this.estReussie = true;
      return "juste";
    }
    if (!this.jeNeSaisPasDejaDit) this.nombreDErreurs++;
    return "fausse";
  }
}
