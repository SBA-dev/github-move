import { type Defi, type GrandDefi, planDuDefi, SeanceDeDefi, tireurAuHasard } from "@domain/apprentissage";
import type { ItemDeBoite, Lecon, Niveau } from "@domain/catalogue";
import { boitesDuPlan, type TexteDeLecture, textesDuPlan } from "../revision/commencer-la-revision.ts";
import { generateurIdDuNavigateur } from "../seance/generateur-id-navigateur.ts";
import { hasardDuNavigateur } from "../seance/hasard-navigateur.ts";

export type DefiCommence = {
  readonly seance: SeanceDeDefi;
  readonly nombreDeQuestions: number;
  readonly boites: ReadonlyMap<string, ItemDeBoite>;
  readonly textes: ReadonlyMap<string, TexteDeLecture>;
};

/** Le défi d'une partie du parcours (10 questions) ou le grand défi (12), avec un nouveau tirage au hasard du navigateur. */
export function commencerLeDefi(
  { defi, enfant, lecons, niveau }: {
    readonly defi: Defi | GrandDefi;
    readonly enfant: string;
    readonly lecons: readonly Lecon[];
    readonly niveau: Niveau;
  },
): DefiCommence {
  const plan = planDuDefi(defi, lecons, hasardDuNavigateur);
  const seance = SeanceDeDefi.commencer({
    id: generateurIdDuNavigateur.nouveau(),
    enfant,
    defi,
    plan,
    lecons,
    tireurDe: () => tireurAuHasard(hasardDuNavigateur),
    niveau,
  });
  return { seance, nombreDeQuestions: plan.questions.length, boites: boitesDuPlan(plan, lecons), textes: textesDuPlan(plan, lecons) };
}
