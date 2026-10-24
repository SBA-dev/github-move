import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import type { LeconId } from "./parcours.ts";
import { reserveDuTestDeDepart } from "./reserve-du-test-de-depart.ts";

type QuestionDuTest = Readonly<{ lecon: LeconId; juste: boolean }>;

export function leconsReussiesAuTestDeDepart(
  lecons: readonly Lecon[],
  niveau: Niveau,
  questions: readonly QuestionDuTest[],
): ReadonlySet<LeconId> {
  const justes = new Set(questions.filter(({ juste }) => juste).map(({ lecon }) => lecon));
  const fausses = new Set(questions.filter(({ juste }) => !juste).map(({ lecon }) => lecon));
  const reserve = reserveDuTestDeDepart(lecons, niveau);
  const reussies = new Set<LeconId>();
  for (const matiere of new Set(reserve.map((lecon) => lecon.matiere.code))) {
    const deLaMatiere = reserve.filter((lecon) => lecon.matiere.code === matiere);
    const rangDeLaDerniereJuste = deLaMatiere.findLastIndex((lecon) => justes.has(lecon.id));
    deLaMatiere
      .slice(0, rangDeLaDerniereJuste + 1)
      .filter((lecon) => !fausses.has(lecon.id))
      .forEach((lecon) => reussies.add(lecon.id));
  }
  return reussies;
}
