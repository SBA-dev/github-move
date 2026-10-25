import type { CleDeQuestion } from "./cle-de-question.ts";
import { AucuneQuestionDue } from "./erreurs.ts";
import { IntervalleDeRevision } from "./intervalle-de-revision.ts";
import type { Jour } from "./jour.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";

export type QuestionRateeARetenir = {
  readonly identite: CleDeQuestion;
  readonly origine: OrigineDeLaQuestion;
};

export type QuestionRetenue = Readonly<{
  identite: CleDeQuestion;
  origine: OrigineDeLaQuestion;
  intervalle: IntervalleDeRevision;
  dateDeRevision: Jour;
  derniereErreurLe: Date;
  nombreDeFoisRatee: number;
}>;

export const NOMBRE_MAXIMAL_DE_QUESTIONS_RETENUES = 250;

export const NOMBRE_MAXIMAL_DE_QUESTIONS_PAR_SEANCE_DE_REVISION = 10;

export type PlanDeSeanceDeRevision = { readonly questions: readonly QuestionRetenue[] };

export type ResultatDeRevision = {
  readonly identite: CleDeQuestion;
  readonly juste: boolean;
};

export type DonneesDeFileDeRevision = {
  readonly enfant: string;
  readonly questions: readonly QuestionRetenue[];
  readonly erreursCorrigeesPourDeBon: number;
};

export class FileDeRevision {
  private constructor(
    readonly enfant: string,
    private questionsRetenues: QuestionRetenue[],
    private nombreDErreursCorrigeesPourDeBon: number,
  ) {}

  static vide(enfant: string): FileDeRevision {
    return new FileDeRevision(enfant, [], 0);
  }

  static reconstituer(donnees: DonneesDeFileDeRevision): FileDeRevision {
    return new FileDeRevision(donnees.enfant, [...donnees.questions], donnees.erreursCorrigeesPourDeBon);
  }

  get erreursCorrigeesPourDeBon(): number {
    return this.nombreDErreursCorrigeesPourDeBon;
  }

  get questions(): readonly QuestionRetenue[] {
    return this.questionsRetenues;
  }

  retenir(questions: readonly QuestionRateeARetenir[], jour: Jour, termineeLe: Date): void {
    for (const question of sansDoublon(questions)) {
      const index = this.questionsRetenues.findIndex(
        (retenue) => retenue.identite.valeur === question.identite.valeur,
      );
      if (index === -1) {
        this.questionsRetenues.push(nouvelleQuestionRetenue(question, jour, termineeLe));
      } else {
        this.questionsRetenues[index] = rateeDeNouveau(this.questionsRetenues[index], jour, termineeLe);
      }
    }
    this.oublierLesPlusAnciennesAuDelaDeLaLimite();
  }

  enregistrerLaRevision(resultats: readonly ResultatDeRevision[], jour: Jour, termineeLe: Date): void {
    for (const resultat of resultats) {
      const index = this.questionsRetenues.findIndex(
        (retenue) => retenue.identite.valeur === resultat.identite.valeur,
      );
      if (index !== -1) this.appliquer(index, resultat.juste, jour, termineeLe);
    }
  }

  private appliquer(index: number, juste: boolean, jour: Jour, termineeLe: Date): void {
    const retenue = this.questionsRetenues[index];
    if (termineeLe.getTime() < retenue.derniereErreurLe.getTime()) return;
    if (!juste) {
      this.questionsRetenues[index] = rateeDeNouveau(retenue, jour, termineeLe);
      return;
    }
    const suite = retenue.intervalle.suivant();
    if (suite.corrigeePourDeBon) {
      this.questionsRetenues.splice(index, 1);
      this.nombreDErreursCorrigeesPourDeBon++;
      return;
    }
    this.questionsRetenues[index] = {
      ...retenue,
      intervalle: suite.intervalle,
      dateDeRevision: jour.plus(suite.intervalle.jours),
    };
  }

  questionsDues(jour: Jour): readonly QuestionRetenue[] {
    return this.questionsRetenues.filter((question) => question.dateDeRevision.estAvantOuEgal(jour));
  }

  planDeLaSeanceDeRevision(jour: Jour): PlanDeSeanceDeRevision {
    const dues = this.questionsDues(jour);
    if (dues.length === 0) throw new AucuneQuestionDue();
    const questions = [...dues]
      .sort(parOrdreDeRevision)
      .slice(0, NOMBRE_MAXIMAL_DE_QUESTIONS_PAR_SEANCE_DE_REVISION);
    return { questions };
  }

  private oublierLesPlusAnciennesAuDelaDeLaLimite(): void {
    const nombreEnTrop = this.questionsRetenues.length - NOMBRE_MAXIMAL_DE_QUESTIONS_RETENUES;
    if (nombreEnTrop <= 0) return;
    const oubliees = new Set(
      [...this.questionsRetenues]
        .sort((a, b) => a.derniereErreurLe.getTime() - b.derniereErreurLe.getTime())
        .slice(0, nombreEnTrop),
    );
    this.questionsRetenues = this.questionsRetenues.filter((question) => !oubliees.has(question));
  }
}

function sansDoublon(questions: readonly QuestionRateeARetenir[]): QuestionRateeARetenir[] {
  const parCle = new Map<string, QuestionRateeARetenir>();
  for (const question of questions) {
    if (!parCle.has(question.identite.valeur)) parCle.set(question.identite.valeur, question);
  }
  return [...parCle.values()];
}

function nouvelleQuestionRetenue(
  { identite, origine }: QuestionRateeARetenir,
  jour: Jour,
  termineeLe: Date,
): QuestionRetenue {
  return {
    identite,
    origine,
    intervalle: IntervalleDeRevision.premier(),
    dateDeRevision: jour.plus(1),
    derniereErreurLe: termineeLe,
    nombreDeFoisRatee: 1,
  };
}

function rateeDeNouveau(retenue: QuestionRetenue, jour: Jour, termineeLe: Date): QuestionRetenue {
  return {
    ...retenue,
    intervalle: IntervalleDeRevision.premier(),
    dateDeRevision: jour.plus(1),
    derniereErreurLe: termineeLe,
    nombreDeFoisRatee: retenue.nombreDeFoisRatee + 1,
  };
}

function parOrdreDeRevision(a: QuestionRetenue, b: QuestionRetenue): number {
  return comparerLesJours(a.dateDeRevision, b.dateDeRevision) ||
    a.derniereErreurLe.getTime() - b.derniereErreurLe.getTime() ||
    comparerLesTextes(a.identite.valeur, b.identite.valeur);
}

function comparerLesJours(a: Jour, b: Jour): number {
  if (a.estEgalA(b)) return 0;
  return a.estAvantOuEgal(b) ? -1 : 1;
}

function comparerLesTextes(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
