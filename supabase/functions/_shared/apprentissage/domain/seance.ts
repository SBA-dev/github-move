import type { EtapeDeLecon, Lecon } from "../../catalogue/domain/index.ts";
import type { ChoixDeSeance } from "./choix-de-seance.ts";
import type { ParoleDue } from "./parole-due.ts";
import { Avancement } from "./avancement.ts";
import {
  PasDeQuestionEnCours,
  PasDEtapeDeLeconEnCours,
  SeanceDejaFinie,
  SeanceDejaTerminee,
  SeanceNonFinie,
  TirageEnTrop,
} from "./erreurs.ts";
import type { FluenceEnCours } from "./exercice-chronometre.ts";
import type { VueAddition } from "./vue-d-addition.ts";
import type { BoiteEnCours, BoiteOuverte } from "./question-de-boite.ts";
import type { SchemaEnCours, SchemaResolu } from "./question-de-probleme-en-barres.ts";
import type { CalculEnCours } from "./question-de-calcul.ts";
import { Etoiles } from "./etoiles.ts";
import type { Jour } from "./jour.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import { ExerciceJoue } from "./exercice-joue.ts";
import type { GenerateurId } from "./generateur-id.ts";
import type { Hasard } from "./hasard.ts";
import { PlanDeSeance } from "./plan-de-seance.ts";
import { QuestionAPlacer } from "./question-a-placer.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { CorrectionDuMot } from "./mot-a-ecrire.ts";
import { PROFIL_ENFANT_PAR_DEFAUT, type ProfilEnfant } from "./profil-enfant.ts";
import type { QuestionDeDictee } from "./question-de-dictee.ts";
import type { QuestionSuivie, TypeDeQuestion } from "./question-suivie.ts";
import { type Tireur, tireurAuHasard, tireurSelonLesTirages } from "./tireur.ts";
import type { Reponse, ResultatDeReponse } from "./reponse.ts";
import { SeanceId } from "./seance-id.ts";
import type { QuestionRateeARetenir } from "./file-de-revision.ts";
import type { SeanceTermineeAEnregistrer } from "./seance-terminee-a-enregistrer.ts";

export type QuestionRatee = Readonly<{ cle: CleDeQuestion; erreurs: number; jeNeSaisPas: boolean }>;

export type ReussitesEtErreurs = { reussites: number; erreurs: number };

export type SeanceTerminee = Readonly<{
  type: "SeanceTerminee";
  seance: string;
  enfant: string;
  lecon: string;
  choix: ChoixDeSeance;
  termineeLe: Date;
  jour?: Jour;
  etoiles?: Etoiles["nombre"];
  scoresDeFluence?: Readonly<Record<string, number>>;
  erreurs: number;
  questionsRatees: readonly QuestionRatee[];
  questionsRateesARetenir: readonly QuestionRateeARetenir[];
  parType: Partial<Record<TypeDeQuestion, ReussitesEtErreurs>>;
}>;

export type FaitDeSeance =
  | Readonly<{ type: "EtapesDeLeconFinies" }>
  | Readonly<{ type: "ExerciceSuivantCommence"; titre: string }>;

export class Seance {
  private indexDeLEtape = 0;
  private indexDeLExercice = 0;
  private faits: FaitDeSeance[] = [];
  private termineeLe: Date | undefined;
  private jour: Jour | undefined;
  private dernierExerciceRepondu: ExerciceJoue | undefined;

  private constructor(
    readonly id: SeanceId,
    readonly enfant: string,
    readonly lecon: string,
    readonly choix: ChoixDeSeance,
    readonly plan: PlanDeSeance,
    private readonly exercices: readonly ExerciceJoue[],
    private readonly controleDesTirages: () => void = () => {},
  ) {}

