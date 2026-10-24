import { TexteSurligne } from "./TexteSurligne.tsx";
import type { NatureDeParole } from "./usePersonnageQuiParle.ts";

type Props = {
  readonly texte: string | undefined;
  readonly nature: NatureDeParole | undefined;
  readonly rangDuMotPrononce: number | undefined;
};

/** La dictée dit le mot sans l'afficher : les mots prononcés ne correspondent pas à ceux de la bulle, rien n'est surligné. */
export function BulleDuPersonnageGuide({ texte, nature, rangDuMotPrononce }: Props) {
  const rangASurligner = nature === "dictee" ? undefined : rangDuMotPrononce;
  return (
    <div className="bulle" aria-live="polite" data-testid="parole" data-nature={nature}>
      {texte !== undefined && <TexteSurligne texte={texte} rangDuMotPrononce={rangASurligner} />}
    </div>
  );
}
