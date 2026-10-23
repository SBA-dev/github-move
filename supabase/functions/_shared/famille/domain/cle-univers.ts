import { type CleUnivers, UNIVERS } from "../../motivation/domain/index.ts";
import { UniversInconnu } from "./erreurs.ts";

export function lireCleUnivers(brut: string): CleUnivers {
  const univers = UNIVERS.find((univers) => univers.cle === brut);
  if (univers === undefined) throw new UniversInconnu(brut);
  return univers.cle;
}
