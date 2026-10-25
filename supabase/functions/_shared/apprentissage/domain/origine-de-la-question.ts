import type { TypeDeQuestion } from "./question-suivie.ts";

export type OrigineDeLaQuestion = {
  readonly leconDOrigine: string;
  readonly position: number;
  readonly type: TypeDeQuestion;
  readonly tirage?: string;
};
