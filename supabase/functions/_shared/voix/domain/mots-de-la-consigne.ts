import { textePrononce } from "./texte-a-lire.ts";

export type SegmentDeConsigne = {
  readonly texte: string;
  readonly rang?: number;
};

const CONTIENT_UNE_LETTRE_OU_UN_CHIFFRE = /[\p{L}\p{N}]/u;

export function motsDeLaConsigne(texteAffiche: string): SegmentDeConsigne[] {
  let rang = 0;
  return texteAffiche.split(/(\s+)/).filter(Boolean).map((texte) =>
    CONTIENT_UNE_LETTRE_OU_UN_CHIFFRE.test(texte) ? { texte, rang: rang++ } : { texte }
  );
}

function motsPrononces(texte: string): string[] {
  return textePrononce(texte).split(/\s+/).filter(Boolean);
}

export function rangAffichePourChaqueMotPrononce(texteAffiche: string): Array<number | undefined> {
  return motsDeLaConsigne(texteAffiche).flatMap(({ texte, rang }) => motsPrononces(texte).map(() => rang));
}
