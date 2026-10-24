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

export function tirerDans(textes: readonly string[], hasard: Hasard): string {
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

const RELANCES: readonly string[] = ["Oui ! Et après ?", "Bien ! Et ensuite ?", "Super ! La suite ?"];
const PROBABILITE_DE_FELICITER_UNE_FOIS_SUR_DEUX = 0.5;

export function relancer(hasard: Hasard): string {
  return tirerDans(RELANCES, hasard);
}

export function feliciterUneFoisSurDeux(personnageGuide: PersonnageGuide, hasard: Hasard): string | undefined {
  if (tirage(hasard) >= PROBABILITE_DE_FELICITER_UNE_FOIS_SUR_DEUX) return undefined;
  return feliciter(personnageGuide, hasard).texte;
}

export type ParoleDueApresUneBonneReponse =
  | "felicitation"
  | "felicitationUneFoisSurDeux"
  | "relance"
  | "applaudir"
  | "tuSaisConjuguer";

export function paroleApresUneBonneReponse(
  paroleDue: ParoleDueApresUneBonneReponse | undefined,
  personnageGuide: PersonnageGuide,
  hasard: Hasard,
  verbe?: string,
): string | undefined {
  switch (paroleDue) {
    case "felicitation":
      return feliciter(personnageGuide, hasard).texte;
    case "felicitationUneFoisSurDeux":
      return feliciterUneFoisSurDeux(personnageGuide, hasard);
    case "relance":
      return relancer(hasard);
    case "tuSaisConjuguer":
      return verbe === undefined ? undefined : direTuSaisConjuguer(verbe, personnageGuide, hasard);
    case "applaudir":
    case undefined:
      return undefined;
  }
}

export function direLeTexteComplet(personnageGuide: PersonnageGuide, hasard: Hasard): string {
  return `${feliciter(personnageGuide, hasard).texte} Le texte est complet !`;
}

export function direTuSaisConjuguer(verbe: string, personnageGuide: PersonnageGuide, hasard: Hasard): string {
  return `${feliciter(personnageGuide, hasard).texte} Tu sais conjuguer ${verbe} !`;
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

export function saluer(prenom: string): string {
  return `Bonjour ${prenom} !`;
}

function phrases(...morceaux: (string | undefined)[]): string {
  return morceaux.filter((morceau) => morceau).join(" ");
}

export function direJeNeSaisPasAvecLesChoix(aide: string | undefined): string {
  return phrases(
    "Pas de souci, on apprend ensemble !",
    aide,
    "La bonne réponse brille : touche-la.",
  );
}

export function direJeNeSaisPasEnDictee(maniere: "briller" | "ecrire"): string {
  return phrases(
    "Pas de souci, on apprend ensemble !",
    maniere === "briller" ? "La bonne lettre brille : touche-la." : "Voici la lettre suivante. Écris la suite.",
  );
}

export function direJeNeSaisPasAuClavierDeCristaux(
  reponse: string,
  aide: string | undefined,
): string {
  return phrases(
    "Pas de souci !",
    aide,
    `La réponse est ${reponse}.`,
    "Tape-la sur les cristaux.",
  );
}

export function inviterACreerLePremierProfil(): string {
  return "Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite.";
}
