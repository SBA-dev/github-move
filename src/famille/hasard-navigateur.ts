import type { Hasard } from "@domain/famille";
import { hasardDuNavigateur as hasardEntre0et1 } from "../hasard-navigateur.ts";

export const hasardDuNavigateur: Hasard = {
  entierEntre: (min, max) => min + Math.floor(hasardEntre0et1.entre0et1() * (max - min + 1)),
};
