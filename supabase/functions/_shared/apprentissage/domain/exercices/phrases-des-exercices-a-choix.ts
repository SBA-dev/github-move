export type TypeDExerciceAChoix = "ecoute" | "bulles" | "lecture";

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
  if (type !== "ecoute") return undefined;
  const motEcoute: MorceauDExplication = item.langue === undefined
    ? { texte: `${item.dire}` }
    : { texte: `${item.dire}`, langue: item.langue };
  return {
    texte: `« ${item.dire} », c'est « ${item.reponse} ».`,
    morceaux: [motEcoute, { texte: `c'est ${item.reponse}.` }],
  };
}

export function questionDeLEcoute(item: { question?: string }): string {
  return item.question ?? "Écoute bien ! Que veut dire ce mot ?";
}

export function complementDeLEncouragement(
  type: TypeDExerciceAChoix,
  item: { aide?: string },
): string {
  if (type === "ecoute") return "Écoute encore.";
  return item.aide ?? "Essaie une autre bulle.";
}
