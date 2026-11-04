import { motsDeLaConsigne, type SegmentDeConsigne } from "@domain/voix";
import { TexteEnSyllabes } from "../reglages/index.ts";

type Props = {
  readonly texte: string;
  readonly rangDuMotPrononce: number | undefined;
};

/** Un texte lu à voix haute, dont le mot prononcé est surligné. */
export function TexteSurligne({ texte, rangDuMotPrononce }: Props) {
  return (
    <>
      {motsDeLaConsigne(texte).map((segment, i) => (
        <SegmentSurligne key={i} segment={segment} rangDuMotPrononce={rangDuMotPrononce} />
      ))}
    </>
  );
}

/** Un mot (surligné s'il est prononcé) ou un bout de texte sans mot, tel quel. */
export function SegmentSurligne({ segment, rangDuMotPrononce }: { readonly segment: SegmentDeConsigne; readonly rangDuMotPrononce: number | undefined }) {
  const { texte, rang } = segment;
  if (rang === undefined) return texte;
  const prononce = rang === rangDuMotPrononce;
  return (
    <span className="mot" data-mot={rang} data-prononce={prononce ? "true" : undefined} aria-current={prononce ? "true" : undefined}>
      <TexteEnSyllabes texte={texte} />
    </span>
  );
}
