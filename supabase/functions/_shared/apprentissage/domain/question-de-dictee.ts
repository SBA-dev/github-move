import type { MotDicte } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import type { ClavierPropose } from "./clavier-propose.ts";
import { JeNeSaisPasDejaDit, PasDeLettreAEffacer, QuestionDejaReussie, ToucheDejaUtilisee } from "./erreurs.ts";
import { type CaractereDejaEcrit, type CorrectionDuMot, MotAEcrire } from "./mot-a-ecrire.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import { type MotEcrit, Reponse, type ReponseDonnee, type ResultatDeReponse } from "./reponse.ts";

const TEXTE_AFFICHE = "Écoute bien et écris le mot que tu entends.";
const AIDE_APRES_UNE_ERREUR = "Regarde les lettres en rouge et écoute encore.";

export type CaseDeQuestion = Readonly<{ genre: "aEcrire"; lettre?: string }> | CaractereDejaEcrit;

export class QuestionDeDictee implements QuestionSuivie {
  readonly type = "dictee";
  readonly cle: CleDeQuestion;
  private readonly mot: MotAEcrire;
  private lettres: string[] = [];
  private nombreDErreurs = 0;
  private estReussie = false;
  private jeNeSaisPasDejaDit = false;
  private lettreMontree: string | undefined;
  private correction: CorrectionDuMot | undefined;
  private readonly reponsesDonnees: ReponseDonnee[] = [];

  constructor(private readonly motDicte: MotDicte, private readonly clavier: ClavierPropose) {
    this.mot = MotAEcrire.de(motDicte.mot);
    this.cle = CleDeQuestion.de("dictee", motDicte.mot);
  }

  cases(): CaseDeQuestion[] {
    const affichees = this.lettreMontree === undefined ? this.lettres : [...this.lettres, this.lettreMontree];
    let rang = 0;
    return this.mot.cases().map((une) =>
      une.genre === "dejaEcrit" ? une : { genre: "aEcrire", lettre: affichees[rang++] }
    );
  }

  texteDit(): string {
    const phrase = this.motDicte.phrase ? `${this.motDicte.phrase} ` : "";
    return `Écoute bien. ${this.motDicte.mot}. ${phrase}Écris : ${this.motDicte.mot}.`;
  }

  motADire(): string {
    return this.motDicte.mot;
  }

  texteAffiche(): string {
    return TEXTE_AFFICHE;
  }

  suiteDeLaFelicitation(): string {
    return `« ${this.motDicte.mot} » est bien écrit !`;
  }

  aideApresErreur(): string | undefined {
    return this.correction?.juste === false ? AIDE_APRES_UNE_ERREUR : undefined;
  }

  derniereCorrection(): CorrectionDuMot | undefined {
    return this.correction;
  }

  taper(lettre: string): ResultatDeReponse | undefined {
    if (this.estReussie) throw new QuestionDejaReussie();
    const minuscule = lettre.toLowerCase();
    if (this.clavier.genre === "lettresDuMot" && !this.touchesDisponibles().includes(minuscule)) {
      throw new ToucheDejaUtilisee(minuscule);
    }
    this.lettreMontree = undefined;
    this.lettres.push(minuscule);
    if (this.lettres.length < this.mot.lettresAEcrire().length) return undefined;
    return this.corriger(this.lettres);
  }

  effacer(): void {
    if (this.lettres.length === 0) throw new PasDeLettreAEffacer();
    this.lettreMontree = undefined;
    this.lettres.pop();
  }

  repondre(reponse: MotEcrit): ResultatDeReponse {
    if (this.estReussie) throw new QuestionDejaReussie();
    return this.corriger(reponse.lettres);
  }

  jeNeSaisPasPermis(): boolean {
    return true;
  }

  direJeNeSaisPas(): AideDonnee {
    if (this.estReussie) throw new QuestionDejaReussie();
    if (this.jeNeSaisPasDejaDit) throw new JeNeSaisPasDejaDit();
    this.jeNeSaisPasDejaDit = true;
    this.reponsesDonnees.push({ genre: "jeNeSaisPas" });
    if (this.nombreDErreurs === 0) this.nombreDErreurs = 1;
    const attendues = this.mot.lettresAEcrire();
    const gardees = this.lettres.findIndex((lettre, rang) => lettre !== attendues[rang]);
    this.lettres = this.lettres.slice(0, gardees === -1 ? this.lettres.length : gardees);
    const prochaine = attendues[this.lettres.length] as string;
    this.lettreMontree = this.lettres.length + 1 < attendues.length ? prochaine : undefined;
    return { aide: undefined, bonneReponse: prochaine, maniere: "ecrire" };
  }

  tirage(): string[] {
    return this.clavier.tirage();
  }

  reponses(): ReponseDonnee[] {
    return [...this.reponsesDonnees];
  }

  get bonneReponseMontree(): boolean {
    return this.jeNeSaisPasDejaDit;
  }

  get erreurs(): number {
    return this.nombreDErreurs;
  }

  get reussie(): boolean {
    return this.estReussie;
  }

  private touchesDisponibles(): string[] {
    const disponibles = this.clavier.touches;
    for (const lettre of this.lettres) disponibles.splice(disponibles.indexOf(lettre), 1);
    return disponibles;
  }

  private corriger(lettres: readonly string[]): ResultatDeReponse {
    const correction = this.mot.corriger(lettres);
    this.lettreMontree = undefined;
    this.correction = correction;
    this.reponsesDonnees.push(Reponse.motEcrit([...lettres]));
    if (correction.juste) {
      this.lettres = lettres.map((lettre) => lettre.toLowerCase());
      this.estReussie = true;
      return "juste";
    }
    if (!this.jeNeSaisPasDejaDit) this.nombreDErreurs++;
    this.lettres = [...correction.lettresGardees];
    return "fausse";
  }
}
