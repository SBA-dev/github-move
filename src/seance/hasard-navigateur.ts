import type { Hasard } from "@domain/apprentissage";

export const hasardDuNavigateur: Hasard = {
  entre0et1: () => Math.random(),
};
