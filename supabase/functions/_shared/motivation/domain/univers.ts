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
    },
  },
];

export function universDe(cle: string | undefined): Univers {
  return UNIVERS.find((univers) => univers.cle === cle) ?? UNIVERS_PAR_DEFAUT;
}
