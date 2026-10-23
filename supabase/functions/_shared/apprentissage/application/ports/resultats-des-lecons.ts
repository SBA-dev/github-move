import type { ResultatDeLaLecon } from "../../domain/resultat-de-la-lecon.ts";

export interface ResultatsDesLecons {
  de(enfant: string, lecon: string): Promise<ResultatDeLaLecon | null>;
}