  static commencer(
    generateurId: GenerateurId,
    hasard: Hasard,
    enfant: string,
    lecon: Lecon,
    choix: ChoixDeSeance,
    facilite = 1,
    profil: ProfilEnfant = PROFIL_ENFANT_PAR_DEFAUT,
  ): Seance {
    return Seance.construire(
      SeanceId.de(generateurId.nouveau()),
      enfant,
      lecon,
      choix,
      tireurAuHasard(hasard, facilite, profil),
    );
  }

  static reconstituer(
    lecon: Lecon,
    envoi: SeanceTermineeAEnregistrer,
  ): Seance {
    const tirages = envoi.tirages[Symbol.iterator]();
    return Seance.construire(
      SeanceId.de(envoi.seance),
      envoi.enfant,
      lecon,
      envoi.choix,
      tireurSelonLesTirages(tirages),
      () => {
        if (!tirages.next().done) throw new TirageEnTrop();
      },
    );
  }

  verifierQueTousLesTiragesOntServi(): void {
    this.controleDesTirages();
  }

  private static construire(
    id: SeanceId,
    enfant: string,
    lecon: Lecon,
    choix: ChoixDeSeance,
    tireur: Tireur,
    controleDesTirages?: () => void,
  ): Seance {
    const plan = PlanDeSeance.pour(lecon, choix);
    const exercices = lecon.exercices
      .map((exercice, position) => ({ exercice, position }))
      .filter(({ position }) => plan.positionsDesExercices.includes(position))
      .map(({ exercice, position }) => ExerciceJoue.depuis(position, exercice, tireur, lecon.niveau));
    return new Seance(id, enfant, lecon.id, choix, plan, exercices, controleDesTirages);
  }

  etapeDeLeconEnCours(): EtapeDeLecon | undefined {
    return this.plan.etapes[this.indexDeLEtape];
  }

  exerciceEnCours(): ExerciceJoue | undefined {
    if (this.etapeDeLeconEnCours()) return undefined;
    return this.exercices[this.indexDeLExercice];
  }

  calculEnCours(): CalculEnCours | undefined {
    return this.exerciceEnCours()?.calculEnCours();
  }

  boiteEnCours(): BoiteEnCours | undefined {
    return this.exerciceEnCours()?.boiteEnCours();
  }

  schemaEnCours(): SchemaEnCours | undefined {
    return this.exerciceEnCours()?.schemaEnCours();
  }

  additionEnCours(): VueAddition | undefined {
    return this.exerciceEnCours()?.additionEnCours();
  }

  schemaApresLaDerniereReponse(): SchemaResolu | undefined {
    return this.dernierExerciceRepondu?.schemaApresLaDerniereReponse();
  }

  boiteApresLaDerniereReponse(): BoiteOuverte | undefined {
    return this.dernierExerciceRepondu?.boiteApresLaDerniereReponse();
  }

  additionApresLaDerniereReponse(): VueAddition | undefined {
    return this.dernierExerciceRepondu?.additionApresLaDerniereReponse();
  }

  fluenceEnCours(maintenant: Date): FluenceEnCours | undefined {
    return this.exerciceEnCours()?.fluenceEnCours(maintenant);
  }

  avancement(): Avancement {
    const reussies = this.exercices.reduce((somme, exercice) => somme + exercice.questionsReussies, 0);
    const total = this.exercices.reduce((somme, exercice) => somme + exercice.questions, 0);
    return new Avancement(reussies, total);
  }

  estFinie(): boolean {
    return this.indexDeLExercice >= this.exercices.length;
  }

  demarrerLaFluence(maintenant: Date): void {
    this.exerciceDeLaQuestionEnCours().demarrerLaFluence(maintenant);
  }

  finirLaFluence(_maintenant?: Date): void {
    const exercice = this.exerciceDeLaQuestionEnCours();
    exercice.finirLaFluence();
    this.avancerSiExerciceReussi(exercice);
  }

