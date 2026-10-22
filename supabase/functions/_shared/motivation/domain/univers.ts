import type { PersonnageGuide } from "./personnage-guide.ts";

export type CleUnivers =
  | "princesse"
  | "animaux"
  | "sports"
  | "police"
  | "pompier"
  | "danse";

export type Univers = {
  readonly cle: CleUnivers;
  readonly libelle: string;
  readonly royaume: string;
  readonly personnageGuide: PersonnageGuide;
};

export const UNIVERS: readonly Univers[] = [
  {
    cle: "princesse",
    libelle: "Princesses et fées",
    royaume: "le Royaume des Savanturiers",
    personnageGuide: { nom: "Lumi", titre: "la fée des nombres et des mots" },
  },
  {
    cle: "animaux",
    libelle: "Animaux de la forêt",
    royaume: "la Forêt des Savanturiers",
    personnageGuide: { nom: "Noisette", titre: "l'écureuil savant" },
  },
  {
    cle: "sports",
    libelle: "Sports",
    royaume: "le Stade des Savanturiers",
    personnageGuide: {
      nom: "Coach Léo",
      titre: "l'entraîneur des champions",
    },
  },
  {
    cle: "police",
    libelle: "Police",
    royaume: "le Commissariat des Savanturiers",
    personnageGuide: { nom: "Agente Mila", titre: "la policière détective" },
  },
  {
    cle: "pompier",
    libelle: "Pompiers",
    royaume: "la Caserne des Savanturiers",
    personnageGuide: { nom: "Capitaine Sam", titre: "le pompier courageux" },
  },
  {
    cle: "danse",
    libelle: "Danse",
    royaume: "l'Opéra des Savanturiers",
    personnageGuide: { nom: "Lili", titre: "la danseuse étoile" },
  },
];

export function universDe(cle: string | undefined): Univers {
  return UNIVERS.find((univers) => univers.cle === cle) ??
    UNIVERS.find((univers) => univers.cle === "animaux")!;
}
