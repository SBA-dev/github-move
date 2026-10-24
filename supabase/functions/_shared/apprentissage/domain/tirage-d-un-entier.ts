import type { Intervalle } from "../../catalogue/domain/index.ts";
import type { Hasard } from "./hasard.ts";

export function tirerUnEntier([min, max]: Intervalle, hasard: Hasard): number {
  return min + Math.floor(hasard.entre0et1() * (max - min + 1));
}
