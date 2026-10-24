import type { ColonneDAdditionPosee } from "./addition-posee.ts";
import { PasDeQuestionEnCours } from "./erreurs.ts";
import { choixAutourDuResultat, type ModeDeReponse } from "./mode-de-reponse.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import type { Rang } from "./rangs-d-addition.ts";
import type { ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import type { Tireur } from "./tireur.ts";

const RETENUE_OUBLIEE = "Tu as oublié la retenue, tout en haut de la maison !";
const NOMS_DES_RANGS: Record<Rang, readonly [string, string]> = {
  unites: ["unité", "unités"],
  dizaines: ["dizaine", "dizaines"],
  centaines: ["centaine", "centaines"],
};

type Retenues = Partial<Record<Rang, number>>;

export class EtapeCalculer {
  private indice = 0;
  private question: QuestionDeCalcul | undefined;
  private fautesDesColonnesTerminees = 0;
  private resultat = "";
  private parole: string | undefined;
  private derniereAide: string | undefined;
  private readonly retenuesPosees: Retenues = {};

  private constructor(
    private readonly nombres: readonly number[],
    private readonly colonnes: readonly ColonneDAdditionPosee[],
    private readonly mode: ModeDeReponse,
    private readonly tireur: Tireur,
  ) {}

  static pour(
    nombres: readonly number[],
    colonnes: readonly ColonneDAdditionPosee[],
    mode: ModeDeReponse,
    tireur: Tireur,
  ): EtapeCalculer {
    return new EtapeCalculer(nombres, colonnes, mode, tireur);
  }

  get terminee(): boolean {
    return this.indice >= this.colonnes.length;
  }

  get colonneEnCours(): ColonneDAdditionPosee {
    const colonne = this.colonnes[this.indice];
    if (!colonne) throw new PasDeQuestionEnCours();
    return colonne;
  }

  get questionEnCours(): QuestionDeCalcul {
    this.question ??= this.poserLaQuestion(this.colonneEnCours);
    return this.question;
  }

  get resultatEcrit(): string {
    return this.resultat;
  }

  get retenues(): Readonly<Retenues> {
    return { ...this.retenuesPosees };
  }

  get erreurs(): number {
    return this.fautesDesColonnesTerminees + (this.question?.erreurs ?? 0);
  }

  get paroleApresLaDerniereReponse(): string | undefined {
    return this.parole;
  }

  aideApresLaDerniereErreur(): string | undefined {
    return this.derniereAide;
  }

  repondre(reponse: ReponseParChoix | ReponseEnNombre): ResultatDeReponse {
    const question = this.questionEnCours;
    const somme = this.sommeDeLaColonne(this.colonneEnCours);
    const resultat = question.repondre(reponse);
    if (resultat === "juste") this.validerLaColonne(somme);
    else this.derniereAide = this.aideApresUneFausseReponse(reponse, somme);
    return resultat;
  }

  private validerLaColonne(somme: number): void {
    const colonne = this.colonneEnCours;
    const suivante = this.colonnes[this.indice + 1];
    this.derniereAide = undefined;
    if (suivante) {
      this.avancerVers(colonne, suivante, somme);
    } else {
      this.resultat = `${somme}${this.resultat}`;
      this.parole = `${this.nombres.join(" + ")} = ${this.resultat}.`;
    }
    this.fautesDesColonnesTerminees += this.questionEnCours.erreurs;
    this.question = undefined;
    this.indice++;
  }

  private avancerVers(colonne: ColonneDAdditionPosee, suivante: ColonneDAdditionPosee, somme: number): void {
    const retenue = Math.floor(somme / 10);
    const chiffre = somme % 10;
    this.resultat = `${chiffre}${this.resultat}`;
    if (retenue === 0) {
      this.parole = undefined;
      return;
    }
    this.retenuesPosees[suivante.rang] = retenue;
    this.parole = `${somme}, c'est ${quantite(retenue, suivante.rang)} et ${quantite(chiffre, colonne.rang)} ! ` +
      `J'écris ${chiffre}, et ${retenue} monte en retenue.`;
  }

  private sommeDeLaColonne(colonne: ColonneDAdditionPosee): number {
    return this.termesDeLaColonne(colonne).reduce((total, terme) => total + terme, 0);
  }

  private termesDeLaColonne(colonne: ColonneDAdditionPosee): number[] {
    const retenue = this.retenuesPosees[colonne.rang] ?? 0;
    return retenue === 0 ? [...colonne.chiffres] : [retenue, ...colonne.chiffres];
  }

  private poserLaQuestion(colonne: ColonneDAdditionPosee): QuestionDeCalcul {
    const somme = this.sommeDeLaColonne(colonne);
    const expression = this.termesDeLaColonne(colonne).join(" + ");
    const operation = { q: expression, r: somme, aide: `Compte doucement : ${expression}.` };
    if (this.mode.genre === "clavierDeCristaux") return QuestionDeCalcul.auClavier(operation);
    const dernierChoix = somme >= 10 ? somme - 10 : somme + 2;
    return QuestionDeCalcul.avecLesChoix(operation, this.tireur, choixAutourDuResultat(somme, dernierChoix));
  }

  private aideApresUneFausseReponse(reponse: ReponseParChoix | ReponseEnNombre, somme: number): string | undefined {
    const valeur = reponse.genre === "nombre" ? reponse.valeur : Number(reponse.texte);
    const retenue = this.retenuesPosees[this.colonneEnCours.rang] ?? 0;
    if (retenue !== 0 && valeur === somme - retenue) return RETENUE_OUBLIEE;
    return this.questionEnCours.aideApresErreur();
  }
}

function quantite(nombre: number, rang: Rang): string {
  const [singulier, pluriel] = NOMS_DES_RANGS[rang];
  return `${nombre} ${nombre > 1 ? pluriel : singulier}`;
}
