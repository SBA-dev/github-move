export type ReponseParChoix = Readonly<{ genre: "choix"; texte: string }>;

export type Placement = Readonly<{ genre: "placement"; etiquette: string; groupe?: string }>;

export type Reponse = ReponseParChoix | Placement;

export const Reponse = {
  choix: (texte: string): ReponseParChoix => ({ genre: "choix", texte }),
  placement: (etiquette: string, groupe?: string): Placement =>
    groupe === undefined ? { genre: "placement", etiquette } : { genre: "placement", etiquette, groupe },
};

export type ReponseDonnee = Reponse | Readonly<{ genre: "jeNeSaisPas" }>;

export type ResultatDeReponse = "juste" | "fausse" | "dejaEcartee";
