import type { CleDeQuestion } from "./cle-de-question.ts";
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

export type DonneesDeFileDeRevision = {
  readonly enfant: string;
  readonly questions: readonly QuestionRetenue[];
  readonly erreursCorrigeesPourDeBon: number;
};

export class FileDeRevision {
  private constructor(
    readonly enfant: string,
    private questionsRetenues: QuestionRetenue[],
    readonly erreursCorrigeesPourDeBon: number,
  ) {}

  static vide(enfant: string): FileDeRevision {
    return new FileDeRevision(enfant, [], 0);
  }

  static reconstituer(donnees: DonneesDeFileDeRevision): FileDeRevision {
    return new FileDeRevision(donnees.enfant, [...donnees.questions], donnees.erreursCorrigeesPourDeBon);
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
