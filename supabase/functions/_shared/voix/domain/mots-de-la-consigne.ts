import { motsPrononces, textePrononce } from "./texte-a-lire.ts";

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

function nombreDeMotsPrononces(texte: string): number {
  return motsPrononces(textePrononce(texte)).length;
}

export function rangAffichePourChaqueMotPrononce(texteAffiche: string): readonly (number | undefined)[] {
  let debut = "";
  let dejaPrononces = 0;
  return motsDeLaConsigne(texteAffiche).flatMap(({ texte, rang }) => {
    debut += texte;
    const prononcesAvecCeMot = nombreDeMotsPrononces(debut);
    const nouveaux = prononcesAvecCeMot - dejaPrononces;
    dejaPrononces = prononcesAvecCeMot;
    return Array.from({ length: nouveaux }, () => rang);
  });
}
