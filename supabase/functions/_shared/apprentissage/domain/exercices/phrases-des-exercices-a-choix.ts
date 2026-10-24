export type TypeDExerciceAChoix = "ecoute" | "bulles" | "lecture" | "trous" | "conjugaison";

export const INTRODUCTION_DE_LA_LECTURE =
  "Installe-toi bien, j'ai une histoire pour toi. Suis les mots avec tes yeux !";

export const MESSAGE_DE_L_ECOUTE_SANS_SON =
  "Pour écouter l'anglais, j'ai besoin du son : active-le avec le bouton ci-dessous.";

export type MorceauDExplication = { readonly texte: string; readonly langue?: string };

export type ExplicationDeLaReponse = {
  readonly texte: string;
  readonly morceaux: readonly MorceauDExplication[];
};

export function explicationDeLaReponse(
  type: TypeDExerciceAChoix,
  item: { dire?: string; reponse: string; langue?: string },
): ExplicationDeLaReponse | undefined {
  if (type !== "ecoute" || item.dire === undefined) return undefined;
  const { dire } = item;
  const motEcoute: MorceauDExplication = item.langue === undefined
    ? { texte: dire }
    : { texte: dire, langue: item.langue };
  return {
    texte: `« ${dire} », c'est « ${item.reponse} ».`,
    morceaux: [motEcoute, { texte: `c'est ${item.reponse}.` }],
  };
}

export function questionDeLEcoute(item: { question?: string }): string {
  return item.question ?? "Écoute bien ! Que veut dire ce mot ?";
}

export function aideParDefaut(type: TypeDExerciceAChoix): string {
  if (type === "ecoute") return "Écoute encore.";
  if (type === "trous") return "Relis la phrase en entier : quel mot va bien ?";
  return "Essaie une autre bulle.";
}
