export type ReponseParChoix = Readonly<{ genre: "choix"; texte: string }>;

export type Placement = Readonly<{ genre: "placement"; etiquette: string; groupe?: string }>;

export type MotEcrit = Readonly<{ genre: "motEcrit"; lettres: readonly string[] }>;

export type Reponse = ReponseParChoix | Placement | MotEcrit;

export const Reponse = {
  motEcrit: (lettres: readonly string[]): MotEcrit => ({ genre: "motEcrit", lettres }),
  choix: (texte: string): ReponseParChoix => ({ genre: "choix", texte }),
  placement: (etiquette: string, groupe?: string): Placement =>
    groupe === undefined ? { genre: "placement", etiquette } : { genre: "placement", etiquette, groupe },
};

export type ReponseDonnee = Reponse | Readonly<{ genre: "jeNeSaisPas" }>;

export type ResultatDeReponse = "juste" | "fausse" | "dejaEcartee";