  repondre(reponse: Reponse, maintenant?: Date): ResultatDeReponse {
    const exercice = this.exerciceDeLaQuestionEnCours();
    const resultat = exercice.repondre(reponse, maintenant);
    this.dernierExerciceCorrige(exercice);
    return resultat;
  }

  taper(lettre: string): ResultatDeReponse | undefined {
    const exercice = this.exerciceDeLaQuestionEnCours();
    const resultat = exercice.taper(lettre);
    if (resultat !== undefined) this.dernierExerciceCorrige(exercice);
    return resultat;
  }

  effacer(): void {
    this.exerciceDeLaQuestionEnCours().effacer();
  }

  questionDeDicteeEnCours(): QuestionDeDictee | undefined {
    return this.exerciceEnCours()?.questionDeDicteeEnCours();
  }

  derniereCorrection(): CorrectionDuMot | undefined {
    return this.dernierExerciceRepondu?.derniereCorrection();
  }

  suiteDeLaFelicitation(): string | undefined {
    return this.dernierExerciceRepondu?.suiteDeLaFelicitation();
  }

  aideApresLaDerniereErreur(): string | undefined {
    return this.dernierExerciceRepondu?.aideApresLaDerniereErreur();
  }

  paroleDueApresLaDerniereReponse(): ParoleDue | undefined {
    return this.dernierExerciceRepondu?.paroleDueApresLaDerniereReponse();
  }

  texteCompleteParLaDerniereReponse(): boolean {
    return this.dernierExerciceRepondu?.texteCompleteParLaDerniereReponse() ?? false;
  }

  conjugaisonCompleteParLaDerniereReponse(): boolean {
    return this.dernierExerciceRepondu?.conjugaisonCompleteParLaDerniereReponse() ?? false;
  }

  exerciceCompleteParLaDerniereReponse(): boolean {
    return this.dernierExerciceRepondu?.exerciceCompleteParLaDerniereReponse() ?? false;
  }

  questionEstReussie(rang: number): boolean {
    return this.questions()[rang]?.reussie ?? false;
  }

  direJeNeSaisPas(etiquette?: string): AideDonnee {
    return this.exerciceDeLaQuestionEnCours().direJeNeSaisPas(etiquette);
  }

  etiquetteDeLaQuestion(rang: number): string | undefined {
    const question = this.questions()[rang];
    return question instanceof QuestionAPlacer ? question.etiquette : undefined;
  }

  etiquetteDeClasserALaQuestion(rang: number): string | undefined {
    const question = this.questions()[rang];
    return question instanceof QuestionAPlacer && question.type === "classer" ? question.etiquette : undefined;
  }

  erreurs(): number {
    return this.questions().reduce((somme, question) => somme + question.erreurs, 0);
  }

  etoiles(): Etoiles {
    return Etoiles.depuisErreurs(this.erreurs());
  }

  terminer(maintenant: Date, jour?: Jour): SeanceTerminee {
    if (this.termineeLe) throw new SeanceDejaTerminee();
    if (!this.estFinie()) throw new SeanceNonFinie();
    this.termineeLe = maintenant;
    this.jour = jour;
    const fait: SeanceTerminee = {
      type: "SeanceTerminee",
      seance: this.id.valeur,
      enfant: this.enfant,
      lecon: this.lecon,
      choix: this.choix,
      termineeLe: maintenant,
      ...(jour && { jour }),
      ...this.etoilesSiLaSeanceEstNotee(),
      ...this.scoresDeFluence(),
      erreurs: this.erreurs(),
      questionsRatees: this.questions()
        .filter((question) => question.erreurs > 0)
        .map((question) => ({
          cle: question.cle,
          erreurs: question.erreurs,
          jeNeSaisPas: question.bonneReponseMontree,
        })),
      questionsRateesARetenir: this.questionsRateesARetenir(),
      parType: this.reussitesEtErreursParType(),
    };
    return fait;
  }

