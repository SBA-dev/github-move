import { motsDeLaConsigne } from "@domain/voix";
import type { NatureDeParole } from "./usePersonnageQuiParle.ts";

type Props = {
  readonly texte: string | undefined;
  readonly nature: NatureDeParole | undefined;
  readonly rangDuMotPrononce: number | undefined;
};

export function BulleDuPersonnageGuide({ texte, nature, rangDuMotPrononce }: Props) {
  return (
    <div className="bulle" aria-live="polite" data-testid="parole" data-nature={nature}>
      {texte !== undefined && motsDeLaConsigne(texte).map(({ texte: segment, rang }, i) => {
        if (rang === undefined) return segment;
        const prononce = rang === rangDuMotPrononce;
        return (
          <span
            key={i}
            className="mot"
            data-mot={rang}
            data-prononce={prononce ? "true" : undefined}
            aria-current={prononce ? "true" : undefined}
          >
            {segment}
          </span>
        );
      })}
    </div>
  );
}
