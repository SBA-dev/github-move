import type { NombreDEtoiles } from "../../domain/etoiles.ts";
import type { ResultatDeLaLecon } from "../../domain/resultat-de-la-lecon.ts";

export interface ResultatsDesLecons {
  de(enfant: string, lecon: string): Promise<ResultatDeLaLecon | null>;
  meilleuresEtoilesDe(enfant: string): Promise<Map<string, NombreDEtoiles>>;
}