  aEnregistrer(): SeanceTermineeAEnregistrer {
    if (!this.termineeLe) throw new SeanceNonFinie();
    const questions = this.questions();
    return {
      seance: this.id.valeur,
      enfant: this.enfant,
      lecon: this.lecon,
      choix: this.choix,
      tirages: [
        ...this.exercices.flatMap((exercice) => exercice.tirages()),
        ...this.exercices.flatMap((exercice) => exercice.tiragesEnCoursDeJeu()),
      ],
      reponses: questions.map((question) => question.reponses()),
      termineeLe: this.termineeLe,
      ...(this.jour && { jour: this.jour.toString() }),
    };
  }

  clesDesQuestionsRatees(): CleDeQuestion[] {
    return this.exercices.flatMap((exercice) => exercice.questionsRatees().map((question) => question.cle));
  }

  continuer(): void {
    if (!this.etapeDeLeconEnCours()) throw new PasDEtapeDeLeconEnCours();
    this.indexDeLEtape++;
    if (!this.etapeDeLeconEnCours()) this.faits.push({ type: "EtapesDeLeconFinies" });
  }

  private dernierExerciceCorrige(exercice: ExerciceJoue): void {
    this.dernierExerciceRepondu = exercice;
    this.avancerSiExerciceReussi(exercice);
  }

  private questionsRateesARetenir(): QuestionRateeARetenir[] {
    return this.exercices.flatMap((exercice) =>
      exercice.questionsRateesARetenir().map((question) => ({
        identite: question.cle,
        origine: {
          leconDOrigine: this.lecon,
          position: exercice.position,
          type: question.type,
          ...(question.tirage && { tirage: question.tirage }),
        },
      }))
    );
  }

  private questions(): QuestionSuivie[] {
    return this.exercices.flatMap((exercice) => [...exercice.questionsJouees()]);
  }

  private etoilesSiLaSeanceEstNotee(): Pick<SeanceTerminee, "etoiles"> {
    const faiteDeFluencesSeules = this.exercices.every((exercice) => exercice.scoreDeFluence() !== undefined);
    return faiteDeFluencesSeules ? {} : { etoiles: this.etoiles().nombre };
  }

  private scoresDeFluence(): Pick<SeanceTerminee, "scoresDeFluence"> {
    const scores = this.exercices.flatMap((exercice) => exercice.scoreDeFluence() ?? []);
    if (scores.length === 0) return {};
    return { scoresDeFluence: Object.fromEntries(scores.map(({ nom, score }) => [nom, score])) };
  }

  private reussitesEtErreursParType(): SeanceTerminee["parType"] {
    const parType: Record<string, ReussitesEtErreurs> = {};
    const cumuler = (type: string, reussites: number, erreurs: number) => {
      const total = parType[type] ??= { reussites: 0, erreurs: 0 };
      total.reussites += reussites;
      total.erreurs += erreurs;
    };
    for (const exercice of this.exercices) {
      const fluence = exercice.scoreDeFluence();
      if (fluence) cumuler("fluence", fluence.score, fluence.reponsesFausses);
      else exercice.questionsJouees().forEach((question) => cumuler(question.type, 1, question.erreurs));
    }
    return parType;
  }

  private exerciceDeLaQuestionEnCours(): ExerciceJoue {
    if (this.estFinie()) throw new SeanceDejaFinie();
    const exercice = this.exerciceEnCours();
    if (!exercice) throw new PasDeQuestionEnCours();
    return exercice;
  }

  private avancerSiExerciceReussi(exercice: ExerciceJoue): void {
    if (exercice.estReussi()) this.passerALExerciceSuivant();
  }

  private passerALExerciceSuivant(): void {
    this.indexDeLExercice++;
    const suivant = this.exerciceEnCours();
    if (suivant?.titre) this.faits.push({ type: "ExerciceSuivantCommence", titre: suivant.titre });
  }

  retirerFaits(): FaitDeSeance[] {
    const faits = this.faits;
    this.faits = [];
    return faits;
  }
}
