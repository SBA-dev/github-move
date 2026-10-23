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

const UNIVERS_PAR_DEFAUT: Univers = {
  cle: "animaux",
  libelle: "Animaux de la forêt",
  royaume: "la Forêt des Savanturiers",
  personnageGuide: {
    nom: "Noisette",
    titre: "l'écureuil savant",
    expressions: ["Youpi !", "Hop hop hop, bravo !", "Trop fort, ça !"],
    caractere: { sexe: "feminine", hauteur: 1.45, rythme: 1.08 },
  },
};

export const UNIVERS: readonly Univers[] = [
  {
    cle: "princesse",
    libelle: "Princesses et fées",
    royaume: "le Royaume des Savanturiers",
    personnageGuide: {
      nom: "Lumi",
      titre: "la fée des nombres et des mots",
      expressions: ["Abracadabra !", "Par ma baguette, bravo !", "Magique !"],
      caractere: { sexe: "feminine", hauteur: 1.25, rythme: 1.0 },
    },
  },
  UNIVERS_PAR_DEFAUT,
  {
    cle: "sports",
    libelle: "Sports",
    royaume: "le Stade des Savanturiers",
    personnageGuide: {
      nom: "Coach Léo",
      titre: "l'entraîneur des champions",
      expressions: ["Allez, on y va !", "Et c'est le but !", "Quelle équipe !"],
      caractere: { sexe: "masculine", hauteur: 1.05, rythme: 1.07 },
    },
  },
  {
    cle: "police",
    libelle: "Police",
    royaume: "le Commissariat des Savanturiers",
    personnageGuide: {
      nom: "Agente Mila",
      titre: "la policière détective",
      expressions: ["Enquête résolue !", "Bien vu, détective !", "Affaire classée !"],
      caractere: { sexe: "feminine", hauteur: 1.05, rythme: 1.0 },
    },
  },
  {
    cle: "pompier",
    libelle: "Pompiers",
    royaume: "la Caserne des Savanturiers",
    personnageGuide: {
      nom: "Capitaine Sam",
      titre: "le pompier courageux",
      expressions: ["Mission accomplie !", "Pin-pon, bravo !", "Sauvetage réussi !"],
      caractere: { sexe: "masculine", hauteur: 0.95, rythme: 1.0 },
    },
  },
  {
    cle: "danse",
    libelle: "Danse",
    royaume: "l'Opéra des Savanturiers",
    personnageGuide: {
      nom: "Lili",
      titre: "la danseuse étoile",
      expressions: ["Et hop, une pirouette !", "En rythme, bravo !", "Quelle grâce !"],
      caractere: { sexe: "feminine", hauteur: 1.2, rythme: 1.02 },
    },
  },
];

export function universDe(cle: string | undefined): Univers {
  return UNIVERS.find((univers) => univers.cle === cle) ?? UNIVERS_PAR_DEFAUT;
}
