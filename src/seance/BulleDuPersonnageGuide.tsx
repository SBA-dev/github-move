import { TexteSurligne } from "./TexteSurligne.tsx";
import type { NatureDeParole } from "./usePersonnageQuiParle.ts";

type Props = {
  readonly texte: string | undefined;
  readonly nature: NatureDeParole | undefined;
  readonly rangDuMotPrononce: number | undefined;
};

export function BulleDuPersonnageGuide({ texte, nature, rangDuMotPrononce }: Props) {
  return (
    <div className="bulle" aria-live="polite" data-testid="parole" data-nature={nature}>
      {texte !== undefined && <TexteSurligne texte={texte} rangDuMotPrononce={rangDuMotPrononce} />}
    </div>
  );
}
