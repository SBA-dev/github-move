import type { GenerateurId } from "@domain/apprentissage";

export const generateurIdDuNavigateur: GenerateurId = {
  nouveau: () => crypto.randomUUID(),
};
