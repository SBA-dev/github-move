import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import type { Hasard } from "./hasard.ts";
import type { TexteALire } from "./texte-a-lire.ts";
import { estMasculine, type VoixDisponible } from "./voix-disponible.ts";

export type ReglageDePhrase = {
  readonly phrase: string;
  readonly hauteur: number;
  readonly rythme: number;
};

const ABAISSEMENT_VOIX_NON_MASCULINE = 0.25;
const HAUSSE_EXCLAMATION = 0.08;
const AMPLITUDE_VARIATION = 0.06;
const HAUTEUR_MIN = 0.5;
const HAUTEUR_MAX = 2;
const RYTHME_MAX = 1.4;

function hauteurDeBase(caractere: CaractereDeLaVoix, voix: VoixDisponible | undefined): number {
  const voixAGraver = caractere.sexe === "masculine" && voix !== undefined && !estMasculine(voix);
  return voixAGraver ? caractere.hauteur - ABAISSEMENT_VOIX_NON_MASCULINE : caractere.hauteur;
}

export function reglerPhrases(
  texte: TexteALire,
  caractere: CaractereDeLaVoix,
  voix: VoixDisponible | undefined,
  rythmeDemande: number,
  hasard: Hasard,
): ReglageDePhrase[] {
  const base = hauteurDeBase(caractere, voix);
  const rythme = Math.min(RYTHME_MAX, caractere.rythme * rythmeDemande);
  return texte.phrases.map((phrase) => {
    const exclamation = phrase.endsWith("!") ? HAUSSE_EXCLAMATION : 0;
    const variation = (hasard.entre0et1() - 0.5) * AMPLITUDE_VARIATION;
    const hauteur = Math.max(HAUTEUR_MIN, Math.min(HAUTEUR_MAX, base + exclamation + variation));
    return { phrase, hauteur, rythme };
  });
}
