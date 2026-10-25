import {
  AucuneQuestionDue,
  cleDeLaBoite,
  type FileDeRevision,
  type Jour,
  type PlanDeSeanceDeRevision,
  SeanceDeRevision,
  tireurAuHasard,
} from "@domain/apprentissage";
import type { ItemDeBoite, Lecon, Niveau } from "@domain/catalogue";
import { generateurIdDuNavigateur } from "../seance/generateur-id-navigateur.ts";
import { hasardDuNavigateur } from "../seance/hasard-navigateur.ts";

export type RevisionCommencee = {
  readonly seance: SeanceDeRevision;
  /** Les boîtes à jetons des questions du plan, par clé de question : l'écran y lit ce que contient la boîte pendant le déroulé. */
  readonly boites: ReadonlyMap<string, ItemDeBoite>;
};

function boitesDuPlan(plan: PlanDeSeanceDeRevision, lecons: readonly Lecon[]): Map<string, ItemDeBoite> {
  const boites = new Map<string, ItemDeBoite>();
  for (const { identite, origine } of plan.questions) {
    const exercice = lecons.find(({ id }) => id === origine.leconDOrigine)?.exercices[origine.position];
    const item = exercice?.type === "boite"
      ? exercice.items.find((candidat) => cleDeLaBoite(candidat).valeur === identite.valeur)
      : undefined;
    if (item) boites.set(identite.valeur, item);
  }
  return boites;
}

/** La séance de révision des questions dues ce jour-là ; `undefined` quand rien n'est dû ou que la bibliothèque ne donne aucune question. */
export function commencerLaRevision(
  { file, jour, enfant, lecons, niveau }: {
    readonly file: FileDeRevision;
    readonly jour: Jour;
    readonly enfant: string;
    readonly lecons: readonly Lecon[];
    readonly niveau: Niveau;
  },
): RevisionCommencee | undefined {
  try {
    const plan = file.planDeLaSeanceDeRevision(jour);
    const seance = SeanceDeRevision.commencer({
      id: generateurIdDuNavigateur.nouveau(),
      enfant,
      plan,
      lecons,
      tireurDe: () => tireurAuHasard(hasardDuNavigateur),
      niveau,
    });
    return { seance, boites: boitesDuPlan(plan, lecons) };
  } catch (erreur) {
    if (erreur instanceof AucuneQuestionDue) return undefined;
    throw erreur;
  }
}
