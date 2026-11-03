import { rangAffichePourChaqueMotPrononce } from "./mots-de-la-consigne.ts";
import { texteALire } from "./texte-a-lire.ts";

function rangDePhrasePourChaqueMotPrononce(texteAffiche: string): number[] {
  const phrases = texteALire(texteAffiche)?.phrases ?? [];
  return phrases.flatMap((phrase, rangDePhrase) => phrase.split(/\s+/).filter(Boolean).map(() => rangDePhrase));
}

export function phrasesDesMotsAffiches(texteAffiche: string): number[] {
  const rangsDePhrase = rangDePhrasePourChaqueMotPrononce(texteAffiche);
  const phraseDuMotAffiche: number[] = [];
  rangAffichePourChaqueMotPrononce(texteAffiche).forEach((rangAffiche, i) => {
    if (rangAffiche !== undefined && phraseDuMotAffiche[rangAffiche] === undefined) {
      phraseDuMotAffiche[rangAffiche] = rangsDePhrase[i];
    }
  });
  return phraseDuMotAffiche;
}
