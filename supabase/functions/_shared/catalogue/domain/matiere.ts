import { MatiereInconnue } from "./erreurs.ts";

const LIBELLES = {
  francais: "Français",
  maths: "Mathématiques",
  sciences: "Sciences",
  histoire: "Histoire et géographie",
  anglais: "Anglais",
  emc: "Vivre ensemble (EMC)",
} as const;

export type Matiere = keyof typeof LIBELLES;

export const MATIERES = Object.keys(LIBELLES) as ReadonlyArray<Matiere>;

export function matiere(valeur: unknown): Matiere {
  if (typeof valeur !== "string" || !Object.hasOwn(LIBELLES, valeur)) throw new MatiereInconnue();
  return valeur as Matiere;
}

export function libelleDeLaMatiere(identifiant: Matiere): string {
  return LIBELLES[identifiant];
}
