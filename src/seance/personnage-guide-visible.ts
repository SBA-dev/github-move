import type { NatureDeParole } from "./usePersonnageQuiParle.ts";

const NATURES_DE_LA_QUESTION: readonly NatureDeParole[] = ["consigne", "question", "dictee"];

export type FaitsDuPersonnageGuide = {
  readonly finie: boolean;
  readonly etape: boolean;
  /** Ce que le personnage guide est en train de dire, s'il parle. */
  readonly parole: { readonly nature: NatureDeParole } | undefined;
  /** Il réagit (applaudit, par exemple) sans rien dire. */
  readonly reagitSansParler: boolean;
  readonly sceneDeReponseFausse: boolean;
};

/** Pendant une question le personnage guide se tait et se cache : il se montre quand il lit une étape de leçon, quand il réagit (réussite, encouragement, aide), avec ou sans parole, et à la fin. */
export function personnageGuideSeMontre({ finie, etape, parole, reagitSansParler, sceneDeReponseFausse }: FaitsDuPersonnageGuide): boolean {
  const parleEnReagissant = parole !== undefined && !NATURES_DE_LA_QUESTION.includes(parole.nature);
  return finie || etape || parleEnReagissant || reagitSansParler || sceneDeReponseFausse;
}
