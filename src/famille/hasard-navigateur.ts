import type { Hasard } from "@domain/famille";

export const hasardDuNavigateur: Hasard = {
  entierEntre: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),
};
