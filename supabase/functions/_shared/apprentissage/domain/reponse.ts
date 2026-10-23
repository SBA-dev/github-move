export type Reponse = Readonly<{ genre: "choix"; texte: string }>;

export const Reponse = {
  choix: (texte: string): Reponse => ({ genre: "choix", texte }),
};

export type ResultatDeReponse = "juste" | "fausse" | "dejaEcartee";
