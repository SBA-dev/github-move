import { type Hasard, tirage } from "./hasard.ts";
import type { PersonnageGuide } from "./personnage-guide.ts";
import type { Univers } from "./univers.ts";

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

export type Encouragement = { readonly texte: string };

const ENCOURAGEMENTS: readonly string[] = [
  "Oups, presque !",
  "Hmm, pas tout à fait…",
  "Pas grave, on réessaie !",
  "Ah, celle-là est piégeuse !",
  "Presque ! Regarde bien.",
];

function tirerDans(textes: readonly string[], hasard: Hasard): string {
  return textes[Math.floor(tirage(hasard) * textes.length)] as string;
}

export function feliciter(
  personnageGuide: PersonnageGuide,
  hasard: Hasard,
): Felicitation {
  const textes = tirage(hasard) < PROBABILITE_EXPRESSION_DU_PERSONNAGE_GUIDE
    ? personnageGuide.expressions
    : FELICITATIONS_COMMUNES;
  return { texte: tirerDans(textes, hasard) };
}

export function encourager(hasard: Hasard): Encouragement {
  return { texte: tirerDans(ENCOURAGEMENTS, hasard) };
}

export function presentationAuRetourDuSon(personnageGuide: PersonnageGuide): string {
  return `Je t'entends ! Je suis ${personnageGuide.nom}.`;
}

function contracterAvecDe(royaume: string): string {
  if (royaume.startsWith("le ")) return `du ${royaume.slice(3)}`;
  if (royaume.startsWith("la ")) return `de la ${royaume.slice(3)}`;
  return `de ${royaume}`;
}

export function presentation(univers: Univers): string {
  const { nom, titre } = univers.personnageGuide;
  return `Je suis ${nom}, ${titre} ${contracterAvecDe(univers.royaume)}.`;
}
