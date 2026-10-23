import type { GenerateurId, Hasard } from "@domain/apprentissage";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";

export const hasardDeLaSeance: Hasard = hasardDuNavigateur;

export const generateurIdDuNavigateur: GenerateurId = {
  suivant: () => crypto.randomUUID(),
};
