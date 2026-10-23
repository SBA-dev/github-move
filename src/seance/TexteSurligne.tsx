import { motsDeLaConsigne } from "@domain/voix";
import { TexteEnSyllabes } from "../reglages/index.ts";

type Props = {
  readonly texte: string;
  readonly rangDuMotPrononce: number | undefined;
};

/** Un texte lu à voix haute, dont le mot prononcé est surligné. */
export function TexteSurligne({ texte, rangDuMotPrononce }: Props) {
  return (
    <>
      {motsDeLaConsigne(texte).map(({ texte: segment, rang }, i) => {
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
            <TexteEnSyllabes texte={segment} />
          </span>
        );
      })}
    </>
  );
}
