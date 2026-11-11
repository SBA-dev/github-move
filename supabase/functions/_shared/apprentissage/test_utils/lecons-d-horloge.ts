import { type ExerciceHorloge, type Lecon, lireLecon } from "../../catalogue/domain/index.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

const PREFIXE_D_IDENTIFIANT = { CP: "cp", CE1: "ce1", CE2: "ce2", CM1: "cm1", CM2: "cm2" } as const;

export type NiveauDHorloge = keyof typeof PREFIXE_D_IDENTIFIANT;

export function leconDHorloge(niveau: NiveauDHorloge, exercice: Record<string, unknown>): Lecon {
  return lireLecon({
    id: `ma-${PREFIXE_D_IDENTIFIANT[niveau]}-heures`,
    matiere: "maths",
    niveau,
    titre: "Lire l'heure",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [{ type: "horloge", ...exercice }],
  });
}

export function exerciceDHorloge(niveau: NiveauDHorloge, exercice: Record<string, unknown>): ExerciceHorloge {
  const lu = leconDHorloge(niveau, exercice).exercices[0];
  if (lu?.type !== "horloge") throw new Error("la leçon de test devait porter un exercice horloge");
  return lu;
}
