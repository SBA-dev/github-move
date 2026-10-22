import { texteALire } from "@domain/voix";
import type { Consigne } from "./consigne-preparee.ts";

type Morceau = { readonly texte: string; readonly rang?: number; readonly enGras: boolean };

function motSansPonctuation(jeton: string): string {
  return jeton.match(/[\p{L}\p{N}'’-]+/u)?.[0] ?? "";
}

function decouper({ texte, motEnGras }: Consigne): Morceau[] {
  let rang = 0;
  return texte.split(/(\s+)/).filter(Boolean).map((jeton) => {
    const estUnMotLu = !/^\s/.test(jeton) && texteALire(jeton) !== undefined;
    return {
      texte: jeton,
      rang: estUnMotLu ? rang++ : undefined,
      enGras: estUnMotLu && motEnGras !== undefined && motSansPonctuation(jeton) === motEnGras,
    };
  });
}

type Props = { readonly consigne: Consigne; readonly rangDuMotPrononce: number | undefined };

export function ConsigneLue({ consigne, rangDuMotPrononce }: Props) {
  return (
    <p className="consigne" data-testid="consigne" lang={consigne.langue}>
      {decouper(consigne).map(({ texte, rang, enGras }, i) => {
        if (rang === undefined) return texte;
        const prononce = rang === rangDuMotPrononce;
        const proprietes = {
          className: "mot",
          "data-mot": rang,
          "data-prononce": prononce ? "true" : undefined,
          "aria-current": prononce ? ("true" as const) : undefined,
        };
        return enGras ? <strong key={i} {...proprietes}>{texte}</strong> : <span key={i} {...proprietes}>{texte}</span>;
      })}
    </p>
  );
}
