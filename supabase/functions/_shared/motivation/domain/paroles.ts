import type { Hasard } from "./hasard.ts";
import type { PersonnageGuide } from "./personnage-guide.ts";

export type Felicitation = { readonly texte: string };

const PROBABILITE_EXPRESSION_DU_PERSONNAGE_GUIDE = 0.35;

const FELICITATIONS_COMMUNES: readonly string[] = [
  "Bravo !",
  "Super !",
  "Ouah, bien joué !",
  "Exactement !",
  "Génial !",
  "Tu gères !",
  "Parfait !",
  "Oui, c'est ça !",
];

function tirerDans(textes: readonly string[], hasard: Hasard): string {
  const texte = textes[Math.floor(hasard.entre0et1() * textes.length)];
  if (texte === undefined) {
    throw new Error("Le hasard doit donner un tirage dans [0, 1[");
  }
  return texte;
}

export function feliciter(
  personnageGuide: PersonnageGuide,
  hasard: Hasard,
): Felicitation {
  const textes = hasard.entre0et1() < PROBABILITE_EXPRESSION_DU_PERSONNAGE_GUIDE
    ? personnageGuide.expressions
    : FELICITATIONS_COMMUNES;
  return { texte: tirerDans(textes, hasard) };
}
