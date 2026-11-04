import { rangAffichePourChaqueMotPrononce } from "./mots-de-la-consigne.ts";
import { motsPrononces, texteALire } from "./texte-a-lire.ts";

function rangDePhrasePourChaqueMotPrononce(texteAffiche: string): number[] {
  const phrases = texteALire(texteAffiche)?.phrases ?? [];
  return phrases.flatMap((phrase, rangDePhrase) => motsPrononces(phrase).map(() => rangDePhrase));
}

export function phrasesDesMotsAffiches(texteAffiche: string): number[] {
  const rangsDePhrase = rangDePhrasePourChaqueMotPrononce(texteAffiche);
  const phraseDuMotAffiche: (number | undefined)[] = [];
  rangAffichePourChaqueMotPrononce(texteAffiche).forEach((rangAffiche, rangDuMotPrononce) => {
    if (rangAffiche !== undefined && phraseDuMotAffiche[rangAffiche] === undefined) {
      phraseDuMotAffiche[rangAffiche] = rangsDePhrase[rangDuMotPrononce];
    }
  });
  return motsAffichesSansPhraseApresLeMotPrecedent(phraseDuMotAffiche);
}

function motsAffichesSansPhraseApresLeMotPrecedent(phrases: readonly (number | undefined)[]): number[] {
  let phraseDuMotPrecedent = 0;
  return Array.from(phrases, (phrase) => phraseDuMotPrecedent = phrase ?? phraseDuMotPrecedent);
}
