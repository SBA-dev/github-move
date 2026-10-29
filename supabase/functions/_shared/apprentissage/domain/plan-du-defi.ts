import type { Lecon } from "../../catalogue/domain/index.ts";
import type { Defi } from "./defis-de-la-matiere.ts";
import { AucuneQuestionPourLeDefi } from "./erreurs.ts";
import { type CleDeQuestion, estUnTypeDeQuestion } from "./cle-de-question.ts";
import { cleDeLaDictee } from "./cles-des-questions.ts";
import type { Hasard } from "./hasard.ts";
import { melanger } from "./melange.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";
import { posables } from "./question-de-revision.ts";
import type { TypeDeQuestion } from "./question-suivie.ts";

export type QuestionDuDefi = {
  readonly identite: CleDeQuestion;
  readonly origine: OrigineDeLaQuestion;
};

export type PlanDuDefi = { readonly questions: readonly QuestionDuDefi[] };

export const NOMBRE_DE_QUESTIONS_DU_DEFI = 10;

export function questionsPosablesDuDefi(defi: Defi, lecons: readonly Lecon[]): QuestionDuDefi[] {
  return questionsPosablesParLecon(defi, lecons).flat();
}

function questionsPosablesParLecon(defi: Defi, lecons: readonly Lecon[]): QuestionDuDefi[][] {
  const dejaPosables = new Set<string>();
  return lecons
    .filter(({ id }) => defi.lecons.includes(id))
    .map((lecon) =>
      questionsPosablesDeLaLecon(lecon).filter(({ identite }) => {
        if (dejaPosables.has(identite.valeur)) return false;
        dejaPosables.add(identite.valeur);
        return true;
      })
    );
}

export function planDuDefi(defi: Defi, lecons: readonly Lecon[], hasard: Hasard): PlanDuDefi {
  const reserves = questionsPosablesParLecon(defi, lecons)
    .map((questions) => melanger(questions, hasard))
    .filter((reserve) => reserve.length > 0);
  if (reserves.length === 0) throw new AucuneQuestionPourLeDefi();
  const parts = partsParLecon(reserves.map((reserve) => reserve.length), hasard);
  const retenues = reserves.flatMap((reserve, rang) => reserve.slice(0, parts[rang]));
  return { questions: melanger(retenues, hasard) };
}

function questionsPosablesDeLaLecon(lecon: Lecon): QuestionDuDefi[] {
  return lecon.exercices.flatMap((exercice, position) => {
    const type = typeDeQuestionDeLExercice(exercice.type);
    if (type === undefined) return [];
    const origine = { leconDOrigine: lecon.id, position, type };
    if (exercice.type === "dictee") {
      return exercice.mots.map((mot) => ({ identite: cleDeLaDictee(mot), origine }));
    }
    return posables(exercice, origine).map(({ cle }) => ({ identite: cle, origine }));
  });
}

function typeDeQuestionDeLExercice(typeDExercice: string): TypeDeQuestion | undefined {
  if (typeDExercice === "addition") return "calcul";
  return estUnTypeDeQuestion(typeDExercice) ? typeDExercice : undefined;
}

/** Parts égales entre les leçons ; ce qu'une leçon ne peut pas donner est repris par les autres, le reste est tiré au hasard. */
function partsParLecon(disponibles: readonly number[], hasard: Hasard): number[] {
  const parts = disponibles.map(() => 0);
  const avecReste = () => parts.flatMap((part, rang) => part < (disponibles[rang] as number) ? [rang] : []);
  let aPoser = Math.min(NOMBRE_DE_QUESTIONS_DU_DEFI, disponibles.reduce((a, b) => a + b, 0));
  for (let part = Math.floor(aPoser / avecReste().length); part > 0; part = Math.floor(aPoser / avecReste().length)) {
    for (const rang of avecReste()) {
      const prise = Math.min(part, (disponibles[rang] as number) - (parts[rang] as number));
      parts[rang] = (parts[rang] as number) + prise;
      aPoser -= prise;
    }
  }
  const rangsAvecReste = avecReste().map(String);
  for (const rang of melanger(rangsAvecReste, hasard).slice(0, aPoser)) {
    parts[Number(rang)] = (parts[Number(rang)] as number) + 1;
  }
  return parts;
}
