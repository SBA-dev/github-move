import type { CaractereDeLaVoix } from "../../voix/domain/index.ts";

export type PersonnageGuide = {
  readonly nom: string;
  readonly titre: string;
  readonly expressions: readonly string[];
  readonly caractere: CaractereDeLaVoix;
};
